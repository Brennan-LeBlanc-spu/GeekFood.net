import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './About.css';

const About = () => {
    return (
        <>
            <Helmet>
                <title>GeekFood TF | About</title>
            </Helmet>
            <div className="about-container">
                <div className="about-cyber-background"></div>
                <header className="about-header">
                    <nav className="about-nav">
                        <Link to='/' className="about-company-name">GeekFood Threat Feeds</Link>
                        <div className="about-nav-links">
                            <Link className="about-link active" to='/about'>About</Link>
                            <Link className="login-link" to='/login'>Log In</Link>
                            <Link className="signup-link" to='/signup'>Sign Up Free</Link>
                        </div>
                    </nav>
                </header>
                <div className="homepage-data-stream"></div>
                    <div className="homepage-data-stream"></div>
                    <div className="homepage-data-stream"></div>
                    <div className="homepage-data-stream"></div>
                    <div className="homepage-data-stream"></div>
                    <div className="homepage-data-stream"></div>
                <main className="about-main">
                <div className="homepage-data-stream"></div>
                    <div className="homepage-data-stream"></div>
                    <div className="homepage-data-stream"></div>
                    <div className="homepage-data-stream"></div>
                    <div className="homepage-data-stream"></div>
                    <div className="homepage-data-stream"></div>
                    <h1 className="about-title">About GeekFood Threat Feeds</h1>
                    <div className="about-content">
                        <section className="about-section">
                            <h2>Our Mission</h2>
                            <p>
                                At GeekFood Threat Feeds, we are dedicated to empowering cybersecurity professionals 
                                and software developers with cutting-edge threat intelligence. Our mission is to 
                                make threat feeds easily accessible and digestible, allowing you to stay one step 
                                ahead in the ever-evolving landscape of cyber threats.
                            </p>
                        </section>
                        <section className="about-section">
                            <h2>What We Offer</h2>
                            <p>
                                Our platform provides a comprehensive and customizable threat feed solution:
                            </p>
                            <ul>
                                <li>Real-time threat intelligence from multiple sources</li>
                                <li>Customizable filters to tailor feeds to your specific needs</li>
                                <li>Easy integration with your existing security infrastructure</li>
                                <li>Regular updates to ensure you have the latest threat data</li>
                                <li>User-friendly interface for effortless navigation and analysis</li>
                            </ul>
                        </section>
                        <section className="about-section">
                            <h2>Why Choose Us</h2>
                            <p>
                                GeekFood Threat Feeds stands out in the crowded threat intelligence market:
                            </p>
                            <ul>
                                <li>Curated feeds that reduce noise and focus on actionable intelligence</li>
                                <li>Advanced analytics to help you understand and prioritize threats</li>
                                <li>Dedicated support team to assist you in maximizing the value of our feeds</li>
                                <li>Continuous improvement based on user feedback and emerging threats</li>
                            </ul>
                        </section>
                    </div>
                </main>
                <footer className="about-footer">
                    <p>&copy; 2024 GeekFood Threat Feeds. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}

export default About;