import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ArrowLeft, BookOpen, ShoppingBag } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import Container from '../components/Container'
const API_LINK = import.meta.env.VITE_API_URL || ''
export default function BookDetail(){
  const { id } = useParams(); const navigate = useNavigate(); const [book, setBook] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(null)
  useEffect(() => { axios.get(`${API_LINK}/api/books/${id}/`).then(resp => setBook(resp.data)).catch(() => setError('Failed to load this book')).finally(() => setLoading(false)) }, [id])
  const addToCart = () => { const cart = JSON.parse(localStorage.getItem('cart') || '[]'); const existing = cart.find(item => item.id === book.id); if (existing) existing.quantity = (existing.quantity || 1) + 1; else cart.push({ id: book.id, title: book.title, price: book.price, quantity: 1 }); localStorage.setItem('cart', JSON.stringify(cart)); navigate('/cart') }
  if (loading) return <Container><p className="state-text detail-state">Opening the book…</p></Container>; if (error || !book) return <Container><p className="notice notice-error detail-state">{error || 'Book not found'}</p></Container>
  const imageUrl = book.cover_image ? (book.cover_image.startsWith('http') ? book.cover_image : `${API_LINK}${book.cover_image}`) : null
  const canBuy = book.status === 'active' && book.stock > 0
  const availability = book.status === 'sold' ? 'Sold' : book.status === 'paused' ? 'Currently paused' : book.stock > 0 ? `${book.stock} in stock` : 'Currently unavailable'
  return <Container><section className="detail-page"><button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={16}/> Back to browse</button><div className="detail-layout"><div className="detail-cover">{imageUrl ? <img src={imageUrl} alt={book.title}/> : <div className="cover-fallback"><BookOpen size={50}/><span>READIT</span></div>}</div><article className="detail-copy"><p className="eyebrow">Available now</p><h1 className="display">{book.title}</h1><p className="detail-author">by {book.authors || 'Independent author'}</p><p className="detail-description">{book.description || 'A story waiting for its next reader.'}</p><div className="detail-purchase"><div><span>Price</span><strong>${book.price}</strong></div><div><span>Availability</span><strong>{availability}</strong></div></div><div className="detail-actions"><button disabled={!canBuy} onClick={addToCart} className="button button-primary"><ShoppingBag size={17}/>{canBuy ? 'Add to bag' : 'Not available'}</button><button onClick={() => navigate('/books')} className="button button-secondary">Keep browsing</button></div></article></div></section></Container>
}
