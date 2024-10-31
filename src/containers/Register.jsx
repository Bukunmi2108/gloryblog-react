import React from 'react'
import { Header, Footer } from '../components'
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState({});

  Cookies.remove('accessToken');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate username
    if (!formData.username) {
      newErrors.username = 'Username is required';
    }

    // Validate email
    if (!formData.email || !isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Validate password
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(prev => !prev)

    if (validateForm()) {
      const formDataToSend = new FormData();
      for (const [key, value] of Object.entries(formData)) {
        formDataToSend.append(key, value);
        }
      console.log(formDataToSend);
        
      try {
        const response = await axios.post('http://localhost:8000/user', formDataToSend); 
        console.log('Registration successful:', response.data);
        navigate('/login');

      } catch (error) {
        console.error('Registration failed:', error);
        // Handle registration errors (e.g., display error message)
        setErrors({ ...errors, generalError: error.message });
      }
    }
  };

  const isValidEmail = (email) => {
    // Implement a more robust email validation if needed
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (<>
    <Header />
    <div className='mx-auto p-4 py-8 flex flex-col items-center justify-center gap-8'>
      <h3 className='heading'>Register</h3>
      <form onSubmit={handleSubmit} className='register'>
        {/* Input fields with error handling */}
        <div className='field'>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder='Enter your Username'
            value={formData.username}
            onChange={handleInputChange}
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>
        <div className='field'>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder='Enter your Email'
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className='field'>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder='Enter your Password'
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div className='field'>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder='Confirm your Password'
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>
        <button className='bg-yellow-300 text-black p-4 font-medium text-xl' type="submit">{loading? 'Registering':'Register'}</button>
      </form>
    </div>
    <Footer />
    </>
  );
}

export default Register;