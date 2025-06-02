from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()
    
class FormField(models.Model):
    TEXT = 'text'
    YESNO = 'yesno'
    RATING = 'rating'

    FIELD_TYPES = [
        (TEXT, 'Text'),
        (YESNO, 'Yes/No'),
        (RATING, 'Rating')
    ]

    label = models.CharField(max_length=255)
    type = models.CharField(max_length=10, choices=FIELD_TYPES)
    placeholder = models.CharField(max_length=255, null=True, blank=True)
    required = models.BooleanField(default=True)

    def __str__(self):
        return self.label
    

