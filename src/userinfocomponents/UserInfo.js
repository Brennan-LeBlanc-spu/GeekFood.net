import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { UserContext } from '../UserContext';
import './UserInfo.css';

const UserInfo = () => {
  // Storing UserContext into userInfo (This is the user info (email, firstname, and lastname)
  const { userInfo } = useContext(UserContext);
  // Setting navigate to useNavigate to allow to navigate to another page
  const navigate = useNavigate();
  // Storing deleting state with a boolean
  const [isDeleting, setIsDeleting] = useState(false);

  // deleteuser is a funciton that checks if the user wants to delete their account
  async function deleteUser() {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    // Setting the delete state to true
    setIsDeleting(true);
    try {
      // 'DELETE' method to communicate with the Test REST API in aws to delete the user in the s3 bucket "geekfood.net.logs"
      const response = await fetch('https://yndvnlsxm2.execute-api.us-east-2.amazonaws.com/Test/lam', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userInfo.email }),
      });
      // Checking if the resposne is okay
      if (!response.ok) {
        throw new Error('Error deleting user');
      }
      // If the response is okay let the user know
      alert("Account has been deleted, redirecting to home page");
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the account. Please try again.');
    } finally {
      // Set the loading data to false
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>GeekFood TF | User Info</title>
      </Helmet>
      <div className="userinfo-container">
        <div className="userinfo-cyber-background"></div>
        <header className="userinfo-header">
          <nav className="userinfo-nav">
            <Link to='/' className="userinfo-company-name">GeekFood Threat Feeds</Link>
            <div className="userinfo-nav-links">
              <Link className="userinfo-link" to='/'>Home</Link>
              <Link className="userinfo-link" to='/upload'>Upload</Link>
              <Link className="userinfo-link" to='/login'>Log Out</Link>
            </div>
          </nav>
        </header>
        <div className="userinfo-data-stream"></div>
        <div className="userinfo-data-stream"></div>
        <div className="userinfo-data-stream"></div>
        <div className="userinfo-data-stream"></div>
        <div className="userinfo-data-stream"></div>
        <main className="userinfo-main">
          <h1 className="userinfo-main-title">User Information</h1>
          <div className="userinfo-card">
            <div className="userinfo-details">
              <p><strong>Email:</strong> {userInfo.email}</p>
              <p><strong>First Name:</strong> {userInfo.firstname}</p>
              <p><strong>Last Name:</strong> {userInfo.lastname}</p>
            </div>
            <div className="userinfo-actions">
              <Link className="userinfo-button" to='/upload'>Back to Upload</Link>
              <Link className="userinfo-button" to='/resetpassword'>Reset Password</Link>
              <button 
                className="userinfo-button userinfo-delete-button" 
                onClick={deleteUser}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </main>
        <footer className="userinfo-footer">
          <p>&copy; 2024 GeekFood Threat Feeds. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default UserInfo;