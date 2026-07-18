import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { BookOpen, BookMarked, LogOut, Settings, ShoppingBag, UserRound } from 'lucide-react'
import { getCurrentUser, logoutUser } from '../auth'

export default function Header(){
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const user = getCurrentUser()
  const cart = (() => { try { return JSON.parse(localStorage.getItem('cart') || '[]') } catch { return [] } })()
  const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const navClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`
  const displayName = user?.first_name || user?.username || 'Account'
  const initial = displayName.charAt(0).toUpperCase()
  const logout = () => { logoutUser(); setMenuOpen(false); navigate('/') }
  useEffect(() => {
    const closeMenu = event => { if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', closeMenu)
    return () => document.removeEventListener('mousedown', closeMenu)
  }, [])
  return <header className="site-header"><div className="site-container header-inner">
    <button onClick={() => navigate('/')} className="brand" aria-label="READIT home"><span className="brand-mark"><BookOpen size={18}/></span>READIT</button>
    <nav className="primary-nav"><NavLink to="/" end className={navClass}>Home</NavLink><NavLink to="/books" className={navClass}>Browse</NavLink><NavLink to="/books/add" className={navClass}>Sell a book</NavLink></nav>
    <div className="header-actions"><NavLink to="/cart" className="cart-link" aria-label="Cart"><ShoppingBag size={20}/>{count > 0 && <span className="cart-count">{count}</span>}</NavLink>{user ? <div className="account-menu" ref={menuRef}><button className="profile-trigger" onClick={() => setMenuOpen(open => !open)} aria-expanded={menuOpen} aria-haspopup="menu" aria-label="Open account menu"><span>{initial}</span></button>{menuOpen && <div className="profile-dropdown" role="menu"><div className="profile-summary"><span className="profile-summary-icon"><UserRound size={18}/></span><div><strong>{displayName}</strong><small>{user.email || 'Your reader account'}</small></div></div><NavLink to="/account/settings" onClick={() => setMenuOpen(false)} className="profile-option" role="menuitem"><Settings size={16}/>Account settings</NavLink><NavLink to="/account/listings" onClick={() => setMenuOpen(false)} className="profile-option" role="menuitem"><BookMarked size={16}/>My listings</NavLink><button onClick={logout} className="profile-option profile-logout" role="menuitem"><LogOut size={16}/>Log out</button></div>}</div> : <><NavLink to="/login" className={navClass}>Sign in</NavLink><NavLink to="/register" className="button button-primary">Join us</NavLink></>}</div>
  </div></header>
}
