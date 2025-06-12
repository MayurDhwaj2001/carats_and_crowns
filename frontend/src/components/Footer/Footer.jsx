import React from "react";
import { Link } from "react-router-dom";

// Remove this line
// import logo from "../../images/logo.svg";

// The rest of your imports remain the same
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faWhatsapp, faInstagram } from "@fortawesome/free-brands-svg-icons";
import "../../css/footer.css";

function Footer() {
  return (
    <footer className="footer pb-0.5">
      <div className="footer-content">
        <aside className="footer-brand">
          <a href="/" className="block mb-4">
            <img
              src="/images/LogoWhite.png"
              className="footer-logo"
              alt="Carats & Crowns Logo"
            />
          </a>
          <p className="brand-text text-lg mb-4">
            Carats & Crowns
            <br />
            Shaping Spaces, Inspiring Lives.
          </p>
          <div className="social-icons flex gap-6">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-[#AC8F6F] transition-colors duration-300"
            >
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-[#AC8F6F] transition-colors duration-300"
            >
              <FontAwesomeIcon icon={faFacebook} size="lg" />
            </a>
            <a 
              href="https://wa.me/your-whatsapp-number" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-[#AC8F6F] transition-colors duration-300"
            >
              <FontAwesomeIcon icon={faWhatsapp} size="lg" />
            </a>
          </div>
        </aside>

        <nav className="footer-nav grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h6 className="footer-heading">Services</h6>
            <div className="flex flex-col gap-3">
              <a className="footer-link" href="#">Branding</a>
              <a className="footer-link" href="#">Design</a>
              <a className="footer-link" href="#">Marketing</a>
              <a className="footer-link" href="#">Advertisement</a>
            </div>
          </div>
          
          <div>
            <h6 className="footer-heading">Legal</h6>
            <div className="flex flex-col gap-3">
              <Link className="footer-link" to="/privacy-policy">Privacy Policy</Link>
              <Link className="footer-link" to="/terms">Terms of Service</Link>
              <Link className="footer-link" to="/cookie-policy">Cookie Policy</Link>
            </div>
          </div>

          <div>
            <h6 className="footer-heading">Contact</h6>
            <div className="flex flex-col gap-3">
              <a className="footer-link" href="tel:+91998765432">+91- 98765 04321</a>
              <a className="footer-link" href="mailto:support@caratandcrown.com">support@caratandcrown.com</a>
            </div>
          </div>
        </nav>
      </div>
      <div className="text-center pt-2 mt-4 border-t border-gray-700">
        <span className="footer-link">Copyright © Carats & Crowns 2025. All Right Reserved</span>
      </div>
    </footer>
  );
}

export default Footer;
