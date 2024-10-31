import React, { useState, useEffect } from 'react';
import { Header, Footer } from '../components';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]); // State to store blog data
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Clear any previous errors

      try {
        const response = await axios.get('http://localhost:8000/blog/all');
        setBlogs(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError(error); // Store error for display
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures data is fetched only once

  const contentpreview = (content) => {
    const response = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] })
    return response
  };

  return (
    <>
      <Header />
      <div className='mx-auto p-2 md:px-16 py-10'>
        {isLoading ? (
          <div>Loading blogs...</div>
        ) : error ? (
          <div>Error: {error.message}</div>
        ) : (
          <div className='mx-auto flex flex-col items-center justify-center gap-6'>
            <h2 className='heading'>All Blogs</h2>
            <div className='flex flex-col gap-4'>
              {blogs.map((blog) => (
                <Link key={blog.blog_id} to={`/blog/${blog.blog_id}`}> 
                  <div className='blog-preview'>
                    <div className='blog-card'>
                      <div className='blog-tag'>
                        <span>{blog.blog_category}</span>
                        <div className='blog-likes'>{blog.likes}</div>
                      </div>
                      <h3>{blog.blog_title}</h3>
                      <div className='blog-tag'>
                        <span>500 views</span>
                        <div>by {blog.author_name}</div>
                      </div>
                    </div>
                    <div className='blog-preview-summary'>
                      {contentpreview(blog.blog_content).substring(0, 200)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Blogs;