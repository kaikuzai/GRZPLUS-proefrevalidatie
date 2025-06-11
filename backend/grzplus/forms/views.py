import os 
import sys
import json 

from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework import status 

from .models.forms import Form
from .models.form_submittion import SubmittedForm

from .serializers import FormFieldSerializer, FormSerializer, FormIconSerializer, FormResponseSerializer

from users.models import Role
from deployment.functions.upload_to_storage_acocunt import upload_file_to_storage

# Create your views here.
class FormIDDetailView(APIView):
    def get(self, request, form_id):
        try:
            form = Form.objects.get(id=form_id)
            serializer = FormSerializer(form)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Form.DoesNotExist():
            print("this form doesn't exit")

class FormSlugDetailView(APIView):
    def get(self, request, form_slug):
        try:
            form = Form.objects.get(slug=form_slug)
            serializer = FormSerializer(form)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Form.DoesNotExist():
            print("this form doesn't exit")

class FormListView(APIView):
    def get(self, request, *args, **kwargs): 
        forms = Form.objects.all().order_by('id')

        serializer = FormSerializer(forms, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class FormIconView(APIView):
    def get(self, request):
        forms = Form.objects.all()

        serializer = FormIconSerializer(forms, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class SubmitFormView(APIView):
    def post(self, request):

        user = request.user
        image_file = request.FILES.get('file')

        # formData is a JSON string, so we need to parse it
        form_data_str = request.data.get('formData')

        if not form_data_str:
            return Response({'error': 'Missing formData'}, status=400)

        try:
            form_data = json.loads(form_data_str)
        except json.JSONDecodeError:
            return Response({'error': 'Invalid JSON in formData'}, status=400)
        
        form_id = form_data.get('formId')
        answers = form_data.get('answers')

        if not form_id or not answers:
            return Response({'error': 'Missing formId or answers'}, status=400)

        form = Form.objects.get(id=form_id)

        # Upload image to Azure Blob Storage if present
        contentUrl = None
        if image_file:
            contentUrl = upload_file_to_storage(str(user.id), image_file.name, image_file)

        submitted_form = SubmittedForm.objects.create(
            form=form,
            form_name=form.name, 
            user=user,
            form_data=answers,
            contentUrl=contentUrl,
        )
        submitted_form.save()

        return Response({'response':'Succeeded'})
    


class SubmittedFormListView(APIView):
    """
    View to list all submitted forms or filter by form_id, user, or date range.
    """
    def get(self, request, *args, **kwargs):
        # Start with all submitted forms
        submitted_forms = SubmittedForm.objects.all()
        user = request.user
        
        # Apply filters if provided in query parameters
        if user.role == Role.CAREGIVER:
            submitted_forms = submitted_forms.filter(user__caregiver=user)

        form_id = request.query_params.get('form_id')
        if form_id:
            submitted_forms = submitted_forms.filter(form__id=form_id)
            
        user_id = request.query_params.get('user_id')
        if user_id:
            submitted_forms = submitted_forms.filter(user__id=user_id)
            
        date_from = request.query_params.get('date_from')
        if date_from:
            submitted_forms = submitted_forms.filter(created_at__gte=date_from)
            
        date_to = request.query_params.get('date_to')
        if date_to:
            submitted_forms = submitted_forms.filter(created_at__lte=date_to)
        
        # Order by most recent first
        submitted_forms = submitted_forms
        

        serializer = FormResponseSerializer(submitted_forms, many=True, context={'request': request})
        
        return Response(serializer.data, status=status.HTTP_200_OK)
