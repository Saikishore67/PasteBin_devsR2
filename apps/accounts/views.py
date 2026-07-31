from rest_framework import generics, permissions
from drf_spectacular.utils import extend_schema, OpenApiResponse
from .serializers import RegisterSerializer, UserSerializer

@extend_schema(
    summary="Register a new user",
    description="Creates a new account using email + password. Returns the created user (no auto-login; call /login/ separately).",
    responses={
        201: UserSerializer,
        400: OpenApiResponse(description="Validation error (e.g. email already exists, password too short)"),
        500: OpenApiResponse(description="Internal server error"),
    },
)

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

@extend_schema(
    summary="Get current logged-in user",
    responses={
        200: UserSerializer,
        401: OpenApiResponse(description="Authentication credentials were not provided or are invalid"),
        500: OpenApiResponse(description="Internal server error"),
    },
)

class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user