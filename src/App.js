import './App.css';
import './g_style.css';
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

import About from './pages/About';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Splash from './pages/SplashPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Game from './pages/Game';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';

import Navbar from './Nav';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/game" element={<Game />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/splash" element={<Splash />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
