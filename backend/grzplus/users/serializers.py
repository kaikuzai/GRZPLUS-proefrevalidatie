from rest_framework import serializers
from .models import User
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    caregiver = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'first_name', 'last_name', 'caregiver']

class UserShortSerializer(serializers.ModelSerializer):
    class Meta: 
        model = User 
        fields = ['email', 'role', 'first_name', 'last_name']

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            # Set an unusable password until the user sets their own
            password=None
        )
        user.is_active = True
        user.set_unusable_password()
        user.save()
        return user
    
class PatientDetailSerializer(serializers.ModelSerializer):
    caregiver_email = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'first_name', 'last_name', 'caregiver', 
                 'caregiver_email']

    def get_caregiver_email(self, obj: User):
        if obj.caregiver.exists():
            caregivers = obj.caregiver.all()
            return ", ".join(f"{caregiver.email}" for caregiver in caregivers)
        return None

class SetPasswordSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    password = serializers.CharField(min_length=8, write_only=True)
    confirm_password = serializers.CharField(min_length=8, write_only=True)

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data
