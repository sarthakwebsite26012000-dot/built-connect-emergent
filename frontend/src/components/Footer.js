import { Link } from 'react-router-dom';
import { Building2, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold">BuildConnect</span>
            </div>
            <p className="text-slate-400 mb-4">One Platform. Every Service.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/services" className="text-slate-400 hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="text-slate-400 hover:text-white transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/services/repair-maintenance" className="text-slate-400 hover:text-white transition-colors">Repair & Maintenance</Link></li>
              <li><Link to="/services/cleaning-housekeeping" className="text-slate-400 hover:text-white transition-colors">Cleaning</Link></li>
              <li><Link to="/services/painting-renovation" className="text-slate-400 hover:text-white transition-colors">Painting</Link></li>
              <li><Link to="/services/office-services" className="text-slate-400 hover:text-white transition-colors">Office Services</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-slate-400">
              <li>Email: support@buildconnect.com</li>
              <li>Phone: 1800-123-4567</li>
              <li>Bangalore, Karnataka</li>
              <li>India - 560001</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
          <p>&copy; 2024 BuildConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
