import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ArrowLeft, Save } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Container from '../components/Container'
import { getCurrentUser } from '../auth'

const API_LINK = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const emptyBook = { title: '', authors: '', isbn: '', description: '', price: '', stock: 0, status: 'active' }

export default function EditBook(){
  const user = getCurrentUser()
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyBook)
  const [cover, setCover] = useState(null)
  const [currentCover, setCurrentCover] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const token = localStorage.getItem('access')
  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const response = await axios.get(`${API_LINK}/api/books/${id}/`)
        const book = response.data
        if (book.seller !== user.id) { setError('Only the seller of this book can edit it.'); return }
        setForm({ title: book.title || '', authors: book.authors || '', isbn: book.isbn || '', description: book.description || '', price: book.price || '', stock: book.stock ?? 0, status: book.status || 'active' })
        setCurrentCover(book.cover_image ? (book.cover_image.startsWith('http') ? book.cover_image : `${API_LINK}${book.cover_image}`) : '')
      } catch (err) { setError(err.response?.data?.detail || 'Unable to load this listing.') } finally { setLoading(false) }
    }
    load()
  }, [id, user])
  const change = event => setForm(previous => ({ ...previous, [event.target.name]: event.target.value }))
  const submit = async event => {
    event.preventDefault(); setSaving(true); setError('')
    const data = new FormData()
    Object.entries(form).forEach(([key, value]) => data.append(key, value))
    if (cover) data.append('cover_image', cover)
    try { const response = await axios.patch(`${API_LINK}/api/books/${id}/`, data, { headers: { Authorization: `Bearer ${token}` } }); navigate(`/books/${response.data.id}`) } catch (err) { setError(typeof err.response?.data === 'string' ? err.response.data : JSON.stringify(err.response?.data || 'Unable to update this listing.')) } finally { setSaving(false) }
  }
  if (!user) return <Navigate to="/login" replace />
  if (loading) return <Container><p className="state-text detail-state">Opening your listing…</p></Container>
  return <Container><section className="listing-page"><button className="back-link" onClick={() => navigate('/account/listings')}><ArrowLeft size={16}/>Back to my listings</button><p className="eyebrow edit-eyebrow">Seller dashboard</p><h1 className="display">Edit your listing</h1><p className="listing-intro">Update your book’s details, availability, or cover. Your changes appear immediately once saved.</p>{error && <div className="notice notice-error">{error}</div>}{!error && <form onSubmit={submit} className="listing-form panel"><div className="space-y-4"><div><label className="field-label">Title</label><input name="title" value={form.title} onChange={change} className="field" required/></div><div><label className="field-label">Authors</label><input name="authors" value={form.authors} onChange={change} className="field"/></div><div><label className="field-label">ISBN</label><input name="isbn" value={form.isbn} onChange={change} className="field" required/></div><div><label className="field-label">Description</label><textarea name="description" value={form.description} onChange={change} className="field" rows={6}/></div></div><div className="space-y-4"><div><label className="field-label">Listing status</label><select name="status" value={form.status} onChange={change} className="field"><option value="active">Active — visible to buyers</option><option value="paused">Paused — hide for now</option><option value="sold">Sold — no longer available</option></select></div><div><label className="field-label">Price (USD)</label><input name="price" type="number" step="0.01" min="0" value={form.price} onChange={change} className="field" required/></div><div><label className="field-label">Stock</label><input name="stock" type="number" min="0" value={form.stock} onChange={change} className="field" required/></div><div><label className="field-label">Replace cover image</label>{currentCover && <img className="listing-cover-preview" src={currentCover} alt="Current book cover"/>}<input type="file" accept="image/*" onChange={event => setCover(event.target.files?.[0] || null)} className="upload-input"/></div><div className="pt-4"><button type="submit" disabled={saving} className="button button-primary listing-submit"><Save size={16}/>{saving ? 'Saving changes…' : 'Save changes'}</button></div></div></form>}</section></Container>
}
