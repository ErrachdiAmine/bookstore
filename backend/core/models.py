from django.db import models
from django.utils import timezone
import uuid
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags


# Create your models here.

class User(AbstractUser):
    first_name = models.CharField(max_length=25)
    last_name = models.CharField(max_length=25)
    username = models.CharField(max_length=25, unique=True)
    email = models.EmailField(unique=True)
    address = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)  # Changed to False - users must verify email first
    is_staff = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']



class Verification(models.Model):
    username = models.CharField(max_length=25)
    email = models.EmailField(unique=True)
    passphrase = models.CharField(max_length=6, blank=True)
    verified = models.BooleanField(default=False)


    def __str__(self):
        if self.verified is True:
            return f"{self.username}'s email is verified!"
        else:
            return f"{self.username}'s email is not verified!"
