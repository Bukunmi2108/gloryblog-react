import React, { useState, useEffect } from 'react';
import { Header, Footer } from '../components';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';


const Blogs = () => {
  const [blogs, setBlogs] = useState([]); // State to store blog data
  const [user, setUser] = useState({}); 
  const [userTxt, setUserTxt] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const accessToken = Cookies.get('accessToken')
  const { q } = useParams(); // Extract search query from route params
  const [errors, setErrors] = useState(null); // State for error handling

  const AuthHeaders = {
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        setErrors(null); // Clear any previous errors

        try {
            const response = await axios.get(`http://localhost:8000/user/profile`, AuthHeaders);

              if (response.status === 404) {
                setBlogs([]); 
                setErrors({ ...errors, generalError: `Please login to access this page`});
              } else if (response.status === 401) {
                setBlogs([]); 
                setUserTxt('');
                setErrors({ ...errors, generalError: `Please login to access this page`});
              } else {
                console.log(response.data);
                setBlogs(response.data.blogs); 
                setUser(response.data.user); 
                setUserTxt(response.data.user.name.substring(0,1))

              }
            } catch (error) {
            console.error('Error fetching blog posts:', error);
            if (error.response) {
            console.error('Server responded with status:', error.response.status);
            console.error('Error message:', error.response.data); // 
            switch (error.response.status) {
                case 400:
                setErrors({ ...errors, generalError: 'Invalid search query' });
                break;
                case 204:
                setErrors({ ...errors, generalError: 'No blog posts found' });
                break;
                case 500:
                setErrors({ ...errors, generalError: 'Internal server error' });
                break;
                default:
                setErrors({ ...errors, generalError: 'An unexpected error occurred' });
            }
            } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received from server');
            setErrors({ ...errors, generalError: 'Network error or server unavailable' });
            } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up request:', error.message); 
        
            setErrors({ ...errors, generalError: 'An error occurred during request setup' });
            }
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
          <div className='text-purple-500 text-lg font-poppins'>Loading blogs...</div>
        ) : errors ? (
          <div className='text-gray-900 text-lg font-poppins'>Error: {errors.generalError}</div>
        ) : (
          <div className='mx-auto flex flex-col items-center justify-center gap-6'>
            <div className='user font-poppins flex items-center justify-center gap-4'>
              <span className='font-medium text-4xl md:text-8xl bg-gray-700 text-white rounded-full flex items-center justify-center p-4 md:p-8 m-0'>{userTxt.toUpperCase()}</span>
              <div className='text-2xl md:text-4xl flex flex-col'>
                <span>{user.name}</span>
                <span>{user.email}</span>
              </div>
            </div>
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