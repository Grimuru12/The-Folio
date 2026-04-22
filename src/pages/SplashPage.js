import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/1x1pic.jpg';
import '../App.css';

function Splash() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time, then redirect to home
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Redirect to home after fade out
      setTimeout(() => {
        navigate('/');
      }, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="loader-container" style={isLoading ? {} : { animation: 'fadeOut 0.5s ease-out forwards' }}>
      <div className="logo">
        <img src={logo} alt="LOGO" />
      </div>
      <h1>Portfolio</h1>
      <div className="spinner"></div>
      <div className="loading-text">
        Loading<span className="dots">...</span>
      </div>
    </div>
  );
}

export default Splash;