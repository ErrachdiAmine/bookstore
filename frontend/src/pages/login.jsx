import React from 'react'
import { loginUser } from '../auth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const [user, setUser] = useState({
    "email": '',
    "password": ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev, [name]: value
    }));
  }

  const handlesubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    try {
      const response = await loginUser(user.email, user.password)
      // Store tokens in localStorage or context
      localStorage.setItem('access_token', response.access)
      localStorage.setItem('refresh_token', response.refresh)
      setSuccess('Login successful!')
      navigate('/') // Redirect to home page
    } catch (err) {
      setError(err.detail || 'Login failed. Please check your credentials.')
    }
  }
                      

  return (
    <>
    <div className='center-form'>
    <form onSubmit={handlesubmit} className='flex flex-col sm:flex-wrap justify-center align-center w-fit border bg-gray-50 border-black-300 border-solid rounded-md border-0 p-10 m-4'>
    <h1 className='font-bold text-2xl'>LOGIN</h1>
      <ul className='mt-2'>
        <label className='flex ml-2 font-bold' htmlFor="email">Email Adress</label>    
        <li> <input className='formInput' type="email" name="email" value={user.email} onChange={handleChange} placeholder="Email" /></li>
        
        <label className='flex ml-2 font-bold' htmlFor="password">Password</label>     
        <li> <input className='formInput' type="password" name="password" value={user.password} onChange={handleChange} placeholder="Password" /></li>

      </ul>
      <button type="submit" className='border rounded-md bg-black text-white p-4 m-2 cursor-pointer w-100'>login</button>
    </form>
    </div>
    </>
  )
}
 
export default Login