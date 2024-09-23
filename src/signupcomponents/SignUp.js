import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './SignUp.css'

const SignUp = () => {
    // Stores the email
    const [email, setEmail] = useState('');
    // Stores the firstname
    const [firstname, setFirstname] = useState('');
    // Stores the lastname
    const [lastname, setLastname] = useState('');
    // Stores the password
    const [password, setPassword] = useState('');
    // Stores the users comaparing password
    const [checkPassword, setCheckPassword] = useState('');
    // Stores the loading boolean
    const [loading, setLoading] = useState(false);
    // Stores the error
    const [error, setError] = useState('');
    // Setting navigate to navigate to another page
    const navigate = useNavigate();

    // handleSubmit password checks if both entered passwords are the same and throws and error to alert the user if they are not
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== checkPassword) {
            setError('Passwords do not match');
            return;
        }

        // Setting loading baseline and setting the error to nothing
        setLoading(true);
        setError('');

        try {
            // The url to the REST api in AWS - The API is called Test
            const url = 'https://yndvnlsxm2.execute-api.us-east-2.amazonaws.com/Test/lam';
            // Specifying the type for lambda
            const type = 'signup';
            // Setting the credentials to be sent in JSON format
            const credentials = { type, email, firstname, lastname, password }
            // Using "POST" method
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            // Checking if the response is okay, if not it throws an error.
            if (!response.ok) {
                throw new Error('Failed to sign up');
            }
            // Storing ok response
            const data = await response.json();
            // Checking if the status code is 200, that means the credentials already exist, and allows the user to login
            if (data.statusCode === 200) {
                alert('Account created successfully. Taking you back to login.');
                navigate('/login');
            } else {
                setError(data.body || 'An error occurred during sign up');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred. Please try again.');
        } finally {
            // Setting the loading to false
            setLoading(false);
        }
    }

    return (
        <>
            <Helmet>
                <title>GeekFood TF | Sign Up</title>
            </Helmet>
            <div className="signup-container">
                <div className="signup-cyber-background"></div>
                <header className="signup-header">
                    <nav className="signup-nav">
                        <Link to='/' className="signup-company-name">GeekFood Threat Feeds</Link>
                        <div className="signup-nav-links">
                            <Link className="signup-about-link" to='/about'>About</Link>
                            <Link className="signup-login-link" to='/login'>Log In</Link>
                            <Link className="signup-signup-link active" to='/signup'>Sign Up Free</Link>
                        </div>
                    </nav>
                </header>
                <div className="signup-data-stream"></div>
                <div className="signup-data-stream"></div>
                <div className="signup-data-stream"></div>
                <div className="signup-data-stream"></div>
                <div className="signup-data-stream"></div>
                <main className="signup-main">
                    <h1 className="signup-main-title">Get Started with GeekFood Threat Feeds</h1>
                    <form className="signup-form" onSubmit={handleSubmit}>
                        <p className="signup-instruction">Enter the information below to create your free account</p>
                        <div className="signup-input-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required
                            />
                        </div>
                        <div className="signup-input-group">
                            <label htmlFor="firstname">First Name</label>
                            <input 
                                type="text" 
                                id="firstname" 
                                value={firstname} 
                                onChange={(e) => setFirstname(e.target.value)} 
                                required
                            />
                        </div>
                        <div className="signup-input-group">
                            <label htmlFor="lastname">Last Name</label>
                            <input 
                                type="text" 
                                id="lastname" 
                                value={lastname} 
                                onChange={(e) => setLastname(e.target.value)} 
                                required
                            />
                        </div>
                        <div className="signup-input-group">
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required
                            />
                        </div>
                        <div className="signup-input-group">
                            <label htmlFor="checkpassword">Re-Enter Password</label>
                            <input 
                                type="password" 
                                id="checkpassword" 
                                value={checkPassword} 
                                onChange={(e) => setCheckPassword(e.target.value)} 
                                required
                            />
                        </div>
                        {error && <p className="signup-error">{error}</p>}
                        <button 
                            type="submit" 
                            className="signup-button" 
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                </main>
                <footer className="signup-footer">
                    <p>&copy; 2024 GeekFood Threat Feeds. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}

export default SignUp;