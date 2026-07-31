import uuid
from django.db import models
from django.conf import settings


class Paste(models.Model):
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('unlisted', 'Unlisted'),
        ('private', 'Private'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='pastes'
    )
    title = models.CharField(max_length=255, blank=True, default='Untitled')
    content = models.TextField()
    language = models.CharField(max_length=50, blank=True, default='plaintext')
    visibility = models.CharField(
        max_length=10,
        choices=VISIBILITY_CHOICES,
        default='unlisted'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.id})"