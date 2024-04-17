import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './RegistrationPage.css';

const RegistrationPage = () => {
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false); // State for indicating if the username is taken
  const [emailtaken, setEmailTaken] = useState(false); // State for indicating if the username is taken
  const [invalidAge, setInvalidAge] = useState(false); // State for indicating if the age is invalid
  const [invalidEmail, setInvalidEmail] = useState(false); // State for indicating if the email is invalid
  const navigate = useNavigate(); // Hook for navigation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleRegistration = () => {
    console.log('Registration button clicked');
    if (!username || !email || !age || !password || !repeatPassword) {
      console.log('Please fill in all fields');
      return;
    }
  
  
    if (!email.match(emailRegex)) {
      console.log('Invalid email format');
      setEmail(''); // Clear email field
      setInvalidEmail(true); // Set the state indicating that the email is invalid
      return;
    }
    
  
    if (!password.match(passwordRegex)) {
      console.log('Invalid password format');
      setPassword(''); // Clear password field
      setRepeatPassword(''); // Clear repeat password field
      return;
    }

    axios
      .get('http://localhost:5000/') // GET request to the root URL
      .then(response => {
        console.log('GET request successful:', response.data);
      })
      .catch(error => {
        console.error('GET request error:', error);
      });

    const userData = {
      username: username,
      age: age,
      email: email,
      password: password,
    };

    axios
      .get('http://localhost:5000/checkUsername', { params: { username: username } }) // GET request to check if the username exists
      .then(response => {
        if (response.data.exists) {
          console.log('Username already taken');
          setUsernameTaken(true); // Set the state indicating that the username is taken
        } else {setUsernameTaken(false);
          axios
      .get('http://localhost:5000/checkEmail', { params: { email: email } }) // GET request to check if the username exists
      .then(response => {
        if (response.data.exists) {
          console.log('Email already exists');
          setEmailTaken(true); // Set the state indicating that the username is taken
        } else {
          axios
            .post('http://localhost:5000/register', userData) // POST request to the /register URL
            .then(response => {
              console.log('POST request successful:', response.data);
              // new code added between
              // Store the received token in local storage
              localStorage.setItem('token', response.data.token);
              // new code added between
              navigate('/'); // Navigate to the homepage
            })
            .catch(error => {
              console.error('POST request error:', error);
            });
        }
      })
      .catch(error => {
        console.error('GET request error:', error);
      });}
    })
    .catch(error => {
      console.error('GET request error:', error);
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowRepeatPassword = () => {
    setShowRepeatPassword(!showRepeatPassword);
  };

  const handlePasswordPaste = e => {
    e.preventDefault();
  };

  const handleRepeatPasswordPaste = e => {
    e.preventDefault();
  };

  const handleAgeChange = e => {
    const newAge = e.target.value;
    setAge(newAge);
    setInvalidAge(parseInt(newAge) > 200);
  };

  return (
    <div className="registration-container">
      <div className="top-bar">
        <Link to="/" className="signup-link">
          Home Page
        </Link>
      </div>
      <div className="registration-card">
        <h2>User Registration</h2>
        <div className="form-group">
          <input
            className="form-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          {usernameTaken && <p className="error-message">Username already taken</p>} {/* Display error message if usernameTaken state is true */}
        </div>
        <div className="form-group">
          <input
            className="form-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {!email.match(emailRegex) && (
    <p className="error-message">
      Invalid Email
    </p>
  )}
  {emailtaken && <p className="error-message">Email already Exists</p>} {/* Display error message if usernameTaken state is true */}
        </div>
        <div className="form-group">
          <input
            className="form-input"
            type="number"
            placeholder="Age"
            value={age}
            onChange={handleAgeChange}
          />
          {invalidAge && <p className="error-message">Age not valid</p>} {/* Display error message if invalidAge state is true */}
        </div>
        <div className="form-group">
          <div className="password-input">
            <input
              className="form-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onPaste={handlePasswordPaste}
            />
            <span className="password-toggle" onClick={toggleShowPassword}>
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </span>
          </div>
          {!password.match(passwordRegex) && (
    <p className="error-message">
      Password must contain at least one uppercase letter, one lowercase letter, one special character, and be at least 10 characters long.
    </p>
  )}
        </div>
        <div className="form-group">
          <div className="password-input">
            <input
              className="form-input"
              type={showRepeatPassword ? 'text' : 'password'}
              placeholder="Repeat Password"
              value={repeatPassword}
              onChange={e => setRepeatPassword(e.target.value)}
            />
            <span className="password-toggle" onClick={toggleShowRepeatPassword}>
              {showRepeatPassword ? '👁️' : '👁️‍🗨️'}
            </span>
          </div>
        </div>
        <div className="form-group">
          <button
            className="registration-button"
            onClick={() => handleRegistration()}
            disabled={!username || !email || !age || !password || !repeatPassword}
          >
            Register
          </button>
          <div className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;


