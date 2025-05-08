
from django.contrib.auth import login, logout, authenticate 
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect 
from django.middleware.csrf import get_token


from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions 


from .models import User
from .serializers import UserSerializer

# Create a generic view to list all users
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()  # Get all users
    serializer_class = UserSerializer 


# Login view 
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, format=None):
        data = self.request.data
        
        email = data['email']
        password = data['password']

        user = authenticate(email=email, password=password)

        print(user)

        if user is not None:
            try:
                login(request, user)
                return Response({'response': 'Succeeded'})
            except Exception as e:
                print(f'Something went wrong authenticating {email}', e)
        else:
            return Response({'response': 'Failed'})
        

# Logout View 
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        logout(request)
        return Response({'success':'User logged out'})

   
@method_decorator(ensure_csrf_cookie, name='dispatch')       
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        csrf_token = get_token(request)

        return Response({'success': 'CSRF Token was set',
                         'token': csrf_token})

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


