from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Book, Profile

User = get_user_model()

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'authors', 'isbn', 'description', 'price', 'stock', 'status', 'seller', 'cover_image', 'created_at', 'updated_at']
        read_only_fields = ['id', 'seller', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirmPassword = serializers.CharField(write_only=True, required=False)
    address = serializers.CharField(write_only=True, required=False)
    is_seller = serializers.BooleanField(write_only=True, required=False, default=False)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'confirmPassword', 'first_name', 'last_name', 'is_seller', 'address')

    def validate(self, attrs):
        # If frontend provided a confirmation password, ensure they match
        pwd = attrs.get('password')
        confirm = attrs.get('confirmPassword')
        if confirm is not None and pwd != confirm:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return attrs

    def create(self, validated_data):
        # ignore fields not part of the User model
        validated_data.pop('confirmPassword', None)
        validated_data.pop('address', None)
        is_seller = validated_data.pop('is_seller', False)
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        # set profile flag
        try:
            profile = user.profile
        except Profile.DoesNotExist:
            profile = Profile.objects.create(user=user)
        profile.is_seller = is_seller
        profile.save()
        return user


# Custom token serializer to allow login via email or username and include user data in response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        """Make either username or email a valid login identifier."""
        self.fields[self.username_field].required = False
        self.fields['email'] = serializers.EmailField(write_only=True, required=False)

    def validate(self, attrs):
        # Simple JWT authenticates with the model's USERNAME_FIELD. Resolve an
        # email to that value before delegating to its normal validation.
        request_data = attrs.copy()
        email = request_data.pop('email', None)
        username = request_data.get(self.username_field)
        if email and not username:
            try:
                user_obj = User.objects.get(email=email)
                request_data[self.username_field] = getattr(user_obj, self.username_field)
            except User.DoesNotExist:
                raise serializers.ValidationError({'email': 'No user with this email.'})
        if not request_data.get(self.username_field):
            raise serializers.ValidationError({self.username_field: 'Enter a username or email.'})
        data = super().validate(request_data)
        data['user'] = UserSerializer(self.user).data
        return data
