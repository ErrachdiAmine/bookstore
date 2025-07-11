from core.models import User
from rest_framework import serializers


class UserSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    username = serializers.CharField()
    email = serializers.EmailField()
    adress = serializers.CharField()
    is_staff = serializers.BooleanField()
    
    