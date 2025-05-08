from django.db import models
from django.contrib.auth.models import AbstractUser

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

    def __str__(self):
        return self.email
    

