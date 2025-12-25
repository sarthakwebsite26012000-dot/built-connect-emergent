import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { IndianRupee, Users, TrendingUp, Shield } from 'lucide-react';

const PartnerWithUs = () => {
  const benefits = [
    {
      icon: IndianRupee,
      title: 'Earn More',
      description: 'Get regular bookings and earn a stable income. Set your own rates.',
    },
    {
      icon: Users,
      title: 'Grow Your Business',
      description: 'Reach thousands of customers actively looking for your services.',
    },
    {
      icon: TrendingUp,
      title: 'Flexible Schedule',
      description: 'Work on your own terms. Choose when and where you want to work.',
    },
    {
      icon: Shield,
      title: 'Support & Training',
      description: 'Get platform support and training to improve your skills.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero */}
      <section className="hero-gradient pt-24 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="partner-page-title">
            Become a <span className="text-blue-600">Partner</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Join thousands of professionals earning with BuildConnect. Register today and start receiving bookings.
          </p>
          <Button asChild size="lg" className="h-14 px-8 text-base bg-blue-600 hover:bg-blue-700" data-testid="register-vendor-btn">
            <Link to="/auth">Register as Vendor</Link>
          </Button>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Partner With Us</h2>
            <p className="text-lg text-slate-600">Benefits of joining BuildConnect</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm text-slate-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Join */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How to Join</h2>
            <p className="text-lg text-slate-600">Simple 3-step process to become a partner</p>
          </div>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Register</h3>
                <p className="text-slate-600">Sign up and create your vendor profile with your skills and experience</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Get Verified</h3>
                <p className="text-slate-600">Our team will verify your documents and approve your profile</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Start Earning</h3>
                <p className="text-slate-600">Start receiving bookings and earn money on your terms</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-blue-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start?</h2>
          <p className="text-xl mb-8 text-blue-100">Join BuildConnect today and grow your business</p>
          <Button asChild size="lg" variant="secondary" className="h-14 px-8 text-base">
            <Link to="/auth">Register Now</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PartnerWithUs;
