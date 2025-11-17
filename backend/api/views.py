from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication 
from .serializers import UserSerializer, VerificationTokenSerializer
from core.models import User, verification_token
from core.utils import send_verification_email


# Create your views here.

class UserView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        if serializer:
            return Response(serializer.data)
        else:
            return Http404

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            send_verification_email(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class VerificationView(APIView):

    def post(self, request):
        try:
            reqtoken = request.data.get('token')
            token_obj = verification_token.objects.get(token=reqtoken)
            user = token_obj.user
            user.email_verified = True
            user.save()
            token_obj.delete()
            return Response(
                {'message': 'Email successfully verified!'},     
                status=status.HTTP_200_OK
                    )          
        except verification_token.DoesNotExist:
            return Response(
                {'error': 'Invalid or expired token.'}, 
                status=status.HTTP_400_BAD_REQUEST
                    )




        

        