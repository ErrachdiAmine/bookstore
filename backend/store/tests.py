from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

from .models import Book

User = get_user_model()

class BookAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='tester', password='pass')
        Book.objects.create(title='Test Book', authors='Author A', isbn='ISBN12345', description='Desc', price='9.99', stock=5)

    def test_list_books(self):
        url = reverse('book-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_create_book_requires_auth(self):
        url = reverse('book-list')
        data = {
            'title': 'New Book',
            'authors': 'Author B',
            'isbn': 'ISBN999',
            'description': 'New',
            'price': '12.50',
            'stock': 3
        }
        # unauthenticated should be forbidden for create
        response = self.client.post(url, data, format='json')
        self.assertIn(response.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))
        # authenticate and retry
        self.client.login(username='tester', password='pass')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_sets_seller(self):
        url = reverse('book-list')
        data = {
            'title': 'Seller Book',
            'authors': 'Seller',
            'isbn': 'ISBNSELLER1',
            'description': 'By seller',
            'price': '7.00',
            'stock': 2
        }
        self.client.login(username='tester', password='pass')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('seller', response.data)
        self.assertEqual(response.data['seller'], self.user.pk)

    def test_only_owner_or_admin_can_update(self):
        # create a book owned by tester
        book = Book.objects.create(title='Owned', authors='Owner', isbn='OWN123', description='', price='5.00', stock=1, seller=self.user)
        detail_url = reverse('book-detail', args=[book.pk])
        # create another user
        other = User.objects.create_user(username='other', password='pass')
        self.client.login(username='other', password='pass')
        resp = self.client.patch(detail_url, {'price': '6.00'}, format='json')
        self.assertIn(resp.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))
        # owner can update
        self.client.login(username='tester', password='pass')
        resp2 = self.client.patch(detail_url, {'price': '6.50'}, format='json')
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)

    def test_owner_can_update_listing_status(self):
        book = Book.objects.create(title='Status', authors='Owner', isbn='STATUS123', price='5.00', stock=1, seller=self.user)
        self.client.login(username='tester', password='pass')
        response = self.client.patch(reverse('book-detail', args=[book.pk]), {'status': 'paused', 'title': 'Updated Status'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'paused')
        self.assertEqual(response.data['title'], 'Updated Status')

    def test_mine_lists_only_current_sellers_books(self):
        Book.objects.create(title='Mine', authors='Owner', isbn='MINE123', price='5.00', stock=1, seller=self.user)
        other = User.objects.create_user(username='other-seller', password='pass')
        Book.objects.create(title='Theirs', authors='Other', isbn='THEIRS123', price='5.00', stock=1, seller=other)
        self.client.login(username='tester', password='pass')
        response = self.client.get(reverse('book-mine'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([book['title'] for book in response.data], ['Mine'])
