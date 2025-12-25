import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/App';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Star, Clock, Shield, CheckCircle2 } from 'lucide-react';

const ServiceDetails = () => {
  const { serviceName } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const decodedServiceName = decodeURIComponent(serviceName);

  const handleBookNow = () => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate(`/book/${serviceName}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="service-detail-title">{decodedServiceName}</h1>
            <div className="flex items-center gap-6 text-slate-600">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="font-semibold">4.8</span>
                <span>(2,340 reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>30-60 mins</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="mb-12">
            <img 
              src="https://images.unsplash.com/photo-1635221798248-8a3452ad07cd" 
              alt={decodedServiceName}
              className="w-full h-96 object-cover rounded-2xl"
            />
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Service Description</h2>
                <p className="text-slate-600 leading-relaxed">
                  Our professional {decodedServiceName.toLowerCase()} service provides expert solutions for all your needs. 
                  We have verified and trained professionals who ensure quality work with complete satisfaction guarantee.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">What's Included</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                    <span className="text-slate-600">Professional inspection and assessment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                    <span className="text-slate-600">Quality materials and tools included</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                    <span className="text-slate-600">Complete cleanup after service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                    <span className="text-slate-600">30-day service warranty</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Why Choose Us</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <Shield className="w-8 h-8 text-blue-600 mb-2" />
                    <h3 className="font-semibold mb-1">Verified Professionals</h3>
                    <p className="text-sm text-slate-600">Background checked and trained experts</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <CheckCircle2 className="w-8 h-8 text-teal-600 mb-2" />
                    <h3 className="font-semibold mb-1">Quality Guarantee</h3>
                    <p className="text-sm text-slate-600">100% satisfaction or money back</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 sticky top-24">
                <div className="mb-6">
                  <div className="text-sm text-slate-600 mb-2">Starting from</div>
                  <div className="text-4xl font-bold text-slate-900">₹499</div>
                  <div className="text-sm text-slate-600">Price may vary based on requirements</div>
                </div>
                <Button 
                  onClick={handleBookNow}
                  className="w-full h-14 text-base bg-blue-600 hover:bg-blue-700"
                  data-testid="book-service-detail-btn"
                >
                  Book Now
                </Button>
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      <span>Same day booking available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      <span>Flexible rescheduling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      <span>Pay after service</span>
                    </div>
                  </div>
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

export default ServiceDetails;
