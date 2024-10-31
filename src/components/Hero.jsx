import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Hero = () => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate();

  const FormSubmit = (e) => {
    e.preventDefault()
    navigate(`/search/${query}`)

  }
  return (
    <div className='mx-auto flex flex-col items-center justify-center p-4 py-16'>
      <h1 className='font-poppins font-semibold text-black text-5xl md:text-6xl text-center'>Insightful & Explanatory Essays.</h1>
      <p className='font-poppins mt-4 text-3xl lg:text-5xl text-purple-500'>Written by Students for Students</p>
      <form 
        className='flex mt-6 w-full h-16 md:w-96'
        onSubmit={FormSubmit}>
        <input 
          className='bg-gray-200 p-4 placeholder:text-black placeholder:text-xl placeholder:font-light outline-none w-full'
          type='text'
          placeholder='Search 10000+ Articles'
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button className='bg-yellow-400 text-black text-xl p-4 font-medium' type='submit'>Search</button>
      </form>
    </div>
  )
}

export default Hero