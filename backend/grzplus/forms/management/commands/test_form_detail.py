# forms/management/commands/test_form_detail.py
from django.core.management.base import BaseCommand
from django.http import JsonResponse
from forms.models.forms import Form
from forms.serializers import FormSerializer
from rest_framework.response import Response
from rest_framework import status

class Command(BaseCommand):
    help = "Test the FormDetailView logic by directly using the serializer."

    def add_arguments(self, parser):
        parser.add_argument('form_id', type=int, help="The ID of the form to retrieve.")

    def handle(self, *args, **kwargs):
        form_id = kwargs['form_id']
        
        try:
            # Try to retrieve the form by ID
            form = Form.objects.get(id=form_id)
            
            # Serialize the form using FormSerializer
            serializer = FormSerializer(form)
            
            # Print the serialized data (similar to returning in the view)
            self.stdout.write(self.style.SUCCESS("Form retrieved successfully"))
            self.stdout.write(str(serializer.data))
        
        except Form.DoesNotExist:
            # Handle the case where the form does not exist
            self.stdout.write(self.style.ERROR(f"Form with ID {form_id} not found"))
            return Response({"response": "Form not found"}, status=status.HTTP_404_NOT_FOUND)
