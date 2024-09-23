import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet-async';
import { UserContext } from '../UserContext';
import './Upload.css';

function Upload() {
    const [allFiles, setAllFiles] = useState([]);
    const [filteredFiles, setFilteredFiles] = useState([]);
    const { userInfo } = useContext(UserContext);
    const [fileFilterText, setFileFilterText] = useState('');
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewError, setViewError] = useState(null);

    const deleteFile = async (filename) => {
        if (!filename || !window.confirm(`Are you sure you want to delete ${filename}?`)) {
            return;
        }

        try {
            const response = await axios.get('https://q5w6nj6tk7.execute-api.us-east-2.amazonaws.com/prod/getDeleteURL', {
                params: {
                    action: 'delete',
                    foldername: userInfo.email,
                    filename: filename
                }
            });

            await axios.delete(response.data.signedUrl);
            alert('File deleted successfully!');
            listAllFiles();
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('There was an error deleting the file.');
        }
    };

    const downloadFile = async (filename) => {
        try {
            const presignedUrlResponse = await axios.get('https://q5w6nj6tk7.execute-api.us-east-2.amazonaws.com/prod/getListOfFiles', {
                params: {
                    action: 'get',
                    foldername: userInfo.email,
                    filename: filename
                }
            });
    
            const fileResponse = await axios.get(presignedUrlResponse.data.signedUrl, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([fileResponse.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = DOMPurify.sanitize(filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
    
            alert('File downloaded successfully!');
        } catch (error) {
            console.error("Error downloading the file: ", error);
            alert('There was an error downloading the file.');
        }
    };

    const listAllFiles = useCallback(async () => {
        try {
            const response = await axios.get('https://q5w6nj6tk7.execute-api.us-east-2.amazonaws.com/prod/listAllFiles', {
                params: { foldername: userInfo.email }
            });
        
            setAllFiles(response.data.files);
            setFilteredFiles(response.data.files);
        } catch (error) {
            console.error("Error fetching the file list:", error);
            alert('There was an error fetching the file list.');
        }
    }, [userInfo.email]);

    const viewFile = async (filename) => {
        setViewError(null);
        setSelectedArticle(null);
        setIsViewModalOpen(true);
        
        try {
            const presignedUrlResponse = await axios.get('https://q5w6nj6tk7.execute-api.us-east-2.amazonaws.com/prod/getListOfFiles', {
                params: {
                    action: 'get',
                    foldername: userInfo.email,
                    filename: filename
                }
            });
    
            const fileResponse = await axios.get(presignedUrlResponse.data.signedUrl);
            
            if (typeof fileResponse.data === 'object' && fileResponse.data !== null) {
                setSelectedArticle(fileResponse.data);
            } else {
                throw new Error('Invalid file format');
            }
        } catch (error) {
            console.error("Error viewing the file: ", error);
            setViewError('There was an error viewing the file. It may not exist or be in an unexpected format.');
        }
    };

    useEffect(() => {
        listAllFiles();
    }, [listAllFiles]);

    useEffect(() => {
        const filtered = allFiles.filter(file => 
            file.toLowerCase().includes(fileFilterText.toLowerCase())
        );
        setFilteredFiles(filtered);
    }, [fileFilterText, allFiles]);

    return (
        <>
            <Helmet>
                <title>GeekFood TF | Custom TF</title>
            </Helmet>
            <div className="upload-container">
                <div className="upload-cyber-background"></div>
                <header className="upload-header">
                    <nav className="upload-nav">
                        <Link to='/' className="nav-logo">GeekFood Threat Feed</Link>
                        <div className="nav-links">
                            <Link className="nav-link" to='/userinfo'>User Info</Link>
                            <Link className="nav-link" to='/'>Home</Link>
                            <Link className="nav-link" to='/feedly'>Feedly Feeds</Link>
                            <Link className="nav-link" to='/alienvault'>AlienVault OTX Feeds</Link>
                            <Link className="nav-link" to='/nist'>Misp Feeds</Link>
                            <Link className="nav-link" to='/login'>Log Out</Link>
                        </div>
                    </nav>
                </header>
                <main className="upload-main">
                    <h1 className="main-title">Your Custom Threat Feed</h1>
                    <div className="content-container">
                        <div className="files-section">
                            <div className="files-header">
                                <h2 className="section-title">Your Threat Files</h2>
                                <button onClick={listAllFiles} className="refresh-button">Refresh</button>
                            </div>
                            <div className="search-container">
                                <input 
                                    type="text" 
                                    placeholder="Filter files..." 
                                    value={fileFilterText} 
                                    onChange={(e) => setFileFilterText(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                            {fileFilterText && (
                                <div className="filter-display">
                                    Filtering files by: {fileFilterText}
                                </div>
                            )}
                            <ul className="file-list">
                                {filteredFiles.map((file, index) => (
                                    <li key={index} className="file-item">
                                        <span>{DOMPurify.sanitize(file)}</span>
                                        <div className="file-actions">
                                            <button onClick={() => viewFile(file)} className="action-button view-button">
                                                View
                                            </button>
                                            <button onClick={() => downloadFile(file)} className="action-button download-button">
                                                Download
                                            </button>
                                            <button onClick={() => deleteFile(file)} className="action-button delete-button">
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </main>
                <footer className="upload-footer">
                    <p>&copy; 2024 GeekFood Threat Feeds. All rights reserved.</p>
                </footer>
            </div>

            {isViewModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        {viewError ? (
                            <div className="error-message">{viewError}</div>
                        ) : selectedArticle ? (
                            <>
                                <h2>{selectedArticle.title}</h2>
                                <p>Published: {new Date(selectedArticle.publishedDate).toLocaleString()}</p>
                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedArticle.content) }} />
                                {selectedArticle.link && (
                                    <a href={selectedArticle.link} target="_blank" rel="noopener noreferrer">
                                        Original Article
                                    </a>
                                )}
                            </>
                        ) : (
                            <div>Loading...</div>
                        )}
                        <button onClick={() => setIsViewModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Upload;