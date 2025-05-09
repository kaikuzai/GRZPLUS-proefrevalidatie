from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.
class Form(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name 
    
class FormField(models.Model):
    TEXT = 'text'
    YESNO = 'yesno'

    FIELD_TYPES = [
        (TEXT, 'Text'),
        (YESNO, 'Yes/No'),
    ]

    label = models.CharField(max_length=255)
    field_type = models.CharField(max_length=10, choices=FIELD_TYPES)
    placeholder = models.CharField(max_length=255, null=True, blank=True)
    required = models.BooleanField(default=True) 
    forms = models.ManyToManyField(Form, related_name='fields')  

    def __str__(self):
        return self.label
    

