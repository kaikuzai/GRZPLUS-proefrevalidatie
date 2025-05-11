from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'first_name', 'last_name', 'caregiver_id', 'street_address', 'city', 'state', 'zip_code', 'bsn']

class UserShortSerializer(serializers.ModelSerializer):
    class Meta: 
        model = User 
        fields = ['email', 'role', 'first_name', 'last_name']