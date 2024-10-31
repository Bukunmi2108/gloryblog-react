import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Blog, BlogForm, BlogResult, Blogs, CategoryResult, Login, Register, Logout, User } from './containers'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/form" element={<BlogForm />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/search/:q" element={<BlogResult />} />
        <Route path="/category/:q" element={<CategoryResult />} />
        <Route path="/profile" element={<User />} />
      </Routes>
    </Router>
  );
}

export default App;
