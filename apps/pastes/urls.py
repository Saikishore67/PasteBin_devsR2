from django.urls import path
from .views import PasteListCreateView, PasteDetailView

urlpatterns = [
    path('', PasteListCreateView.as_view(), name='paste-list-create'),
    path('<uuid:id>/', PasteDetailView.as_view(), name='paste-detail'),
]