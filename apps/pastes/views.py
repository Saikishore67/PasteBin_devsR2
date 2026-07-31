from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db import connection
from django.db.models import Q
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiResponse, OpenApiExample

from .models import Paste
from .serializers import PasteSerializer
from .permissions import IsOwnerOrReadOnly

@extend_schema_view(
    get=extend_schema(
        summary="List pastes",
        description="Returns public pastes for anonymous users. Logged-in users also see their own pastes (any visibility).",
        responses={
            200: PasteSerializer(many=True),
            500: OpenApiResponse(description="Internal server error"),
        },
    ),
    post=extend_schema(
        summary="Create a paste",
        description="Anonymous users can create pastes (owner will be null). Logged-in users' pastes are auto-owned.",
        responses={
            201: PasteSerializer,
            400: OpenApiResponse(description="Validation error (e.g. missing content)"),
            500: OpenApiResponse(description="Internal server error"),
        },
    ),
)

class PasteListCreateView(generics.ListCreateAPIView):
    serializer_class = PasteSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            # Logged-in users see: their own pastes (any visibility) + public pastes from others
            return Paste.objects.filter(
                Q(owner=user) | Q(visibility='public')
            )
        # Anonymous users only see public pastes
        return Paste.objects.filter(visibility='public')

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_authenticated:
            serializer.save(owner=user)
        else:
            serializer.save(owner=None)

@extend_schema_view(
    get=extend_schema(
        summary="Retrieve a paste",
        description="Fetch a single paste by UUID. Private pastes return 404 for non-owners (existence is hidden).",
        responses={
            200: PasteSerializer,
            404: OpenApiResponse(description="Paste not found, or private and not owned by you"),
            500: OpenApiResponse(description="Internal server error"),
        },
    ),
    put=extend_schema(
        summary="Update a paste (full)",
        responses={
            200: PasteSerializer,
            400: OpenApiResponse(description="Validation error"),
            401: OpenApiResponse(description="Authentication required"),
            403: OpenApiResponse(description="You do not own this paste"),
            404: OpenApiResponse(description="Paste not found"),
            500: OpenApiResponse(description="Internal server error"),
        },
    ),
    patch=extend_schema(
        summary="Update a paste (partial)",
        responses={
            200: PasteSerializer,
            400: OpenApiResponse(description="Validation error"),
            401: OpenApiResponse(description="Authentication required"),
            403: OpenApiResponse(description="You do not own this paste"),
            404: OpenApiResponse(description="Paste not found"),
            500: OpenApiResponse(description="Internal server error"),
        },
    ),
    delete=extend_schema(
        summary="Delete a paste",
        responses={
            204: OpenApiResponse(description="Paste deleted successfully"),
            401: OpenApiResponse(description="Authentication required"),
            403: OpenApiResponse(description="You do not own this paste"),
            404: OpenApiResponse(description="Paste not found"),
            500: OpenApiResponse(description="Internal server error"),
        },
    ),
)

class PasteDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PasteSerializer
    permission_classes = [IsOwnerOrReadOnly]
    lookup_field = 'id'

    def get_queryset(self):
        # Anyone can attempt to fetch by UUID — visibility logic decides access
        return Paste.objects.all()

    def get_object(self):
        obj = super().get_object()
        user = self.request.user

        # Enforce read access based on visibility
        if obj.visibility == 'private' and obj.owner != user:
            from rest_framework.exceptions import NotFound
            raise NotFound()  # hide existence of private pastes from non-owners

        return obj

@extend_schema(
    summary="Health check",
    description="Returns API and database connectivity status. Used for uptime monitoring.",
    responses={
        200: OpenApiResponse(
            description="Service is healthy",
            examples=[OpenApiExample("Healthy", value={"status": "ok", "database": "ok"})],
        ),
        500: OpenApiResponse(description="Database unreachable or service degraded"),
    },
)

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    db_status = 'ok'
    try:
        connection.ensure_connection()
    except Exception:
        db_status = 'unreachable'

    return Response({
        'status': 'ok' if db_status == 'ok' else 'degraded',
        'database': db_status,
    })