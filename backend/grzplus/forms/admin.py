from django.contrib import admin
from .models.forms import Form
from .models.form_fields import FormField
from .models.form_submittion import SubmittedForm

# Register your models here.
admin.site.register(Form)
admin.site.register(FormField)
admin.site.register(SubmittedForm)