import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Import the LoginPage.css file

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // const handleLogin = () => {
  //   axios
  //     .post('http://localhost:5000/login', { email, password })
  //     .then(response => {
  //       const { success, message } = response.data;
  //       if (success) {
  //         // Successful login
  //         console.log('Login successful');
          

  //         // new code added between
  //         // Store the received token in local storage
  //         localStorage.setItem('token', response.data.token);
  //         // new code added between

  //         // Redirect to the homepage
  //         navigate('/');
  //       } else {
  //         // Invalid credentials
  //         setErrorMessage(message);
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Login request error:', error);
  //     });
  // };


  const handleLogin = () => {
    axios
      .post('http://localhost:5000/login', { email, password })
      .then(response => {
        const { success, message, user } = response.data;
        if (success) {
          // Successful login
          console.log('Login successful');
  
          // Store the received token in local storage
          localStorage.setItem('token', response.data.token);
  
          // Retrieve the author_id from the logged-in user's data
          const authorId = user.author_id;
  
          // Redirect to the user profile based on author_id
          navigate(`/userProfile/${authorId}`);
        } else {
          // Invalid credentials
          setErrorMessage(message);
        }
      })
      .catch(error => {
        console.error('Login request error:', error);
      });
  };

  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="top-bar">
        <Link to="/" className="signup-link">
          Home Page
        </Link>
      </div>
      <div className="login-card">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
            <span className="password-toggle" onClick={toggleShowPassword}>
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </span>
          </div>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button className="login-button" onClick={handleLogin}>
          Sign In
        </button>
        <div className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;