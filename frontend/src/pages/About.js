import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8" data-testid="about-page-title">About BuildConnect</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-slate-600 mb-8">
              BuildConnect is India's leading platform connecting customers with verified service professionals. 
              We make it easy to book trusted home and office services in just a few clicks.
            </p>

            <h2 className="text-3xl font-bold mb-4 mt-12">Our Mission</h2>
            <p className="text-slate-600 mb-6">
              To democratize access to quality services and create employment opportunities for skilled professionals 
              across India. We believe everyone deserves reliable, affordable, and professional services.
            </p>

            <h2 className="text-3xl font-bold mb-4 mt-12">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Verified Professionals</h3>
                  <p className="text-slate-600">All service providers undergo thorough background verification</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Quality Guarantee</h3>
                  <p className="text-slate-600">100% satisfaction guaranteed or we make it right</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Transparent Pricing</h3>
                  <p className="text-slate-600">No hidden charges, know the cost upfront</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
                  <p className="text-slate-600">Our customer support team is always here to help</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
