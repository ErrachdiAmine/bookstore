from django.shortcuts import render
from .serializers import UserSerializer
from core.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404, HttpResponse

# Create your views here.




class UserView(APIView):

    def get(self, requ):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        if serializer:
            return Response(serializer.data)
        else:
            return Http404
        