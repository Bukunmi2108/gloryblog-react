import React from 'react'
import { Header, Footer } from '../components'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    // Validate password
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 6 characters';
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
      try {
        const response = await axios.post('http://localhost:8000/login', formDataToSend); 
        const data = response.data
        console.log('Registration successful:', data);
        Cookies.set('accessToken', data['access_token'], { expires: 7 }); // Expires in 7 days
        navigate('/blogs');

      } catch (error) {
        console.error('Registration failed:', error);
        // Handle registration errors (e.g., display error message)
        setErrors({ ...errors, generalError: error.message });
      }
    }
  };

  return (<>
    <Header />
    <div className='mx-auto p-4 py-8 flex flex-col items-center justify-center gap-8'>
      <h3 className='heading'>Login</h3>
      <form onSubmit={handleSubmit} className='register'>
        {/* Input fields with error handling */}
        <div className='field'>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>
        <div className='field'>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <button className='bg-yellow-300 text-black p-4 font-medium text-xl' type="submit">{loading?'Logging in':'Login'}</button>
      </form>
    </div>
    <Footer />
    </>
  );
}

export default Login;