import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ResetPassword.css';
import { UserContext } from '../UserContext';
import { Helmet } from 'react-helmet-async';

const ResetPassword = () => {
    const { userInfo } = useContext(UserContext);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function resetPassword() {
        if (newPassword !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setLoading(true);
        setError('');

        const email = userInfo.email;

        try {
            const response = await fetch('https://yndvnlsxm2.execute-api.us-east-2.amazonaws.com/Test/lam/resetpassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, newPassword }),
            });

            if (!response.ok) {
                throw new Error('Error resetting password');
            }

            const data = await response.json();

            if (data.statusCode === 200) {
                setNewPassword('');
                setConfirmPassword('');
                alert("Password has been reset successfully");
                navigate('/userinfo');
            } else {
                setError(data.body || 'An error occurred while resetting the password');
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred while resetting the password. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Helmet>
                <title>GeekFood TF | Reset Password</title>
            </Helmet>
       
            <div className="reset-password-container">
                <div className="reset-password-cyber-background"></div>
                <header className="reset-password-header">
                    <nav className="reset-password-nav">
                        <Link to='/' className="reset-password-company-name">GeekFood Threat Feeds</Link>
                        <div className="reset-password-nav-links">
                            <Link className="reset-password-link" to='/'>Home</Link>
                            <Link className="reset-password-link" to='/userinfo'>User Info</Link>
                        </div>
                    </nav>
                </header>
                <div className="reset-password-content">
                    <div className="reset-password-data-stream"></div>
                    <div className="reset-password-data-stream"></div>
                    <div className="reset-password-data-stream"></div>
                    <div className="reset-password-data-stream"></div>
                    <div className="reset-password-data-stream"></div>
                    <form className="reset-password-form">
                        <h2 className='reset-password-title'>Reset Password</h2>
                        <div className="reset-password-input-group">
                            <label className="reset-password-label">New Password:</label>
                            <input
                                className="reset-password-input"   
                                type="password" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} 
                                placeholder="Enter new password"
                            />
                        </div>
                        <div className="reset-password-input-group">
                            <label className="reset-password-label">Confirm Password:</label>
                            <input
                                className="reset-password-input"   
                                type="password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                placeholder="Confirm new password"
                            />
                        </div>
                        <div className="reset-password-rules">
                            <p>Password must:</p>
                            <ul>
                                <li>Be at least 16 characters long</li>
                                <li>Contain at least one uppercase and one lowercase letter</li>
                                <li>Contain at least one number</li>
                                <li>Contain at least one special character: !@#$%^&*</li>
                            </ul>
                        </div>
                        {error && <p className="reset-password-error">{error}</p>}
                        <div className="reset-password-actions">
                            <button 
                                className="reset-password-button" 
                                type="button" 
                                onClick={resetPassword}
                                disabled={loading}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                            <Link className="reset-password-cancel" to='/userinfo'>Cancel</Link>
                        </div>
                        <footer className="reset-password-footer">
                            <p>Privacy Policy</p><p>Terms of Service</p><p>Subscription Agreement</p> 
                        </footer>
                        <footer className="reset-password-footer2">
                            <p>2024 GeekFood Threat Feeds, The intern.</p>
                        </footer>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ResetPassword;