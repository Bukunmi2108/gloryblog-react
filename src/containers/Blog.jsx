import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header, Footer } from '../components';
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";


const Blog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showElement, setShowElement] = useState(false);
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false); // Like state
  const [isDisliked, setIsDisliked] = useState(false); // Dislike state
  const accessToken = Cookies.get('accessToken');

  const handleNotification = (message, type = "info") => {
     toast[type](`${message}`, {
       position: "top-right",
       autoClose: 3000,
       hideProgressBar: false,
       closeOnClick: true,
       pauseOnHover: true,
       draggable: true,
       progress: undefined,
     });
   };

  const AuthHeaders = {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/blog/${id}`);
        setBlog(response.data);
        // Check for initial like/dislike state based on data (if available)
        setIsLiked(response.data.isLiked || false); // Set like state based on data
        setIsDisliked(response.data.isDisliked || false); // Set dislike state based on data
        setLikes(response.data.likes)
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const truncateLikeCount = (count) => {
    const billionThreshold = 1000000000; // Threshold for billions

    if (count >= billionThreshold) {
      return `${(count / billionThreshold).toFixed(1)}B`;
    } else if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    } else {
      return count;
    }
  }

  const datetimeString = blog.created_at;
  const dateObject = new Date(datetimeString);

  const formattedDate = dateObject.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = dateObject.toLocaleTimeString('en-NG', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  const HandleBtnClick = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/blog/${id}/likes`, {}, AuthHeaders);
      
      setIsLiked(true);
      setLikes(prev => prev + 1);
    
    } catch (error) {
      const status = error.status
      
      if (status === 400) {
        handleNotification("Already Liked");
      } else if (status === 401) {
        handleNotification("Login to Like this post");
      } else {
        handleNotification(error.code);
      }
    }
  }

  
  const HandleBtnClickD = async () => {
    if (isLiked) {
      try {
        await axios.delete(`http://localhost:8000/blog/${id}/likes`, AuthHeaders);

        setIsDisliked(true);
        setIsLiked(false)
        // Update dislike count in UI 
        setLikes(prev => prev - 1);
      } catch (error) {
        console.error('Dislike API call failed:', error);
        handleNotification('An error occurred while disliking the post. Please try again later.'); // Display a generic error message to the user
      }
    } else {
      handleNotification("You have not liked the post")
    }
  };

    // useEffect(() => {
    //   if (error) {
    //     const timeoutId = setTimeout(() => {
    //       setShowElement(false);
    //     }, 5000); // 5000 milliseconds = 5 seconds
    
    //     return () => clearTimeout(timeoutId);
    //   }
    // }, [error]); // Dependency on error state

  return (
    <>
    <ToastContainer /> {/* Render ToastContainer here */}
    {showElement && <div>{error}</div>}
    <Header />
    <div className='blog font-poppins text-black p-4 flex flex-col gap-4 mx-auto container'>
      <h2 className='font-bold text-3xl mt-4'>{blog.title}</h2>
      <div className='flex items-center justify-between text-gray-600'>
        <span className='flex gap-4'>
          <span>{formattedDate}</span>
          <span>{formattedTime}</span>
        </span>
        <span>
          {blog.author_name.name}
        </span>
      </div>
      <div>{truncateLikeCount(likes)} likes</div>
      <hr></hr>
      <div className='blog_content leading-loose' dangerouslySetInnerHTML={{ __html: blog.content }}></div>
    </div>
    <div className='flex gap-4 justify-center my-4'>
      <button onClick={HandleBtnClick}>{isLiked ? <AiFillLike className='w-8 h-8'/> : <AiOutlineLike className='w-8 h-8'/>}</button>
      <button onClick={HandleBtnClickD}>{isDisliked ? <AiFillDislike className='w-8 h-8'/> : <AiOutlineDislike className='w-8 h-8'/>}</button>
    </div>
    <Footer />
    </>
    );
};
    
export default Blog;