import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const Header = () => {
  const [query, setQuery] = useState('')
  const inputRef = useRef();
  const navigate = useNavigate();

  const FormSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      navigate(`/search/${query}`);
    }
  };

  const [ menuState, setMenuState] = useState(false)
  return (
    <div id='header'>
      <nav className="navbar relative">
        <form 
          className='hidden md:flex'
          onSubmit={FormSubmit}>
          <input 
            className='bg-gray-600 placeholder:text-gray-100 px-2 py-2 outline-none'
            type='text'
            placeholder="Search Glory's Blog"
            ref={inputRef}
            onKeyDown={FormSubmit}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </form>
        <div className="logo">
          <Link to="/" ><h3 className='font-poppins text-2xl font-semibold'>Glory's Blog</h3></Link>
        </div>
        <div className='flex gap-1 text-lg'>
          <button className='bg-purple-700 text-white'><Link to="/register">Register</Link></button>
          <button className='bg-purple-700 text-white'><Link to="/login" >Login</Link></button>
          <button onClick={() => setMenuState(prevMenuState => !prevMenuState)} className='z-10 bg-yellow-300 text-black'>{!menuState? 'Menu': 'Close'}</button>
        </div>
        {menuState && <ul className='fixed h-full top-0 right-0 flex flex-col items-center justify-center bg-gray-900 p-4 opacity-90 font-medium text-xl gap-4'>
          <li></li>
          <li><Link to="/blogs" >All Blogs</Link></li>
          <li><Link to="/blog/form" >Create Blog</Link></li>
          <li><Link to="/profile" >Profile</Link></li>
          <li><Link to="/" >All Categories</Link></li>
          <li><Link to="/logout" >Logout</Link></li>
        </ul>}

      </nav>
    </div>
  )
}

export default Header