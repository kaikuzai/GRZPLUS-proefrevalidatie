from rest_framework import serializers
from .models import Email



class EmailSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Email 
        fields = ['subject', 'message', 'created_at', ' edited_at']