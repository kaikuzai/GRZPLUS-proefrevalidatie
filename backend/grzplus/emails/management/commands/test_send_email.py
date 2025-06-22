# users/management/commands/test_send_email.py
from django.core.management.base import BaseCommand
from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from django.contrib.auth.models import User
from django.template.loader import render_to_string
from django.utils.html import strip_tags

class Command(BaseCommand):
    help = 'Test the email-sending functionality by creating a test user and sending a simple welcome email.'

    def handle(self, *args, **kwargs):

        # Define the subject and message for the email
        subject = "Welcome to Our Platform"
        message = f"Hi \n\nThank you for registering on our platform."

        # Send the email (simple plain text email)
        send_mail(
            subject,
            message,  # Plain text message
            settings.DEFAULT_FROM_EMAIL,  # From email address (set this in settings)
            [],
            fail_silently=False
        )

        html_message = render_to_string("templates/emails/email_confirmation.html")
        plain_message = strip_tags(html_message)

        message = EmailMultiAlternatives(
            subject=subject, 
            body=plain_message,
            from_email=None,
            to=[],
        )

        message.attach_alternative(html_message, "text/html")
        message.send()

        # Inform the user that the email was sent
        self.stdout.write(self.style.SUCCESS(f"Test email sent to .okyere@gmail.com"))
