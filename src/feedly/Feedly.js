import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { UserContext } from '../UserContext';
import './Feedly.css';

function Feedly() {
    const [feedlyFeeds, setFeedlyFeeds] = useState([]);
    const [filteredFeedlyFeeds, setFilteredFeedlyFeeds] = useState([]);
    const [feedlyFilterText, setFeedlyFilterText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [continuation, setContinuation] = useState(null);
    const [uploadStatus, setUploadStatus] = useState({});
    const [uploadProgress, setUploadProgress] = useState({});

    const { userInfo } = useContext(UserContext);

    const FEEDLY_API_URL = 'https://cloud.feedly.com/v3/streams/contents';
    const FEEDLY_API_TOKEN = 'fe_Mks5vlQdI1iIJ7Ne8zGIQEMZbpH2N7qFZJshI4Ej';
    const STREAM_ID = 'enterprise/prisidio-lujh/category/e3c17f05-734c-4cfc-a56a-d4262fc14692';
    const S3_UPLOAD_API_URL = 'https://q5w6nj6tk7.execute-api.us-east-2.amazonaws.com/prod/getSignedURL';

    const fetchFeedlyFeeds = useCallback(async (cont = null) => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching Feedly feeds...');
            
            const params = {
                streamId: STREAM_ID,
                count: 20,
                continuation: cont
            };

            console.log('Request parameters:', params);

            const response = await axios.get(FEEDLY_API_URL, {
                headers: {
                    'Authorization': `Bearer ${FEEDLY_API_TOKEN}`
                },
                params: params
            });

            console.log('Feedly API response:', response.data);

            if (!response.data.items || response.data.items.length === 0) {
                throw new Error('No feeds returned from Feedly API');
            }

            const newFeeds = response.data.items.map((item) => ({
                id: item.id,
                title: item.title,
                summary: item.summary?.content || 'No summary available',
                publishedDate: item.published,
                link: item.alternate?.[0]?.href || '#',
                content: item.content?.content || item.summary?.content || 'No content available'
            }));

            setFeedlyFeeds(prevFeeds => cont ? [...prevFeeds, ...newFeeds] : newFeeds);
            setFilteredFeedlyFeeds(prevFeeds => cont ? [...prevFeeds, ...newFeeds] : newFeeds);
            setContinuation(response.data.continuation);
        } catch (error) {
            console.error('Error fetching Feedly feeds:', error);
            setError(`Failed to fetch Feedly feeds: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFeedlyFeeds();
    }, [fetchFeedlyFeeds]);

    useEffect(() => {
        const filtered = feedlyFeeds.filter(feed => 
            feed.title.toLowerCase().includes(feedlyFilterText.toLowerCase()) ||
            feed.summary.toLowerCase().includes(feedlyFilterText.toLowerCase())
        );
        setFilteredFeedlyFeeds(filtered);
    }, [feedlyFilterText, feedlyFeeds]);

    const loadMore = () => {
        if (continuation) {
            fetchFeedlyFeeds(continuation);
        }
    };

    const uploadToS3 = async (article) => {
        setUploadStatus(prev => ({ ...prev, [article.id]: 'uploading' }));
        setUploadProgress(prev => ({ ...prev, [article.id]: 0 }));
        try {
            // GET request to obtain a signed URL
            const response = await axios.get(S3_UPLOAD_API_URL, {
                params: {
                    action: 'put',
                    foldername: userInfo.email,
                    filename: `${article.id}.json`
                }
            });

            // Stores the signed URL from the GET method
            const signedUrl = response.data.signedUrl;

            // Prepare the article data
            const articleData = JSON.stringify({
                title: article.title,
                content: article.content,
                publishedDate: article.publishedDate,
                link: article.link
            });

            // PUT method to use the signedURL to PUT the file into the S3 bucket "geekfood.net.logs"
            await axios.put(signedUrl, articleData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                // Displays and changes the percentage bar
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(prev => ({ ...prev, [article.id]: percentCompleted }));
                }
            });

            setUploadStatus(prev => ({ ...prev, [article.id]: 'success' }));
        } catch (error) {
            console.error('Error uploading to S3:', error);
            setUploadStatus(prev => ({ ...prev, [article.id]: 'error' }));
        }
    };

    return (
        <>
            <Helmet>
                <title>GeekFood TF | Feedly Feeds</title>
            </Helmet>
            <div className="feedly-container">
                <div className="feedly-cyber-background"></div>
                <header className="feedly-header">
                    <nav className="feedly-nav">
                        <Link to='/' className="nav-logo">GeekFood Threat Feed</Link>
                        <div className="nav-links">
                            <Link className="nav-link" to='/upload'>Back to Upload</Link>
                            <Link className="nav-link" to='/userinfo'>User Info</Link>
                            <Link className="nav-link" to='/'>Home</Link>
                            <Link className="nav-link" to='/login'>Log Out</Link>
                        </div>
                    </nav>
                </header>
                <main className="feedly-main">
                    <h1 className="main-title">Feedly Feeds</h1>
                    <div className="feedly-feeds-section">
                        <div className="search-container">
                            <input 
                                type="text" 
                                placeholder="Filter Feedly feeds..." 
                                value={feedlyFilterText} 
                                onChange={(e) => setFeedlyFilterText(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        {feedlyFilterText && (
                            <div className="filter-display">
                                Filtering Feedly feeds by: {feedlyFilterText}
                            </div>
                        )}
                        {loading && feedlyFeeds.length === 0 ? (
                            <div className="loading">Loading Feedly feeds...</div>
                        ) : error ? (
                            <div className="error">{error}</div>
                        ) : (
                            <>
                                <ul className="feedly-feed-list">
                                    {filteredFeedlyFeeds.map((feed) => (
                                        <li key={feed.id} className="feedly-feed-item">
                                            <h3 className="feedly-feed-title">
                                                <a href={feed.link} target="_blank" rel="noopener noreferrer">
                                                    {feed.title}
                                                </a>
                                            </h3>
                                            <p className="feedly-feed-summary">{feed.summary}</p>
                                            <div className="feedly-feed-date">
                                                <span>Published: {new Date(feed.publishedDate).toLocaleString()}</span>
                                            </div>
                                            <div className="feedly-feed-actions">
                                                <button 
                                                    className="view-article-button"
                                                    onClick={() => window.open(feed.link, '_blank', 'noopener,noreferrer')}
                                                >
                                                    View Full Article
                                                </button>
                                                <button 
                                                    className={`save-to-s3-button ${uploadStatus[feed.id] || ''}`}
                                                    onClick={() => uploadToS3(feed)}
                                                    disabled={uploadStatus[feed.id] === 'uploading' || uploadStatus[feed.id] === 'success'}
                                                >
                                                    {uploadStatus[feed.id] === 'uploading' ? 'Uploading...' :
                                                     uploadStatus[feed.id] === 'success' ? 'Saved' :
                                                     uploadStatus[feed.id] === 'error' ? 'Retry Upload' : 'Save to S3'}
                                                </button>
                                            </div>
                                            {uploadStatus[feed.id] === 'uploading' && (
                                                <div className="upload-progress-bar">
                                                    <div 
                                                        className="upload-progress" 
                                                        style={{width: `${uploadProgress[feed.id]}%`}}
                                                    ></div>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                                {continuation && (
                                    <button onClick={loadMore} className="load-more-button" disabled={loading}>
                                        {loading ? 'Loading...' : 'Load More'}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </main>
                <footer className="feedly-footer">
                    <p>&copy; 2024 GeekFood Threat Feeds. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}

export default Feedly;