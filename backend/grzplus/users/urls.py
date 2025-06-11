# users/urls.py
from django.urls import path
from .views import (
                    UserListView, 
                    LogoutView, 
                    VerifyTokenView, 
                    PasswordView, 
                    RegisterPatientWithoutPasswordView,
                    RegisterCaregiverWithoutPasswordView,
                    CustomTokenObtainPairView, 
                    AuthenticationStatusView
                    )
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('authenticated/', VerifyTokenView.as_view(), name='authenticated'),

    # Psssword Authentication and Invitation  
    path('password/set', PasswordView.as_view(), name='set-password'),
    path('password/validate-token', PasswordView.as_view(), name='validate-token'),
    path('invite-caregiver/', RegisterCaregiverWithoutPasswordView.as_view(), name='invite-patient'), 
    path('invite-patient/', RegisterPatientWithoutPasswordView.as_view(), name='invite-caregiver'), 

    # JWT tokens
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/authentication/', AuthenticationStatusView.as_view(), name='token_refresh'),
]
