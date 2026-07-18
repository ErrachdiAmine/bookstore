import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import BookCard from '../components/BookCard'
import Container from '../components/Container'
const API_LINK = import.meta.env.VITE_API_URL || ''
export default function Books() {
  const [books, setBooks] = useState([]); const [q, setQ] = useState(''); const [loading, setLoading] = useState(false); const [error, setError] = useState(null)
  const fetchBooks = async (search = '') => { setLoading(true); setError(null); try { const resp = await axios.get(`${API_LINK}/api/books/`, { params: search ? { search } : {} }); setBooks(Array.isArray(resp.data) ? resp.data : resp.data.results || []) } catch (err) { setError(err?.response?.data || 'We could not load the books just now.') } finally { setLoading(false) } }
  useEffect(() => { fetchBooks() }, [])
  return <Container><section className="browse-page"><p className="eyebrow">The full collection</p><h1 className="display">Browse the shelves</h1><div className="browse-bar"><form onSubmit={e => { e.preventDefault(); fetchBooks(q) }}><Search size={19}/><input value={q} onChange={e => setQ(e.target.value)} placeholder="Title, author, or ISBN"/><button className="button button-primary">Search</button></form><span>{books.length} {books.length === 1 ? 'book' : 'books'} found</span></div>{loading && <p className="state-text">Looking through the stacks…</p>}{error && <div className="notice notice-error">{String(error)}</div>}<div className="book-grid">{books.map(book => <Link key={book.id} to={`/books/${book.id}`} className="book-link"><BookCard book={book}/></Link>)}</div>{!loading && !books.length && <div className="empty-state">No books found. Try a different search.</div>}</section></Container>
}
