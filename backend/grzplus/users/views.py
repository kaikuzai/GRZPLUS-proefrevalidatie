from django.contrib.auth import login, logout, authenticate 
from django.shortcuts import get_object_or_404
from django.conf import settings 


from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions, status 

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, PasswordResetToken, Role
from .serializers import UserSerializer, SetPasswordSerializer


from emails.views import registration_email, set_password_email_patient, set_password_email_supporter

# Create a generic view to list all users
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()  # Get all users
    serializer_class = UserSerializer 

    def get(self, request, *args, **kwargs):
        queryset = User.objects.all()
        user = request.user

        user_role = request.query_params.get('role')
        if user_role:
            queryset = queryset.filter(role=user_role)

        user_id = request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(id=int(user_id))

        if user.role == Role.CAREGIVER:
            if user_role == Role.PATIENT: 
                queryset = queryset.filter(caregiver=user)    
        
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        




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
        
    
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):
        print(request)
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
        print(request.user.email)
        data = self.request.data 


        email = data['email']
        first_name = data['firstName']
        last_name = data['lastName']

        supporter = data['mantelzorger']
        supporter_first_name = data['voornaamMantelzorger']
        supporter_last_name = data['achternaamMantelzorger']

       



        if User.objects.filter(username=email).exists():
            return Response({"detail":'user already exists'}, status=status.HTTP_409_CONFLICT)
        else:
            patient = User.objects.create_user(
                username=email,
                password=None, 
                first_name=first_name, 
                last_name= last_name
            )

            patient.is_active = True 
            patient.set_unusable_password()



            try:
                supporter = User.objects.get(username=supporter, role=Role.SUPPORTER)
            except User.DoesNotExist:
                supporter = User.objects.create_user(
                username=supporter,
                password=None,
                first_name=supporter_first_name,
                last_name=supporter_last_name,   # Add last_name if needed
                role=Role.SUPPORTER)

                supporter_token = PasswordResetToken.objects.create(user = supporter)
                supporter_token.save()

                reset_url = f"{settings.FRONTEND_URL}/set-password/{supporter_token.token}"

                context =  context = {
                    'supporter_first_name': supporter.first_name, 
                    'reset_url': reset_url, 
                }

                set_password_email_supporter(supporter, context=context)

            patient.supporter = supporter 
            
            try:
                caregiver = User.objects.get(email=request.user.email, role=Role.CAREGIVER)
                patient.caregiver = caregiver
            except User.DoesNotExist:
                return Response({"detail": "Caregiver user not found or not authorized"}, status=status.HTTP_400_BAD_REQUEST)
    
            

            patient.caregiver = caregiver
            
            patient.save()
                
            patient_token = PasswordResetToken.objects.create(
                user=patient
            )


            patient_token.save()

            reset_url = f"{settings.FRONTEND_URL}/set-password/{patient_token.token}"

            context = {
                'first_name': patient.first_name, 
                'reset_url': reset_url, 
            }

            set_password_email_patient(patient, context=context)

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



# !! Add endpoint to check authentication and JWT status 
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

class VerifyTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """
        Verify if provided token is valid
        """
        token = request.headers.get('Authorization')  # changed line

        if not token:
            return Response({
                'valid': False,
                'error': 'No token provided'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verify token
            UntypedToken(token)

            print("untyped whatever", UntypedToken(token))
            
            # Get user from token
            from rest_framework_simplejwt.tokens import AccessToken
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            user = User.objects.get(id=user_id)
            
            return Response({
                'valid': True,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'role': user.role,
                }
            }, status=status.HTTP_200_OK)
            
        except (InvalidToken, TokenError, User.DoesNotExist):
            return Response({
                'valid': False,
                'error': 'Invalid token'
            }, status=status.HTTP_401_UNAUTHORIZED)
        

# Add this to your views.py
from django.utils import timezone
class AuthenticationStatusView(APIView):
    permission_classes = [permissions.AllowAny]  # Allow anyone to check status

    def get(self, request):
        """
        Comprehensive authentication status check for debugging
        """
        response_data = {
            'timestamp': timezone.now().isoformat(),
            'request_info': {
                'method': request.method,
                'path': request.path,
                'user_agent': request.META.get('HTTP_USER_AGENT', 'Unknown'),
                'remote_addr': request.META.get('REMOTE_ADDR', 'Unknown'),
            },
            'session_info': {
                'session_key': request.session.session_key,
                'session_data': dict(request.session.items()) if hasattr(request.session, 'items') else {},
                'is_empty': request.session.is_empty() if hasattr(request.session, 'is_empty') else True,
            },
            'user_info': {
                'is_authenticated': request.user.is_authenticated,
                'is_anonymous': request.user.is_anonymous,
                'username': getattr(request.user, 'username', 'Anonymous'),
                'user_id': getattr(request.user, 'id', None),
                'first_name': getattr(request.user, 'first_name', ''),
                'last_name': getattr(request.user, 'last_name', ''),
                'email': getattr(request.user, 'email', ''),
                'role': getattr(request.user, 'role', None),
                'is_active': getattr(request.user, 'is_active', False),
                'is_staff': getattr(request.user, 'is_staff', False),
                'is_superuser': getattr(request.user, 'is_superuser', False),
                'date_joined': getattr(request.user, 'date_joined', None),
                'last_login': getattr(request.user, 'last_login', None),
            },
            'token_info': {
                'has_auth_header': 'HTTP_AUTHORIZATION' in request.META,
                'auth_header': request.META.get('HTTP_AUTHORIZATION', 'Not provided'),
                'token_valid': False,
                'token_error': None,
                'token_user_id': None,
                'token_exp': None,
                'token_type': None,
            },
            'cookies': {
                'csrftoken': request.COOKIES.get('csrftoken', 'Not found'),
                'sessionid': request.COOKIES.get('sessionid', 'Not found'),
                'all_cookies': list(request.COOKIES.keys()),
            },
            'csrf_info': {
                'csrf_token': request.META.get('CSRF_COOKIE', 'Not found'),
                'csrf_processing_view': getattr(request, 'csrf_processing_done', False),
            }
        }

        # JWT Token Analysis
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                from rest_framework_simplejwt.tokens import AccessToken
                access_token = AccessToken(token)
                
                response_data['token_info'].update({
                    'token_valid': True,
                    'token_user_id': access_token.get('user_id'),
                    'token_exp': access_token.get('exp'),
                    'token_type': access_token.get('token_type'),
                    'token_jti': access_token.get('jti'),
                    'token_iat': access_token.get('iat'),
                })
                
                # Try to get user from token
                try:
                    token_user = User.objects.get(id=access_token['user_id'])
                    response_data['token_info']['token_user_exists'] = True
                    response_data['token_info']['token_user_data'] = {
                        'id': token_user.id,
                        'username': token_user.username,
                        'email': token_user.email,
                        'first_name': token_user.first_name,
                        'role': token_user.role,
                        'is_active': token_user.is_active,
                    }
                except User.DoesNotExist:
                    response_data['token_info']['token_user_exists'] = False
                    
            except Exception as e:
                response_data['token_info'].update({
                    'token_valid': False,
                    'token_error': str(e),
                })

        # Add permissions info
        response_data['permissions_info'] = {
            'view_permission_classes': [cls.__name__ for cls in self.permission_classes],
            'user_permissions': list(request.user.get_all_permissions()) if request.user.is_authenticated else [],
            'user_groups': list(request.user.groups.values_list('name', flat=True)) if request.user.is_authenticated else [],
        }

        # Environment info (be careful with sensitive data)
        response_data['environment_info'] = {
            'debug_mode': settings.DEBUG,
            'jwt_access_token_lifetime': str(settings.SIMPLE_JWT.get('ACCESS_TOKEN_LIFETIME', 'Not set')),
            'jwt_refresh_token_lifetime': str(settings.SIMPLE_JWT.get('REFRESH_TOKEN_LIFETIME', 'Not set')),
            'cors_allow_all_origins': getattr(settings, 'CORS_ALLOW_ALL_ORIGINS', False),
            'cors_allow_credentials': getattr(settings, 'CORS_ALLOW_CREDENTIALS', False),
        }

        return Response(response_data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Test endpoint with POST data
        """
        auth_status = self.get(request)
        auth_data = auth_status.data
        
        # Add POST data info
        auth_data['post_data'] = {
            'has_post_data': bool(request.data),
            'post_keys': list(request.data.keys()) if request.data else [],
            'content_type': request.content_type,
            'data': request.data if request.data else None,
        }
        
        return Response(auth_data, status=status.HTTP_200_OK)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    permission_classes = [permissions.AllowAny]

    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add custom claims
        data['role'] = self.user.role
        data['email'] = self.user.email
        data['name'] = self.user.first_name
        data['id'] = self.user.id

        return data
    
class CustomTokenObtainPairView(TokenObtainPairView):
    print("**********************")
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            if (refresh_token): 
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({'success': 'User logged out'}, status=status.HTTP_200_OK)
            else:
                return Response({'succes': 'User logged out, no refresh token'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
