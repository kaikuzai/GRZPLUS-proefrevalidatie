from django.db import models 
from django.contrib.auth import get_user_model
from .forms import Form 


User = get_user_model()

class SubmittedForm(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    form = models.ForeignKey(Form, on_delete=models.SET_NULL, null=True)
    form_name = models.CharField(max_length=255)
    
    submitted_at = models.DateTimeField(auto_now_add=True)
    form_data = models.JSONField()

    contentUrl = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"{self.user} - {self.form_name}"