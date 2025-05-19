import React from "react";

import logo from "../../images/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTelegram,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import "../../css/footer.css";

function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <aside className="footer-brand">
            <a href="#">
              <div>
                <img
                  src="/images/LogoWhite.png"
                  className="footer-logo"
                  alt="Carats & Crowns Logo"
                />
              </div>
            </a>
            <p className="brand-text">
              Carats & Crowns
              <br />
              Shaping Spaces, Inspiring Lives.
            </p>
          </aside>

          <nav>
            <h6 className="footer-heading">Services</h6>
            <a className="footer-link" href="#">
              Branding
            </a>
            <a className="footer-link" href="#">
              Design
            </a>
            <a className="footer-link" href="#">
              Marketing
            </a>
            <a className="footer-link" href="#">
              Advertisement
            </a>
          </nav>

          <nav>
            <h6 className="footer-heading">Company</h6>
            <a className="footer-link" href="#">
              About us
            </a>
            <a className="footer-link" href="#">
              Contact
            </a>
            <a className="footer-link" href="#">
              Jobs
            </a>
            <a className="footer-link" href="#">
              Press kit
            </a>
          </nav>

          <nav>
            <h6 className="footer-heading">Legal</h6>
            <a className="footer-link" href="#">
              Terms of use
            </a>
            <a className="footer-link" href="#">
              Privacy policy
            </a>
            <a className="footer-link" href="#">
              Cookie policy
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}

export default Footer;
