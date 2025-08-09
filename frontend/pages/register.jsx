import React, { useState } from 'react'
import axios from 'axios'

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

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        username: form.username,
        email: form.email,
        address: form.address,
        password: form.password
            };
      const response = await axios.post('http://127.0.0.1:8000/api/auth/signup/', payload); // send payload directly
      setSuccess(true);
      // Optionally clear form or redirect
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
    }
  };

  return (
    <>
    <div className='center-form'>
    <form onSubmit={handleSubmit} className='flex flex-col sm:flex-wrap justify-center align-center w-fit border border-black-300 border-solid rounded-md border-0 p-4 m-4'>
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
      <button type="submit" className='border rounded-md bg-black text-white p-4 m-2 cursor-pointer w-100'>Register</button>
      {error && console.log(error)}
      {success && <div style={{color:'green'}}>Registration successful!</div>}
    </form>
    </div>
    </>
  );
}

export default Register