import React from 'react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-screen-xl mx-auto flex gap-5 justify-between">
      
        <div className="footer-column ml-3">
          <h3 className="text-lg font-bold mb-4">About Us</h3>
          <ul className="space-y-2">
            <li>About Saffari</li>
            <li>Our Mission</li>
            <li>Our Team</li>
            <li>Careers</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="text-lg font-bold mb-4">Customer Service</h3>
          <ul className="space-y-2">
            <li>Contact Us</li>
            <li>Shipping Information</li>
            <li>Returns & Exchanges</li>
            <li>FAQs</li>
          </ul>
        </div>
      
        <div className="footer-column mr-10">
          <h3 className="text-lg font-bold mb-4">Follow Us</h3>
          <ul className="space-y-2 flex items-center">
            <li>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-2xl mr-4" />
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="text-2xl mr-4 mb-2.5" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
