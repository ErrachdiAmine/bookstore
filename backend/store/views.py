from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer
from .permissions import IsOwnerOrAdminOrReadOnly


class BookViewSet(viewsets.ModelViewSet):
    """API endpoint that allows books to be viewed or edited."""
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    # Allow read to all; POST only for authenticated users (they become the seller);
    # updates/deletes only for the seller or admin
    permission_classes = [IsOwnerOrAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'authors', 'description', 'isbn']
    ordering_fields = ['price', 'created_at']

    def get_queryset(self):
        queryset = Book.objects.all()
        # Inactive listings remain available in the seller dashboard, but do
        # not appear in the public catalogue.
        if self.action == 'list':
            return queryset.filter(status='active')
        return queryset

    def perform_create(self, serializer):
        # Associate the creating user as the seller of the book
        serializer.save(seller=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def mine(self, request):
        """Return only the authenticated user's listings."""
        books = self.filter_queryset(self.get_queryset().filter(seller=request.user))
        page = self.paginate_queryset(books)
        if page is not None:
            return self.get_paginated_response(self.get_serializer(page, many=True).data)
        return Response(self.get_serializer(books, many=True).data)
