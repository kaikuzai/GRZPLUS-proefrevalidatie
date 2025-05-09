from rest_framework import serializers
from .models import Form, FormField 



class FormFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormField
        fields = ['id', 'label', 'field_type', 'placeholder', 'required']


class FormSerializer(serializers.ModelSerializer):
    form_fields = FormFieldSerializer(many=True)

    class Meta:
        model = Form 
        fields = ['id', 'name', 'creator', 'created_at', 'form_fields']