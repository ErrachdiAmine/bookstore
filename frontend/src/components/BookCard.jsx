import React from 'react'
import { ArrowUpRight, BookOpen } from 'lucide-react'

const API_LINK = import.meta.env.VITE_API_URL || ''

export default function BookCard({ book }) {
  const imageUrl = book.cover_image ? (book.cover_image.startsWith('http') ? book.cover_image : `${API_LINK}${book.cover_image}`) : null
  return <article className="book-card">
    <div className="book-cover">{imageUrl ? <img src={imageUrl} alt={book.title} /> : <div className="cover-fallback"><BookOpen size={35}/><span>READIT</span></div>}</div>
    <div className="book-card-body"><p className="book-author">{book.authors || 'Independent author'}</p><h3>{book.title}</h3><div className="book-card-footer"><span>${book.price}</span><span className="card-arrow"><ArrowUpRight size={17}/></span></div></div>
  </article>
}
