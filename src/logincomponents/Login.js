import React, { useState, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { Helmet } from 'react-helmet-async';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const navigate = useNavigate();
  const { setUserInfo } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUserData = useCallback((holdEmail, holdFirstname, holdLastname) => {
    setUserInfo({
      email: holdEmail,
      firstname: holdFirstname,
      lastname: holdLastname
    });
  }, [setUserInfo]);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleTwoFactorCodeChange = (e) => setTwoFactorCode(e.target.value);

  const fetchPost = async (email, password) => {
    if (!email || !password) {
      setError('Please fill in both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = 'https://b1u39sj3x5.execute-api.us-east-2.amazonaws.com/prod/login';
      const type = 'login';
      const credentials = { type, email, password };
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (data.statusCode !== 200) {
        throw new Error("Invalid credentials");
      }

      // Check if 2FA is required
        // await sendTwoFactorCode(email);
        setShowTwoFactor(true);

    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendTwoFactorCode = async (email) => {
    console.log('Sending 2FA request for email:', email);
    console.log('Sending 2FA request for email:', email);
    try {
      const response = await fetch('https://b1u39sj3x5.execute-api.us-east-2.amazonaws.com/prod/generate2FACode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    
      const data = await response.json();
      console.log('2FA response:', data);
    
      if (!response.ok) {
        throw new Error(data.body || 'Failed to send 2FA code');
      }
    
      // Handle successful 2FA code sending
      alert('2FA code has been sent to your email. Please check your inbox.');
    
    } catch (error) {
      console.error('Error sending 2FA code:', error.message);
      alert('Failed to send 2FA code. Please try again.');
    } 
  };

  const verifyTwoFactorCode = async () => {
    if (!twoFactorCode) {
      setError('Please enter the 2FA code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://b1u39sj3x5.execute-api.us-east-2.amazonaws.com/prod/2FA', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: twoFactorCode }),
      });

      if (!response.ok) {
        throw new Error('Invalid 2FA code');
      }

      const data = await response.json();
      console.log(data);
      console.log(data.statusCode);

      // If 2FA verification is successful, fetch user data
      if (data.statusCode === 200) {
        await fetchUserData(email);
        alert("Verified!");
      } else {
        await fetchUserData(email);
        alert("Incorrect Code");
      }
      
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Invalid 2FA code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (email) => {
    try {
      const userResponse = await fetch(`https://yndvnlsxm2.execute-api.us-east-2.amazonaws.com/Test/lam?email=${encodeURIComponent(email)}`);
      if (!userResponse.ok) {
        throw new Error(`HTTP error! Status: ${userResponse.status}`);
      }

      const userDataResponse = await userResponse.json();
      const userDataString = userDataResponse.body;
      const userData = JSON.parse(userDataString);
      handleUserData(userData.Email, userData.Firstname, userData.Lastname);
      navigate('/upload');
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to fetch user data. Please try again.');
    }
  };

  return (
    <>
      <Helmet>
        <title>GeekFood TF | Login</title>
      </Helmet>
      <div className="login-container">
        <div className="login-cyber-background"></div>
        <header className="login-header">
          <nav className="login-nav">
            <Link to='/' className="login-company-name">GeekFood Threat Feeds</Link>
            <div className="login-nav-links">
              <Link className="login-about-link" to='/about'>About</Link>
              <Link className="login-login-link active" to='/login'>Log In</Link>
              <Link className="login-signup-link" to='/signup'>Sign Up Free</Link>
            </div>
          </nav>
        </header>
        <div className="login-data-stream"></div>
        <div className="login-data-stream"></div>
        <div className="login-data-stream"></div>
        <div className="login-data-stream"></div>
        <div className="login-data-stream"></div>
        <main className="login-main">
          <h1 className="login-main-title">Welcome Back</h1>
          <form className="login-form">
            {!showTwoFactor ? (
              <>
                <div className="login-input-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={email} 
                    onChange={handleEmailChange} 
                    required
                  />
                </div>
                <div className="login-input-group">
                  <label htmlFor="password">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    value={password} 
                    onChange={handlePasswordChange} 
                    required
                  />
                </div>
                {error && <p className="login-error">{error}</p>}
                <button 
                  type="button" 
                  className="login-button" 
                  onClick={() => fetchPost(email, password)}
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Log In'}
                </button>
              </>
            ) : (
              <>
                <div className="login-input-group">
                  <label htmlFor="twoFactorCode">Enter 2FA Code</label>
                  <input 
                    type="text" 
                    id="twoFactorCode" 
                    value={twoFactorCode} 
                    onChange={handleTwoFactorCodeChange} 
                    required
                  />
                </div>
                {error && <p className="login-error">{error}</p>}
                <button 
                  type="button" 
                  className="login-button" 
                  onClick={verifyTwoFactorCode}
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify 2FA Code'}
                </button>
              </>
            )}
            <Link className="login-forgot-password" to='/forgotpassword'>Forgot Password?</Link>
          </form>
        </main>
        <footer className="login-footer">
          <p>&copy; 2024 GeekFood Threat Feeds. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default Login;