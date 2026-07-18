from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404

from .models import CartItem, Order
from .models import Book
from .serializers_cart import CartItemSerializer, OrderSerializer, OrderCreateSerializer


class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user).select_related('book')

    def perform_create(self, serializer):
        book = serializer.validated_data['book']
        quantity = serializer.validated_data.get('quantity', 1)
        item, created = CartItem.objects.get_or_create(user=self.request.user, book=book, defaults={'quantity': quantity})
        if not created:
            item.quantity = item.quantity + quantity
            item.save()
        return item


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')

    @action(detail=False, methods=['post'])
    def checkout(self, request):
        # create order from user's cart
        serializer = OrderCreateSerializer(data={}, context={'request': request})
        try:
            order = serializer.create({})
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(OrderSerializer(order, context={'request': request}).data, status=status.HTTP_201_CREATED)
