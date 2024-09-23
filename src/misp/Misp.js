import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchMispEvents } from './mispService.js';
import './Misp.css';

function Misp() {
    const [mispFeeds, setMispFeeds] = useState([]);
    const [filteredMispFeeds, setFilteredMispFeeds] = useState([]);
    const [mispFilterText, setMispFilterText] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchMispFeeds = useCallback(async () => {
        setLoading(true);
        try {
            const events = await fetchMispEvents();
            const newFeeds = events.response.map((event) => ({
                id: event.Event.id,
                description: event.Event.info,
                publishedDate: event.Event.date,
                lastModifiedDate: event.Event.timestamp,
            }));

            setMispFeeds(newFeeds);
            setFilteredMispFeeds(newFeeds);
        } catch (error) {
            console.error('Error fetching MISP feeds:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMispFeeds();
    }, [fetchMispFeeds]);

    useEffect(() => {
        const filtered = mispFeeds.filter(feed => 
            feed.id.toString().includes(mispFilterText.toLowerCase()) ||
            feed.description.toLowerCase().includes(mispFilterText.toLowerCase())
        );
        setFilteredMispFeeds(filtered);
    }, [mispFilterText, mispFeeds]);

    return (
        <>
            <Helmet>
                <title>GeekFood TF | MISP Feeds</title>
            </Helmet>
            <div className="misp-container">
                <div className="misp-cyber-background"></div>
                <header className="misp-header">
                    <nav className="misp-nav">
                        <Link to='/' className="nav-logo">GeekFood Threat Feed</Link>
                        <div className="nav-links">
                            <Link className="nav-link" to='/upload'>Back to Upload</Link>
                            <Link className="nav-link" to='/userinfo'>User Info</Link>
                            <Link className="nav-link" to='/'>Home</Link>
                            <Link className="nav-link" to='/login'>Log Out</Link>
                        </div>
                    </nav>
                </header>
                <main className="misp-main">
                    <h1 className="main-title">MISP Event Feeds Coming Soon!</h1>
                    <div className="misp-feeds-section">
                        <div className="search-container">
                            <input 
                                type="text" 
                                placeholder="Filter MISP feeds..." 
                                value={mispFilterText} 
                                onChange={(e) => setMispFilterText(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        {mispFilterText && (
                            <div className="filter-display">
                                Filtering MISP feeds by: {mispFilterText}
                            </div>
                        )}
                        {loading ? (
                            <div className="loading">Loading MISP feeds...</div>
                        ) : (
                            <ul className="misp-feed-list">
                                {filteredMispFeeds.map((feed) => (
                                    <li key={feed.id} className="misp-feed-item">
                                        <h3 className="misp-feed-id">Event ID: {feed.id}</h3>
                                        <p className="misp-feed-description">{feed.description}</p>
                                        <div className="misp-feed-dates">
                                            <span>Published: {new Date(feed.publishedDate).toLocaleDateString()}</span>
                                            <span>Last Modified: {new Date(feed.lastModifiedDate * 1000).toLocaleDateString()}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </main>
                <footer className="misp-footer">
                    <p>&copy; 2024 GeekFood Threat Feeds. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}

export default Misp;