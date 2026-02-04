import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import AnimatedLogo from '../common/AnimatedLogo';
import './Navbar.css';

const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/events', label: 'Events' },
    { path: '/wings', label: 'Wings' },
    { path: '/symposium', label: 'Symposium 2026', highlight: true },
    { path: '/team', label: 'Team' },
    { path: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    return (
        <header className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-container container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <img src="/images/LOGO.png" alt="AETHER" className="navbar-logo-img" />
                    <span className="logo-text">AETHER</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="navbar-nav">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `nav-link ${isActive ? 'nav-link-active' : ''} ${link.highlight ? 'nav-link-highlight' : ''}`
                            }
                        >
                            {link.highlight && <Sparkles size={14} className="nav-highlight-icon" />}
                            {link.label}
                            {link.highlight && <span className="nav-highlight-dot" />}
                        </NavLink>
                    ))}
                </nav>

                {/* Register CTA */}
                <div className="navbar-actions">
                    <Link to="/events" className="btn btn-primary">
                        Register Now
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="navbar-toggle"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            <div className={`navbar-mobile ${isOpen ? 'navbar-mobile-open' : ''}`}>
                <nav className="navbar-mobile-nav">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''} ${link.highlight ? 'mobile-nav-link-highlight' : ''}`
                            }
                        >
                            {link.highlight && <Sparkles size={14} />}
                            {link.label}
                        </NavLink>
                    ))}
                    <Link to="/events" className="btn btn-primary mobile-register-btn">
                        Register Now
                    </Link>
                </nav>
            </div>
        </header>
    );
}
