# users/urls.py
from django.urls import path
from .views import UserListView, LoginView, LogoutView, RegisterView, GetCSRFToken, CheckAuthenticatedView

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'), 
    path('csrf-cookie/', GetCSRFToken.as_view(), name='csrf-token'), 
    path('authenticated/', CheckAuthenticatedView.as_view(), name='authenticated'),
]