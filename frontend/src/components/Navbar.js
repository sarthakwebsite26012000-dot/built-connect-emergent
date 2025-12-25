import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/App';
import { Button } from '@/components/ui/button';
import { Building2, Menu, X, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" data-testid="navbar-logo">
            <Building2 className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold">BuildConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/services" className="text-slate-700 hover:text-blue-600 font-medium transition-colors" data-testid="nav-services">
              Services
            </Link>
            <Link to="/how-it-works" className="text-slate-700 hover:text-blue-600 font-medium transition-colors" data-testid="nav-how-it-works">
              How It Works
            </Link>
            <Link to="/pricing" className="text-slate-700 hover:text-blue-600 font-medium transition-colors" data-testid="nav-pricing">
              Pricing
            </Link>
            <Link to="/partner" className="text-slate-700 hover:text-blue-600 font-medium transition-colors" data-testid="nav-partner">
              Become a Partner
            </Link>
            <Link to="/contact" className="text-slate-700 hover:text-blue-600 font-medium transition-colors" data-testid="nav-contact">
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Button 
                  asChild 
                  variant="ghost" 
                  className="gap-2"
                  data-testid="nav-dashboard-btn"
                >
                  <Link to="/dashboard">
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="gap-2"
                  data-testid="nav-logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" data-testid="nav-login-btn">
                  <Link to="/auth">Login</Link>
                </Button>
                <Button asChild className="bg-blue-600 hover:bg-blue-700" data-testid="nav-signup-btn">
                  <Link to="/auth">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
            data-testid="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col gap-4">
              <Link to="/services" className="text-slate-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                Services
              </Link>
              <Link to="/how-it-works" className="text-slate-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </Link>
              <Link to="/pricing" className="text-slate-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </Link>
              <Link to="/partner" className="text-slate-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                Become a Partner
              </Link>
              <Link to="/contact" className="text-slate-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
              <div className="pt-4 border-t border-slate-200">
                {user ? (
                  <>
                    <Button asChild variant="outline" className="w-full mb-2">
                      <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} variant="outline" className="w-full">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>Login / Sign Up</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
