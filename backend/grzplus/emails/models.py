from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.
class Email(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='emails', default=None)

    subject = models.CharField(max_length=255)
    message = models.TextField(max_length=500)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    edited_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.subject 