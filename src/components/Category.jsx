import React from 'react'
import { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom'


const Category = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/blog/category'); // Replace with your API endpoint
        setCategories(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className='mx-auto p-4 py-8 bg-gray-900 text-white flex flex-col items-center justify-center gap-8'>
        <h3 className='heading'>Choose a Category</h3>
        <div className='flex flex-row gap-2 text-black text-center flex-wrap justify-center'>
          {categories.map((category) => (
            <Link to={`category/${category.name}`}>
              <div key={category.id} className='category bg-white font-medium p-2 px-4 rounded-sm text-lg hover:bg-yellow-200 transition'>{category.name}</div>
            </Link>
          ))}
        </div>
    </div>
  )
}

export default Category