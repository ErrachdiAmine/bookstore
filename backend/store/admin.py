from django.contrib import admin
from .models import Book, Profile


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'isbn', 'price', 'stock', 'status', 'seller', 'created_at')
    search_fields = ('title', 'authors', 'isbn')
    list_filter = ('status', 'seller',)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_seller')
    search_fields = ('user__username', 'user__email')
