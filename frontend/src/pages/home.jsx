import React, { useState, useEffect } from 'react'
import { ArrowRight, Search, ShoppingBag, Sparkles } from 'lucide-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Container from '../components/Container'
import BookCard from '../components/BookCard'

const API_LINK = import.meta.env.VITE_API_URL || ''

function Home () {
  const [books, setBooks] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [notif, setNotif] = useState(null)
  const navigate = useNavigate()
  useEffect(() => { const fetchBooks = async () => { setLoading(true); try { const resp = await axios.get(`${API_LINK}/api/books/`); const data = Array.isArray(resp.data) ? resp.data : resp.data.results || []; setBooks(data) } catch (err) { console.error('Failed to fetch books', err) } finally { setLoading(false) } }; fetchBooks() }, [])
  const filtered = books.filter(book => book.title.toLowerCase().includes(query.toLowerCase()) || (book.authors || '').toLowerCase().includes(query.toLowerCase()))
  const addToCart = (book) => { try { const cart = JSON.parse(localStorage.getItem('cart') || '[]'); const existing = cart.find(item => item.id === book.id); if (existing) existing.quantity = (existing.quantity || 1) + 1; else cart.push({ id: book.id, title: book.title, price: book.price, quantity: 1 }); localStorage.setItem('cart', JSON.stringify(cart)); setNotif(`${book.title} added to your bag`); setTimeout(() => setNotif(null), 2500) } catch (err) { console.error('Error adding to cart', err) } }
  return <>
    <section className="hero"><Container><div className="hero-grid"><div className="hero-copy"><p className="eyebrow">For curious minds</p><h1 className="display">Find a story<br/><em>that stays with you.</em></h1><p className="hero-text">A considered collection of books for every kind of reader. Discover a new favorite, or give a loved story its next chapter.</p><div className="hero-actions"><button onClick={() => navigate('/books')} className="button button-primary">Explore the shelves <ArrowRight size={17}/></button><button onClick={() => navigate('/books/add')} className="button button-secondary">Sell a book</button></div></div><div className="hero-art"><div className="hero-glow"></div><div className="hero-book hero-book-one">On<br/>reading</div><div className="hero-book hero-book-two">THE<br/>WILD<br/>IRIS</div><div className="hero-book hero-book-three">MORNING<br/>LIGHT</div><span className="hero-note"><Sparkles size={16}/> A little magic on every shelf</span></div></div></Container></section>
    <Container><section className="catalog-section"><div className="section-heading"><div><p className="eyebrow">New on the shelf</p><h2 className="display">Books to get lost in</h2></div><button className="text-link" onClick={() => navigate('/books')}>View all books <ArrowRight size={16}/></button></div><div className="home-search"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by title or author" aria-label="Search books"/></div>{notif && <div className="notice notice-success">{notif}</div>}{loading && <p className="state-text">Arranging the shelves…</p>}<div className="book-grid">{filtered.slice(0, 8).map(book => <div key={book.id} className="book-grid-item"><button className="book-link" onClick={() => navigate(`/books/${book.id}`)}><BookCard book={book}/></button><button className="quick-add" onClick={() => addToCart(book)}><ShoppingBag size={16}/> Add to bag</button></div>)}</div>{!loading && !filtered.length && <div className="empty-state">No stories matched that search.</div>}</section></Container>
  </>
}
export default Home
