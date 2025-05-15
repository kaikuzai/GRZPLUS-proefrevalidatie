# users/urls.py
from django.urls import path
from .views import UserListView, LoginView, LogoutView, RegisterView, GetCSRFToken, CheckAuthenticatedView, PasswordView, RegisterWithoutPasswordView

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'), 
    path('csrf-cookie/', GetCSRFToken.as_view(), name='csrf-token'), 
    path('authenticated/', CheckAuthenticatedView.as_view(), name='authenticated'),
    path('password/set/', PasswordView.as_view(), name='set-password'),
    path('password/validate-token/', PasswordView.as_view(), name='validate-token'),
    path('invite-user/', RegisterWithoutPasswordView.as_view(), name='validate-token'), 
]