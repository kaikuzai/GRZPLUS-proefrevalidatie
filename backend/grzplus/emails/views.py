from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response 

from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from django.contrib.auth import get_user_model
User = get_user_model()

def set_password_email_patient(user, context: dict):
    try:
        subject = "GRZ Revalidatie wachtwoord"


        html_message = render_to_string("content/patient-registration.html", context=context)
        plain_message = strip_tags(html_message)

        message = EmailMultiAlternatives(
            subject=subject, 
            body=plain_message,
            from_email=None,
            # 
            to=[user.email],
        )

        message.attach_alternative(html_message, "text/html")
        message.send()

        return True 
    except Exception as e: 
        print(e)
        return False
    
    
def set_password_email_caregiver(user, context: dict):
    try:
        subject = "GRZ Revalidatie wachtwoord"

        html_message = render_to_string("content/caregiver-registration.html", context=context)
        plain_message = strip_tags(html_message)

        message = EmailMultiAlternatives(
            subject=subject, 
            body=plain_message,
            from_email=None,
            to=[user.email],
        )

        message.attach_alternative(html_message, "text/html")
        message.send()

        return True 
    except Exception as e: 
        print(e)
        return False
    