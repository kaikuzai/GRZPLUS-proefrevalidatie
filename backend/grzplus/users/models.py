from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import datetime 

import uuid 

# Create your models here.
class Role(models.TextChoices):
    ADMIN = 'admin', 'Administrator'
    CAREGIVER = 'caregiver', 'Caregiver'
    PATIENT = 'patient', 'Patient'
    SUPPORTER = 'supporter', 'Supporter'

class User(AbstractUser):
    role = models.CharField(
        max_length=16,
        choices=Role.choices,
        default=Role.PATIENT,
    )

    # Common fields
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=128, blank=False)
    is_password_set = models.BooleanField(default=False)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)

    caregiver = models.ManyToManyField(
        'self', 
        blank= True, 
        symmetrical=False, 
        related_name="caregiving_patients",
        limit_choices_to={'role': Role.CAREGIVER}
    )

    forms = models.JSONField(default=list, blank=True)

    def save(self, *args, **kwargs):
        if self.username:
            self.email = self.username
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email

class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.expires_at:
            # Token expires after 24 hours
            self.expires_at = self.created_at + datetime.timedelta(hours=24)
        super().save(*args, **kwargs)

    def is_valid(self):
        return not self.is_used and self.expires_at > timezone.now()
    
    def __str__(self):
        return f"Reset token belonging to {self.user}"

