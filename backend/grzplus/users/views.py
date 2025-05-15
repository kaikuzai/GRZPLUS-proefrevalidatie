
from django.contrib.auth import login, logout, authenticate 
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect 
from django.middleware.csrf import get_token
from django.conf import settings 
from django.shortcuts import get_object_or_404


from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions, status 


from .models import User, PasswordResetToken
from .serializers import UserSerializer, SetPasswordSerializer

from emails.views import registration_email, set_password_email

# Create a generic view to list all users
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()  # Get all users
    serializer_class = UserSerializer 


# Login view 
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, format=None):
        data = self.request.data
        
        username = data['username']
        password = data['password']

        user = authenticate(username=username, password=f"{password}")

        if user is not None:
            try:
                login(request, user)
                return Response({
                    'response': 'Succeeded',
                    'role': user.role,
                    'email': user.username,
                    'name': user.first_name,  
                    })
            except Exception as e:
                print(f'Something went wrong authenticating {username}', e)
        else:
            return Response({'response': 'Failed'})
        

# Logout View 
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        logout(request)
        return Response({'success':'User logged out'})
    
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):
        data = self.request.data 

        email = data['email']
        first_name = data['firstName']
        last_name = data['lastName']
        password = data['password']

        if User.objects.filter(username=email).exists():
            return Response({'response':'Failed, user already exists'})
        else:
            user = User.objects.create_user(username=email, password=password, first_name=first_name, last_name=last_name)
            user.save()
            
            registration_email(user, "ddd")

            return Response({'response: Succeeded'})

class RegisterWithoutPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):
        data = self.request.data 

        email = data['email']
        first_name = data['first_name']
        last_name = data['last_name']

        if User.objects.filter(username=email).exists():
            return Response({"detail":'user already exists'}, status=status.HTTP_409_CONFLICT)
        else:
            user = User.objects.create_user(
                username=email,
                password=None, 
                first_name=first_name, 
                last_name= last_name
            )

            user.is_active = True 
            user.set_unusable_password()
            user.save()

            token = PasswordResetToken.objects.create(
                user=user
            )

            token.save()

            reset_url = f"{settings.FRONTEND_URL}/set-password/{token.token}"

            context = {
                'first_name': user.first_name, 
                'reset_url': reset_url, 
            }

            set_password_email(user, context=context)

            return Response({'response': 'Succeeded'})

class PasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):
        data = self.request.data

        action = data['action']

        if action == 'set_password':
            return self.set_password(request)
        elif action == 'validate_token':
            return self.validate_token(request)
        else:
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)


    def set_password(self, request):
        data = self.request.data['data']

        serializer_data = {
            'password': data['password'],
            'confirm_password': data['confirm_password'],
            'token': data['token'],
        }


        serializer = SetPasswordSerializer(data=serializer_data)


        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
        if serializer.is_valid():
            token_uuid = serializer.validated_data['token']
            token = get_object_or_404(PasswordResetToken, token=token_uuid)

            if not token.is_valid():
                return Response(
                    {"error": "Token is expired or has been used"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = token.user
            user.set_password(serializer.validated_data['password'])
            user.is_password_set = True
            user.save()
            
            # Mark token as used
            token.is_used = True
            token.save()

            return Response({'response': 'succeeded'})

    def validate_token(self, request): 
        token_uuid = request.data.get('token')
        if not token_uuid:
            return Response(
                {"error": "Token is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            token = PasswordResetToken.objects.get(token=token_uuid)
            if token.is_valid():
                return Response({"valid": True})
            return Response({"valid": False, "reason": "expired"})
        except PasswordResetToken.DoesNotExist:
            return Response({"valid": False, "reason": "not_found"})



@method_decorator(ensure_csrf_cookie, name='dispatch')       
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        csrf_token = get_token(request)

        return Response({'success': 'CSRF Token was set',
                         'token': csrf_token})

@method_decorator(csrf_protect, name='dispatch') 
class CheckAuthenticatedView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        isAuthenticated = User.is_authenticated
        name = request.user 
        


        if isAuthenticated:
            return Response({'name':f'{name}',
                             'request_session': request.session,
                             'is_authenticated': request.user.is_authenticated,
                             'is_anonymous': request.user.is_anonymous,
                             }
                             , status=200)
        else:
            return Response({'response':'False'})


# Check if user is authenticated
@method_decorator(csrf_protect, name='dispatch') 
class CheckAuthenticatedView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        isAuthenticated = User.is_authenticated
        name = request.user 
        


        if isAuthenticated:
            return Response({'name':f'{name}',
                             'request_session': request.session,
                             'is_authenticated': request.user.is_authenticated,
                             'is_anonymous': request.user.is_anonymous,
                             }
                             , status=200)
        else:
            return Response({'response':'False'})


