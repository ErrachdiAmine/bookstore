from rest_framework import serializers
from core.models import EmailVerification
from core.models import User


class UserSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    username = serializers.CharField()
    email = serializers.EmailField()
    address = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        # Use your User model's create_user method to handle password hashing
        return User.objects.create_user(**validated_data)
# myapp/serializers.py


class EmailVerificationSerializer(serializers.ModelSerializer):
    # We’ll only allow reading the user (it will be set from the request)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = EmailVerification
        fields = ['user', 'code', 'created_at', 'verified']
        read_only_fields = ['created_at', 'verified', 'code']

    def create(self, validated_data):
        """
        When you POST to this serializer, we:
        1. Grab the current user from the view context.
        2. Create an EmailVerification instance for them.
        3. Call generate_verification_code() to fill & save the code.
        """
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if user is None or user.is_anonymous:
            raise serializers.ValidationError("Authentication required to generate verification code.")
        
        # create the record (code will be blank initially)
        verification = EmailVerification.objects.create(user=user)
        # generate & save the 6‑digit code
        verification.generate_verification_code()
        return verification
