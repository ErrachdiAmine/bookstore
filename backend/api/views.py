from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication 
from .serializers import UserSerializer, VerificationSerializer
from core.models import User, Verification


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
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class VerificationView(APIView):

    def get(self, request, *args, **kwargs):
        queryset = Verification.objects.all()
        serializer = VerificationSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        serializer = VerificationSerializer(data={}, context={'request': request})
        serializer.is_valid(raise_exception=True)
        verification_instance = serializer.save()
        
        response_serializer = VerificationSerializer(verification_instance)

        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
