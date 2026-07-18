import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Container from '../components/Container'

const API_LINK = import.meta.env.VITE_API_URL || ''

function getToken(){
  return localStorage.getItem('access') || localStorage.getItem('access_token') || ''
}

export default function AddBook(){
  const [form, setForm] = useState({ title:'', authors:'', isbn:'', description:'', price:'', stock:1 })
  const [cover, setCover] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const navigate = useNavigate()

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const onFile = (e) => setCover(e.target.files && e.target.files[0])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const token = getToken()
      if (!token) {
        setError('You must be logged in to sell a book.');
        setLoading(false)
        navigate('/login')
        return
      }

      const data = new FormData()
      data.append('title', form.title)
      data.append('authors', form.authors)
      data.append('isbn', form.isbn)
      data.append('description', form.description)
      data.append('price', form.price)
      data.append('stock', form.stock)
      if (cover) data.append('cover_image', cover)

      const resp = await axios.post(`${API_LINK}/api/books/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      setSuccess('Book created successfully')
      // redirect to detail page
      navigate(`/books/${resp.data.id}`)
    } catch (err) {
      console.error(err)
      setError(err?.response?.data || 'Failed to create book')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <div className="listing-page">
        <p className="eyebrow">Pass it forward</p><h1 className="display">Give a book its next reader.</h1><p className="listing-intro">List a book from your shelf and help another reader find exactly what they were looking for.</p>
        {error && <div className="notice notice-error">{typeof error === 'string' ? error : JSON.stringify(error)}</div>}
        {success && <div className="notice notice-success">{success}</div>}

        <form onSubmit={onSubmit} className="listing-form panel">
          <div className="space-y-4">
            <div>
              <label className="field-label">Title</label><input name="title" value={form.title} onChange={onChange} className="field" required />
            </div>
            <div>
              <label className="field-label">Authors</label><input name="authors" value={form.authors} onChange={onChange} className="field" />
            </div>
            <div>
              <label className="field-label">ISBN</label><input name="isbn" value={form.isbn} onChange={onChange} className="field" required />
            </div>
            <div>
              <label className="field-label">Description</label><textarea name="description" value={form.description} onChange={onChange} className="field" rows={6} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="field-label">Price (USD)</label><input name="price" type="number" step="0.01" value={form.price} onChange={onChange} className="field" required />
            </div>
            <div>
              <label className="field-label">Stock</label><input name="stock" type="number" value={form.stock} onChange={onChange} className="field" required />
            </div>
            <div>
              <label className="field-label">Cover image</label><input type="file" accept="image/*" onChange={onFile} className="upload-input" />
            </div>
            <div className="pt-4"><button type="submit" disabled={loading} className="button button-primary listing-submit">{loading? 'Submitting...' : 'Create listing'}</button>
            </div>
          </div>
        </form>
      </div>
    </Container>
  )
}
