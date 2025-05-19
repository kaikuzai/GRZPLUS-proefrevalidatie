from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify

from .form_fields import FormField

User = get_user_model()

# Create your models here.
class Form(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    image = models.CharField(max_length=255, default="trap.jpg")
    slug = models.CharField(max_length=255, unique=True, default="form-slug")
    description = models.TextField(blank=True, null=True)
    rating = models.TextField(blank=True)

    fields = models.ManyToManyField(FormField, related_name='forms')

    def save(self, *args, **kwargs): 
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


    def __str__(self):
        return self.name 

