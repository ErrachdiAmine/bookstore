import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function CatalogPage() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    // TODO: replace with actual API call
    const mockBooks = [
      { id: 1, title: 'Modern React', author: 'Jane Doe', cover: '/covers/react.jpg' },
      { id: 2, title: 'Tailwind in Action', author: 'John Smith', cover: '/covers/tailwind.jpg' },
      { id: 3, title: 'JavaScript Patterns', author: 'Alex Johnson', cover: '/covers/js.jpg' },
      { id: 4, title: 'Design Systems', author: 'Emily Clark', cover: '/covers/design.jpg' },
    ];
    setBooks(mockBooks);
    setFiltered(mockBooks);
  }, []);

  useEffect(() => {
    const results = books.filter(book =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(results);
  }, [query, books]);

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <header className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4 sm:mb-0">Book Catalog</h1>
        <div className="flex w-full sm:w-auto">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by title or author"
              className="w-full border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => {}}
              className="absolute right-0 top-0 h-full px-4 bg-blue-600 text-white rounded-r-md transition-colors duration-200 hover:bg-blue-700"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filtered.map(book => (
          <div
            key={book.id}
            className="bg-white border border-gray-200 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105"
          >
            <img
              src={book.cover}
              alt={book.title}
              className="h-40 sm:h-48 w-full object-cover rounded-t-lg"
            />
            <div className="p-4 flex flex-col items-center text-center">
              <h2 className="text-lg sm:text-xl font-medium text-blue-600 mb-1">{book.title}</h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">by {book.author}</p>
              <button
                className="w-full border border-blue-600 text-blue-600 rounded-md px-4 py-2 transition-colors duration-200 hover:bg-blue-600 hover:text-white"
                onClick={() => {} }
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
