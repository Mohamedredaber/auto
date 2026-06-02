import React from 'react';
import { 
  FacebookIcon, 
  InstagramIcon, 
  TwitterIcon, 
  MailIcon, 
  PhoneIcon, 
  MapPinIcon 
} from './icon'; 
import './footer.css'; 
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">

        {/* Section Marque & Social */}
        <div className="footer-brand">
          <div className="logo">
            <span className="logo-text">AutoConnect</span>
          </div>
          <p className="brand-description">
            Premium car rental services in Morocco. Connecting you with the best agencies for your journey.
          </p>
          <div className="social-links">
            <FacebookIcon width={20} stroke="var(--color-text-secondary)" className="social-icon" />
            <InstagramIcon width={20} stroke="var(--color-text-secondary)" className="social-icon" />
            <TwitterIcon width={20} stroke="var(--color-text-secondary)" className="social-icon" />
          </div>
        </div>

        {/* Liens Rapides */}
        <div className="footer-links-group">
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/cars">Cars</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/register-agency">Register Agency</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Support</h4>
            <ul>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/rental">Rental Agreement</Link></li>
            </ul>
          </div>
        </div>

        {/* Section Contact */}
        <div className="footer-column">
          <h4>Contact</h4>
          <ul className="contact-list">
            <li>
              <MapPinIcon width={18} stroke="var(--color-red-500)" /> 
              <span>Casablanca, Morocco</span>
            </li>
            <li>
              <PhoneIcon width={18} stroke="var(--color-red-500)" /> 
              <span>+212 600 00 00 00</span>
            </li>
            <li>
              <MailIcon width={18} stroke="var(--color-red-500)" /> 
              <span>support@autoconnect.ma</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 AutoConnect. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;