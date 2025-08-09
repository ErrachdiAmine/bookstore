from django.urls import path
from .views import UserView, EmailVerificationView


app_name = 'api'

urlpatterns = [
    path('auth/signup/', UserView.as_view(), name='signup'),
    path('auth/email_verification/', EmailVerificationView.as_view(), name='email_verification')
]

