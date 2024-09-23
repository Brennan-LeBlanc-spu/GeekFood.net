import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import './ForgotPassword.css'; // Ensure you have this CSS file

const ForgotPassword = () => {
  // Storing Data
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // NEED TO FIXXX
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
        const response = await axios.get('https://q5w6nj6tk7.execute-api.us-east-2.amazonaws.com/prod/forgotpassword', {
            params: {
                email: email
            }
        });
        console.log(response.data.message);
        setMessage('If an account exists for this email, a password reset link has been sent.');
    } catch (error) {
        console.error('Error requesting password reset:', error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            setMessage(error.response.data.message || 'An error occurred. Please try again later.');
        } else if (error.request) {
            // The request was made but no response was received
            setMessage('No response from server. Please try again later.');
        } else {
            // Something happened in setting up the request that triggered an Error
            setMessage('An error occurred. Please try again later.');
        }
    }
    setIsLoading(false);
}

  return (
    <>
      <Helmet>
        <title>GeekFood TF | Forgot Password</title>
      </Helmet>
      <div className="forgotpassword-container">
        <div className="forgotpassword-cyber-background"></div>
        <header className="forgotpassword-header">
          <nav className="forgotpassword-nav">
            <Link to='/' className="forgotpassword-company-name">GeekFood Threat Feeds</Link>
            <div className="forgotpassword-nav-links">
              <Link className="forgotpassword-login-link" to='/login'>Log In</Link>
              <Link className="forgotpassword-signup-link" to='/signup'>Sign Up</Link>
            </div>
          </nav>
        </header>
        <div className="forgotpassword-data-stream"></div>
        <div className="forgotpassword-data-stream"></div>
        <div className="forgotpassword-data-stream"></div>
        <div className="forgotpassword-data-stream"></div>
        <div className="forgotpassword-data-stream"></div>
        <main className="forgotpassword-main">
          <h1 className="forgotpassword-main-title">Forgot Password</h1>
          <div className="forgotpassword-form-container">
            <form onSubmit={handleSubmit} className="forgotpassword-form">
              <p className="forgotpassword-instruction">Enter your email address to reset your password</p>
              <div className="forgotpassword-input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="forgotpassword-button" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Reset Password'}
              </button>
            </form>
            <Link to="/login" className="forgotpassword-back-link">Back to Login</Link>
          </div>
        </main>
        <footer className="forgotpassword-footer">
          <p>&copy; 2024 GeekFood Threat Feeds. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default ForgotPassword;