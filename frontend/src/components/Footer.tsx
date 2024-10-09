import React from "react";
import { Twitter, Facebook, Instagram } from "lucide-react";

const SocialLink = ({ href, icon: Icon, label }) => (
  <a
    href={href}
    className="text-gray-400 hover:text-white transition-colors duration-200"
    target="_blank"
    rel="noopener noreferrer"
  >
    <span className="sr-only">{label}</span>
    <Icon className="h-6 w-6" />
  </a>
);

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-gray-400">
              MovieBook is your go-to platform for booking movies and enjoying
              the latest cinema experiences.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <SocialLink
                href="https://twitter.com"
                icon={Twitter}
                label="Twitter"
              />
              <SocialLink
                href="https://facebook.com"
                icon={Facebook}
                label="Facebook"
              />
              <SocialLink
                href="https://instagram.com"
                icon={Instagram}
                label="Instagram"
              />
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} MovieBook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
