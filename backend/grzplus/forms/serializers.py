from rest_framework import serializers
from .models.form_fields import FormField
from .models.forms import Form 
from .models.form_submittion import SubmittedForm

from users.serializers import UserShortSerializer


class FormFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormField
        fields = ['id', 'label', 'type', 'placeholder', 'required']


class FormSerializer(serializers.ModelSerializer):
    fields = FormFieldSerializer(many=True)
    creator = UserShortSerializer(read_only=True)

    class Meta:
        model = Form 
        fields = ['id', 'name', 'creator', 'created_at', 'fields']

class FormIconSerializer(serializers.ModelSerializer):   
    class Meta:
        model = Form
        fields = ['image', 'description', 'name', 'slug']

class FormDetailSerializer(serializers.ModelSerializer): 
    fields = FormFieldSerializer(many=True)

    class Meta:
        model = Form 
        fields = ['form', 'name', 'fields']

class FormResponseSerializer(serializers.ModelSerializer):
    formId = serializers.CharField(source='form.id')
    formName = serializers.CharField(source='form.name')
    patientName = serializers.SerializerMethodField()
    patientEmail = serializers.SerializerMethodField()
    submittedAt = serializers.DateTimeField(source='submitted_at', format='%Y-%m-%dT%H:%M:%SZ')
    answers = serializers.CharField(source='form_data')
    contentUrl = serializers.SerializerMethodField()
    
    class Meta:
        model = SubmittedForm
        fields = [
            'id', 
            'formId', 
            'formName', 
            'patientName', 
            'patientEmail', 
            'submittedAt', 
            'answers',
            'contentUrl',
        ]
    
    def get_patientName(self, obj):
        """
        Combine the user's first name and last name to create the patient name
        """
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}".strip()
        return "Anonymous"
    
    def get_patientEmail(self, obj):
        """
        Get the user's email address
        """
        if obj.user and obj.user.email:
            return obj.user.email
        return ""
    
    def get_contentUrl(self, obj):
        """
        Get the image url associated with the form 
        """
        if obj.contentUrl:
            return obj.contentUrl
        return None
    