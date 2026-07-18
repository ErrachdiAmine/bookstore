from rest_framework import serializers
from .models import CartItem, Order, OrderItem
from .models import Book

class CartItemSerializer(serializers.ModelSerializer):
    book_detail = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'book', 'book_detail', 'quantity', 'added_at']
        read_only_fields = ['id', 'book_detail', 'added_at']

    def get_book_detail(self, obj):
        return {
            'title': obj.book.title,
            'authors': obj.book.authors,
            'price': str(obj.book.price),
            'cover_image': obj.book.cover_image.url if obj.book.cover_image else None,
        }


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'book', 'title', 'unit_price', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'total', 'status', 'created_at', 'updated_at', 'items']
        read_only_fields = ['id', 'user', 'total', 'status', 'created_at', 'updated_at', 'items']


class OrderCreateSerializer(serializers.Serializer):
    # create an order from the user's cart
    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        # create order from cart items
        cart_items = user.cart_items.select_related('book').all()
        if not cart_items:
            raise serializers.ValidationError('Cart is empty')
        order = Order.objects.create(user=user, total=0)
        total = 0
        items = []
        for ci in cart_items:
            book = ci.book
            unit = book.price
            oi = OrderItem.objects.create(order=order, book=book, title=book.title, unit_price=unit, quantity=ci.quantity)
            total += float(unit) * int(ci.quantity)
            items.append(oi)
        order.total = total
        order.save()
        # clear cart
        cart_items.delete()
        return order

    def to_representation(self, instance):
        return OrderSerializer(instance, context=self.context).data
