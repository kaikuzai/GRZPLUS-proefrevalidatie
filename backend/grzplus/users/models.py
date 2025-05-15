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

class User(AbstractUser):
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.PATIENT,
    )

    # Common fields
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=128, blank=False)
    is_password_set = models.BooleanField(default=False)

    # Fields for Caregiver
    caregiver_id = models.CharField(max_length=10, blank=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)

    # Fields for Patient
    street_address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    zip_code = models.CharField(max_length=10, blank=True)
    bsn = models.CharField(max_length=10, blank=True)

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

