# users/urls.py
from django.urls import path
from .views import UserListView, LoginView, LogoutView, RegisterView, VerifyTokenView, PasswordView, RegisterWithoutPasswordView, CustomTokenObtainPairView, AuthenticationStatusView
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'), 
    path('authenticated/', VerifyTokenView.as_view(), name='authenticated'),

    # Psssword Authentication and Invitation  
    path('password/set', PasswordView.as_view(), name='set-password'),
    path('password/validate-token', PasswordView.as_view(), name='validate-token'),
    path('invite-user/', RegisterWithoutPasswordView.as_view(), name='validate-token'), 

    # JWT tokens
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/authentication/', AuthenticationStatusView.as_view(), name='token_refresh'),
]
