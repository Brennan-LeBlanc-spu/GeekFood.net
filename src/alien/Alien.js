import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet-async';
import './Alien.css';

function AlienVault() {
    const [threatFeeds, setThreatFeeds] = useState([]);
    const [filteredThreatFeeds, setFilteredThreatFeeds] = useState([]);
    const [threatFilterText, setThreatFilterText] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchThreatFeeds = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://otx.alienvault.com/api/v1/indicators/export', {
                headers: {
                    'X-OTX-API-KEY': process.env.REACT_APP_OTX_API_KEY || '230c95f5fea463c992d2580e80b15d7652a6daaaa3668dd52d313936e3464a9c',
                    'Content-Type': 'application/json'
                }
            });

            const newFeeds = response.data.results.map((feed, index) => ({
                id: index + 1,
                title: DOMPurify.sanitize(feed.type),
                indicator: DOMPurify.sanitize(feed.indicator),
                created: feed.created,
                // Add more fields as needed
            }));

            setThreatFeeds(newFeeds);
            setFilteredThreatFeeds(newFeeds);
        } catch (error) {
            console.error('Error fetching AlienVault OTX feeds:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchThreatFeeds();
    }, [fetchThreatFeeds]);

    useEffect(() => {
        const filtered = threatFeeds.filter(feed => 
            feed.title.toLowerCase().includes(threatFilterText.toLowerCase()) ||
            feed.indicator.toLowerCase().includes(threatFilterText.toLowerCase())
        );
        setFilteredThreatFeeds(filtered);
    }, [threatFilterText, threatFeeds]);

    const openAlienVaultLink = (feed) => {
        const url = `https://otx.alienvault.com/indicator/${feed.title}/${feed.indicator}`;
        window.open(url, '_blank');
    };

    return (
        <>
            <Helmet>
                <title>GeekFood TF | AlienVault OTX Feeds</title>
            </Helmet>
            <div className="alienvault-container">
                <div className="alienvault-cyber-background"></div>
                <header className="alienvault-header">
                    <nav className="alienvault-nav">
                        <Link to='/' className="nav-logo">GeekFood Threat Feed</Link>
                        <div className="nav-links">
                            <Link className="nav-link" to='/upload'>Back to Upload</Link>
                            <Link className="nav-link" to='/userinfo'>User Info</Link>
                            <Link className="nav-link" to='/'>Home</Link>
                            <Link className="nav-link" to='/login'>Log Out</Link>
                        </div>
                    </nav>
                </header>
                <main className="alienvault-main">
                    <h1 className="main-title">AlienVault OTX Threat Feeds</h1>
                    <div className="alienvault-feeds-section">
                        <div className="search-container">
                            <input 
                                type="text" 
                                placeholder="Filter AlienVault OTX feeds..." 
                                value={threatFilterText} 
                                onChange={(e) => setThreatFilterText(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        {threatFilterText && (
                            <div className="filter-display">
                                Filtering AlienVault OTX feeds by: {threatFilterText}
                            </div>
                        )}
                        {loading ? (
                            <div className="loading">Loading AlienVault OTX feeds...</div>
                        ) : (
                            <ul className="alienvault-feed-list">
                                {filteredThreatFeeds.map((feed) => (
                                    <li key={feed.id} className="alienvault-feed-item">
                                        <h3 className="alienvault-feed-title">{feed.title}</h3>
                                        <p className="alienvault-feed-indicator">{feed.indicator}</p>
                                        <div className="alienvault-feed-details">
                                            <span>Created: {new Date(feed.created).toLocaleString()}</span>
                                            <button 
                                                onClick={() => openAlienVaultLink(feed)} 
                                                className="view-button"
                                            >
                                                View in AlienVault
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </main>
                <footer className="alienvault-footer">
                    <p>&copy; 2024 GeekFood Threat Feeds. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}

export default AlienVault;