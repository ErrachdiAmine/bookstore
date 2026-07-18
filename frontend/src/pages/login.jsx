import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../auth'
import Container from '../components/Container'



export default function Login() 
    { const [user, setUser] = useState({ identifier: '', password: '' }); 
      const [error, setError] = useState('');
      const navigate = useNavigate(); 
      const submit = async e => { e.preventDefault(); setError(''); 
      
      try 
        { const response = await loginUser(user.identifier, user.password); 
          localStorage.setItem('access_token', response.access); 
          localStorage.setItem('refresh_token', response.refresh); 
          navigate('/') 
        } 
      catch (err) 
        { setError(err.detail || 'Login failed. Please check your credentials.') } }; 
        return <Container><section className="auth-page"><form onSubmit={submit} className="auth-card panel"><p className="eyebrow">Welcome back</p><h1 className="display">Sign in to your shelf.</h1>{error && <div className="notice notice-error">{error}</div>}<label className="field-label">Username or email<input className="field" type="text" name="identifier" value={user.identifier} onChange={e => setUser({ ...user, identifier: e.target.value })} autoComplete="username" required /></label><label className="field-label">Password<input className="field" type="password" name="password" value={user.password} onChange={e => setUser({ ...user, password: e.target.value })} autoComplete="current-password" required /></label><button className="button button-primary" type="submit">Sign in</button><p>New to READIT? <Link to="/register">Create an account</Link></p></form></section></Container> }
