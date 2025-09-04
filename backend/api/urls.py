from django.urls import path
from .views import UserView, VerificationView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)


app_name = 'api'

urlpatterns = [
    path('auth/token/', TokenObtainPairView.as_view(), name='token_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/signup/', UserView.as_view(), name='signup'),
    path('auth/verification/', VerificationView.as_view(), name='verification') 
]

