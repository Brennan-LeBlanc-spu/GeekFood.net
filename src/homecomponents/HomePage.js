import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './HomePage.css';

const HomePage = () => {
    return (
        <>
            <Helmet>
                <title>GeekFood TF | Home</title>
            </Helmet>
            <div className="homepage-container">
                <div className="homepage-cyber-background"></div>
                <header className="homepage-header">
                    <nav className="homepage-nav">
                        <Link to='/' className="homepage-company-name">GeekFood Threat Feeds</Link>
                        <div className="homepage-nav-links">
                            <Link className="homepage-about-link" to='/about'>About</Link>
                            <Link className="homepage-login-link" to='/login'>Log In</Link>
                            <Link className="homepage-signup-link" to='/signup'>Sign Up Free</Link>
                        </div>
                    </nav>
                </header>
                <div className="homepage-data-stream"></div>
                <div className="homepage-data-stream"></div>
                <div className="homepage-data-stream"></div>
                <div className="homepage-data-stream"></div>
                <div className="homepage-data-stream"></div>
                <div className="homepage-data-stream"></div>
                <main className="homepage-main">
                    <h1 className="homepage-main-title">Welcome to GeekFood Threat Feeds</h1>
                    <p className="homepage-main-description">Stay ahead of cyber threats with our curated threat intelligence feeds.</p>
                    
                    <div className="homepage-feed-sources">
                        <div className="homepage-feed-box">
                            <h2>AlienVault OTX</h2>
                            <p>AlienVault Open Threat Exchange (OTX) is a global threat intelligence community that enables collaborative defense with actionable, community-powered threat data.</p>
                            <ul>
                                <li>Access to millions of threat indicators</li>
                                <li>Real-time threat intelligence</li>
                                <li>Integration with security tools</li>
                            </ul>
                        </div>

                        <div className="homepage-feed-box">
                            <h2>Feedly</h2>
                            <p>Feedly is an advanced feed reader that provides curated cybersecurity news and threat intelligence from various sources.</p>
                            <ul>
                                <li>Customizable security feeds</li>
                                <li>AI-powered content curation</li>
                                <li>Integration with team collaboration tools</li>
                            </ul>
                        </div>

                        <div className="homepage-feed-box coming-soon">
                            <h2>MISP (Coming Soon)</h2>
                            <p>MISP (Malware Information Sharing Platform) is an open-source threat intelligence platform for sharing, storing, and correlating Indicators of Compromise of targeted attacks, threat intelligence, financial fraud information, vulnerability information, or even counter-terrorism information.</p>
                            <ul>
                                <li>Automated information sharing</li>
                                <li>Flexible data models</li>
                                <li>Built-in collaboration tools</li>
                            </ul>
                        </div>
                    </div>
                </main>
                <footer className="homepage-footer">
                    <p>&copy; 2024 GeekFood Threat Feeds. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}

export default HomePage;