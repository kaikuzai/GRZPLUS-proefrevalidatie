# users/urls.py
from django.urls import path
from .views import UserListView, LoginView, LogoutView, GetCSRFToken, CheckAuthenticatedView

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('csrf-cookie/', GetCSRFToken.as_view(), name='csrf-cookie'), 
    path('authenticated/', CheckAuthenticatedView.as_view(), name='authenticate'), 
]