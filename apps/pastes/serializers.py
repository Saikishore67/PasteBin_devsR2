from rest_framework import serializers
from .models import Paste


class PasteSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Paste
        fields = [
            'id', 'owner', 'title', 'content',
            'language', 'visibility', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']