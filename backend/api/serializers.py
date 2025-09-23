import secrets
from rest_framework import serializers
from core.models import User
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError
from django.db import transaction
from core.models import Verification
from django.core.mail import send_mail
import random
from rest_framework.exceptions import ValidationError


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True, min_length=8)
    confirmPassword = serializers.CharField(write_only = True, min_length=8)
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'address', 'password', 'confirmPassword']
        extra_kwargs = {
            'confirmPassword': {'write_only': True},
            'email': {'required': True},
            'username': {'required': True},
        }

    def validate(self, attrs):
        if attrs.get('password') != attrs.pop('confirmPassword', None):
            raise serializers.ValidationError({'confirmPassword': 'Passwords do not match!'})
        else:
            return attrs
        
    def create(self, validated_data):
        try:
            with transaction.atomic():                
                password = validated_data.pop('password')
                user = User(**validated_data)
                user.set_password(password)
                user.save()
                return user
        except IntegrityError as err:
            print(err)
            


class VerificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Verification
        fields = ['username', 'email', 'verified', 'passphrase']
        read_only_fields = ['username', 'email', 'verified']

    

    def create(self, validated_data):

        request = self.context.get('request')

        user = request.user

        if not request or not request.user.is_authenticated:
            raise ValidationError('User is not authenticated!')
        
        passphrase = secrets.randbelow(1_000_000)
        passphrase_str = f'{passphrase:06d}'

        validated_data['username'] = user.username
        validated_data['email'] = user.email
        validated_data['passphrase'] = passphrase_str
        


        verification_instance = Verification.objects.create(**validated_data)
        
        self.send_email(user.username, user.email, passphrase_str)

        return verification_instance



    def send_email(self, username, email, passphrase):
        
        try:
            recipient_list = [email]
            send_mail(
                'Email Verification',
                f'Hello {username}, \n This is your verification code: {passphrase}.',
                None,
                recipient_list,
                fail_silently=False,
            )
            raise 'email sent'
            

        except Exception:
            raise ValidationError('could not send email!')
        
    

    

    