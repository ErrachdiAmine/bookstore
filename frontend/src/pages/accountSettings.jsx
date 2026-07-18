import React from 'react'
import { BookOpen, LogOut, Mail, UserRound } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Container from '../components/Container'
import { getCurrentUser, logoutUser } from '../auth'

export default function AccountSettings(){
  const user = getCurrentUser()
  const navigate = useNavigate()
  if (!user) return <Navigate to="/login" replace />
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || 'Reader'
  const logout = () => { logoutUser(); navigate('/') }
  return <Container><section className="account-page"><p className="eyebrow">Your account</p><h1 className="display">Reader settings</h1><div className="account-layout"><aside className="account-card panel"><span className="account-avatar">{name.charAt(0).toUpperCase()}</span><h2>{name}</h2><p>{user.email || 'No email available'}</p><Link to="/account/listings" className="account-link"><BookOpen size={17}/>My listings</Link><button className="account-link account-logout" onClick={logout}><LogOut size={17}/>Log out</button></aside><div className="account-content"><article className="panel account-section"><div className="account-section-title"><UserRound size={19}/><div><h2>Profile details</h2><p>Your current account information.</p></div></div><dl><div><dt>Username</dt><dd>{user.username || '—'}</dd></div><div><dt>Name</dt><dd>{name}</dd></div><div><dt>Email</dt><dd>{user.email || '—'}</dd></div></dl></article><article className="panel account-section"><div className="account-section-title"><Mail size={19}/><div><h2>Account preferences</h2><p>More reader preferences will appear here as they become available.</p></div></div><p className="account-note">Your session is active on this device. Use the menu above to sign out securely.</p></article></div></div></section></Container>
}
