import React from 'react';
import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Header, Footer } from '../components';
import QuillEditor from "react-quill";
import "react-quill/dist/quill.snow.css";

const BlogForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_name: ''
  });
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);

  const accessToken = Cookies.get('accessToken')
  // const AuthHeaders = {
  //   headers: {
  //     'Authorization': 'Bearer ' + accessToken,
  //     'Content-Type': 'application/json'
  //   }
  // }
  // Editor ref
  const quill = useRef();

  const imageHandler = useCallback(() => {
    // Create an input element of type 'file'
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    // When a file is selected
    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();

      // Read the selected file as a data URL
      reader.onload = () => {
        const imageUrl = reader.result;
        const quillEditor = quill.current.getEditor();

        // Get the current selection range and insert the image at that index
        const range = quillEditor.getSelection(true);
        quillEditor.insertEmbed(range.index, "image", imageUrl, "user");
      };

      reader.readAsDataURL(file);
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: true,
      },
    }),
    [imageHandler]
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "clean",
  ];


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/blog/category'); 
 // Replace with your API endpoint
        setCategories(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error('Error fetching categories:', 
 error);
      }
    };

    fetchCategories();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Validate title
    if (!formData.title) {
      newErrors.title = 'Title is required';
    }

    // Validate content
    if (!formData.content) {
      newErrors.content = 'Content is required';
    }
    // Validate category_name
    if (!formData.category_name) {
      newErrors.category_name = 'Category is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
    
      console.log(formData)
      try {
        const response = await axios.post('http://localhost:8000/blog/create', formData,  {
          headers: {'Authorization': 'Bearer ' + accessToken}
        }); 
        const data = response.data
        console.log('Registration successful:', response.data);
        navigate(`/blog/${response.data.id}`)

      } catch (error) {
        console.error('Registration failed:', error);
        // Handle registration errors (e.g., display error message)
        setErrors({ ...errors, generalError: error.message });
      }
    }
  };

    return (<>
      <Header />
      <div className="create-blog-form mx-auto flex flex-col items-center justify-between p-2 py-10 w-full">
        <h2 className='heading'>Create Blog</h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
          <div className="form-group field">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            {errors.title && <p className="error">{errors.title}</p>}
          </div>
          <div className="form-group w-full">
            <label htmlFor="content">Content:</label>
            <QuillEditor
              ref={(el) => (quill.current = el)}
              theme="snow"
              value={formData.content}
              formats={formats}
              modules={modules}
              onChange={(value) => {
                setFormData((prevData) => ({
                  ...prevData,
                  content: value,
                }));
              }}
            />
            {errors.content && <p className="error">{errors.content}</p>}
          </div>
          <div className="form-group field">
          <label htmlFor="category_name">Choose a Category:</label>
            <select 
            name='category_name'
            value={formData.category_name}
            className='p-2 bg-gray-300 rounded'
            onChange={handleInputChange}>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>{category.name}</option>)
              )}
            </select>
            {errors.category_name && <p className="error">{errors.category_name}</p>}
          </div>
          <button className='bg-yellow-300 text-black p-4 font-poppins w-full md:w-96' type="submit">Create Blog</button>
          {errors.general && <p className="error">{errors.general}</p>}
        </form>
      </div>
      <Footer />
      </>
    );
  };

export default BlogForm;