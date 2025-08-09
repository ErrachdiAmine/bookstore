from django.shortcuts import render
from .serializers import UserSerializer, EmailVerificationSerializer
from core.models import User, EmailVerification
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404, HttpResponse
from rest_framework.permissions import AllowAny
from rest_framework import status, permissions

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
                

class EmailVerificationView(APIView):
    def get(self, request):
        ev = EmailVerification.objects.all()
        serializer = EmailVerificationSerializer(ev)
        if serializer:
            return Response(serializer.data)
        else:
            return Http404