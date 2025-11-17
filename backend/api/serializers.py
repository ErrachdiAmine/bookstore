import secrets
from rest_framework import serializers
from core.models import User, verification_token
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError
from django.db import transaction
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

    
    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
            


class VerificationTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = verification_token
        fields = ['user', 'token']
        extra_keywargs = {
            'token': {'required': True},
            'user': {'required': True}
        }