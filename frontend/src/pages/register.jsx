import React, { useState, useEffect } from 'react'
import { registerUser } from '../auth'
import { useNavigate } from 'react-router';
import { loginUser } from '../auth';
import { get_token } from '../auth';

import axios from 'axios';

const Register = () => {

  

      
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: '',
    is_staff: false
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    
    try {
      await registerUser(
        form.first_name,
        form.last_name,
        form.username,
        form.email,
        form.password,
        form.confirmPassword, 
        form.address
      );
      setSuccess(true);
      

      
      
    } catch (err) {
      console.log(err);
      setError(err.detail || 'Registration failed');
    } finally {
      setLoading(false);
      
    }
  };


  const [isloggedin, setIsloggedin] = useState(false)

  useEffect(() => {
      const testAuthMechanism = async () => {
          try {
              if (isloggedin) {
                  console.log('user is logged in! (test)')

              } else {
                  const response = await loginUser('theog@gmail.com', 'ogamine1')
                  setIsloggedin(true)
              } 

          } catch (error) {
              throw error.response.data;
          } 
      } 

      testAuthMechanism()
  }, [isloggedin]) 
        

  


  return (
    <>
    <div className='center-form'>
    <form onSubmit={handleSubmit} className='flex flex-col sm:flex-wrap justify-center align-center w-fit border bg-gray-50 border-black-300 border-solid rounded-md border-0 p-10 m-4'>
      <h1 className='font-bold text-2xl'>REGISTER</h1>
      <ul className='mt-2'>
        <label className='flex ml-2 font-bold' htmlFor="first_name">First Name</label> 
        <li> <input className='formInput' type="text" name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" /></li>

        <label className='flex ml-2 font-bold' htmlFor="last_name">Last Name</label>   
        <li> <input className='formInput' type="text" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" /></li>

        <label className='flex ml-2 font-bold' htmlFor="username">Username</label>     
        <li> <input className='formInput' type="text" name="username" value={form.username} onChange={handleChange} placeholder="Username" /></li>

        <label className='flex ml-2 font-bold' htmlFor="email">Email Adress</label>    
        <li> <input className='formInput' type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" /></li>
        
        <label className='flex ml-2 font-bold' htmlFor="adress">Home Adress</label>    
        <li> <input className='formInput' type="text" name="address" value={form.address} onChange={handleChange} placeholder="Address" /></li>

        <label className='flex ml-2 font-bold' htmlFor="password">Password</label>     
        <li> <input className='formInput' type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" /></li>

        <label className='flex ml-2 font-bold' htmlFor="confirmPassword">Confirm Password</label> 
        <li> <input className='formInput' type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" /></li>

      </ul>
      <button 
        type="submit" 
        className='border rounded-md bg-black text-white p-4 m-2 cursor-pointer w-100'
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
      {success && <div style={{color:'green'}}>Registration successful!</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
    </div>
    </>
  );
}

export default Register