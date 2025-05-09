# users/management/commands/test_user_creation.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model, authenticate

class Command(BaseCommand):
    help = "Create a user with an email and password, and authenticate the user"

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Email address of the user')
        parser.add_argument('password', type=str, help='Password for the user')

    def handle(self, *args, **kwargs):
        email = kwargs['email']
        password = kwargs['password']
        
        User = get_user_model()
        user = User.objects.create_user(username=email, password=password)
        user.save()
        self.stdout.write(self.style.SUCCESS(f"User created: {user.email}"))

        authenticated_user = authenticate(username=user.username, password=f"{password}")
        
        if authenticated_user is not None:
            self.stdout.write(self.style.SUCCESS("Authentication successful"))
        else:
            self.stdout.write(self.style.ERROR("Authentication failed"))
