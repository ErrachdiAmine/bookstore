import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CirclePlus, Pencil, Plus } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import Container from '../components/Container'
import { getCurrentUser } from '../auth'

const API_LINK = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export default function MyListings(){
  const user = getCurrentUser()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const response = await axios.get(`${API_LINK}/api/books/mine/`, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } })
        setBooks(Array.isArray(response.data) ? response.data : response.data.results || [])
      } catch (err) { setError(err.response?.data?.detail || 'Unable to load your listings.') } finally { setLoading(false) }
    }
    load()
  }, [user])
  if (!user) return <Navigate to="/login" replace />
  return <Container><section className="listings-page"><div className="listings-heading"><div><p className="eyebrow">Seller dashboard</p><h1 className="display">My listings</h1><p>Manage every book you’ve shared with READIT.</p></div><Link to="/books/add" className="button button-primary"><Plus size={17}/>List a book</Link></div>{loading && <p className="state-text">Loading your listings…</p>}{error && <div className="notice notice-error">{error}</div>}{!loading && !books.length && <div className="my-listings-empty panel"><CirclePlus size={28}/><h2 className="display">Your shelf is empty.</h2><p>List a book to start sharing it with new readers.</p><Link to="/books/add" className="button button-primary">Create listing</Link></div>}<div className="listing-cards">{books.map(book => <article className="listing-card panel" key={book.id}><div><span className={`status-pill status-${book.status || 'active'}`}>{book.status || 'active'}</span><h2>{book.title}</h2><p>{book.authors || 'Independent author'}</p></div><div className="listing-meta"><span>${book.price}</span><span>{book.stock} in stock</span></div><Link to={`/books/${book.id}/edit`} className="button button-secondary"><Pencil size={16}/>Edit listing</Link></article>)}</div></section></Container>
}
