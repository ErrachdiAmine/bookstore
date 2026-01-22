from django.db import models
from django.contrib.auth.models import AbstractUser
import secrets

# Create your models here.

class User(AbstractUser):
    first_name = models.CharField(max_length=25)
    last_name = models.CharField(max_length=25)
    username = models.CharField(max_length=25, unique=True)
    email = models.EmailField(unique=True)
    address = models.CharField(max_length=50)
    is_active = models.BooleanField(default=False)  # Changed to False - users must verify email first
    is_staff = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']


class verification_token(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = secrets.token_hex(16)


  