from django.db import models
from django.utils import timezone
import uuid
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# Create your models here.



class User(AbstractUser):
    first_name = models.CharField(max_length=25)
    last_name = models.CharField(max_length=25)
    username = models.CharField(unique=True ,max_length=25)
    email = models.EmailField()
    number = models.CharField(max_length=9)
    address = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)



class EmailVerification(models.Model):
    user       = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    code       = models.CharField(max_length=6, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    verified   = models.BooleanField(default=False)

    def generate_verification_code(self):
        self.verification_code = f"{uuid.uuid4().int % 1000000:06d}"
        self.code_generated_at = timezone.now()
        self.email_verified = False
        self.save()
        return self.verification_code

    def code_expired(self, minutes=15):
        return timezone.now() > (self.code_generated_at or timezone.now()) + timezone.timedelta(minutes=minutes)