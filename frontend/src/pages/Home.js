import { Link } from 'react-router-dom';
import { Wrench, Sparkles, PaintBucket, Shield, Home as HomeIcon, Briefcase, Truck, ArrowRight, Star, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Home = () => {
  const categories = [
    { name: 'Repair & Maintenance', slug: 'repair-maintenance', icon: Wrench, color: 'bg-blue-50 text-blue-600' },
    { name: 'Cleaning & Housekeeping', slug: 'cleaning-housekeeping', icon: Sparkles, color: 'bg-teal-50 text-teal-600' },
    { name: 'Painting & Renovation', slug: 'painting-renovation', icon: PaintBucket, color: 'bg-amber-50 text-amber-600' },
    { name: 'Security & Safety', slug: 'security-safety', icon: Shield, color: 'bg-red-50 text-red-600' },
    { name: 'Personal & Domestic', slug: 'personal-domestic', icon: HomeIcon, color: 'bg-purple-50 text-purple-600' },
    { name: 'Office Services', slug: 'office-services', icon: Briefcase, color: 'bg-indigo-50 text-indigo-600' },
    { name: 'Moving & Logistics', slug: 'moving-logistics', icon: Truck, color: 'bg-green-50 text-green-600' },
  ];

  const features = [
    { title: 'Verified Professionals', description: 'All service providers are background verified and trained', icon: CheckCircle2 },
    { title: 'Transparent Pricing', description: 'Know exact costs upfront with no hidden charges', icon: CheckCircle2 },
    { title: 'Quality Guarantee', description: '100% satisfaction guaranteed or we make it right', icon: CheckCircle2 },
    { title: 'Easy Booking', description: 'Book services in minutes with flexible scheduling', icon: CheckCircle2 },
  ];

  const testimonials = [
    { name: 'Priya Sharma', role: 'Homeowner', rating: 5, comment: 'Excellent service! The plumber arrived on time and fixed everything perfectly.' },
    { name: 'Rajesh Kumar', role: 'Business Owner', rating: 5, comment: 'We use BuildConnect for all our office maintenance. Highly reliable!' },
    { name: 'Anjali Patel', role: 'Resident', rating: 5, comment: 'The cleaning service was outstanding. My home has never looked better!' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient pt-24 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7 space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight" data-testid="hero-title">
                  One Platform.
                  <br />
                  <span className="text-blue-600">Every Service.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl">
                  Book trusted home and office services in minutes. From repairs to cleaning, we've got you covered.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-8 text-base"
                  data-testid="book-service-btn"
                >
                  <Link to="/services">Book a Service</Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="h-14 px-8 text-base border-2"
                  data-testid="become-partner-btn"
                >
                  <Link to="/partner">Become a Partner</Link>
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-slate-900">50K+</div>
                  <div className="text-sm text-slate-600">Happy Customers</div>
                </div>
                <div className="h-12 w-px bg-slate-300"></div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">2000+</div>
                  <div className="text-sm text-slate-600">Service Professionals</div>
                </div>
                <div className="h-12 w-px bg-slate-300"></div>
                <div>
                  <div className="flex items-center gap-1 text-3xl font-bold text-slate-900">
                    <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
                    4.8
                  </div>
                  <div className="text-sm text-slate-600">Average Rating</div>
                </div>
              </div>
            </div>
            <div className="md:col-span-5">
              <img 
                src="https://images.unsplash.com/photo-1758548157747-285c7012db5b" 
                alt="Modern home interior" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="services-section-title">Our Services</h2>
            <p className="text-lg text-slate-600">Choose from a wide range of professional services</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.slug}
                  to={`/services/${category.slug}`}
                  className="service-card p-8 bg-white rounded-xl border border-slate-200 hover:border-blue-300 group"
                  data-testid={`category-${category.slug}`}
                >
                  <div className={`w-14 h-14 rounded-lg ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    Explore <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-slate-600">Get your service done in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
              <h3 className="text-xl font-semibold mb-3">Choose Service</h3>
              <p className="text-slate-600">Select from our wide range of professional services</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
              <h3 className="text-xl font-semibold mb-3">Pick Date & Time</h3>
              <p className="text-slate-600">Schedule at your convenience with flexible slots</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
              <h3 className="text-xl font-semibold mb-3">Get It Done</h3>
              <p className="text-slate-600">Verified professional arrives and completes the job</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="text-center">
                  <Icon className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-lg text-slate-600">Trusted by thousands of happy customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-4">"{testimonial.comment}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">Book your service now and experience the difference</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="h-14 px-8 text-base" data-testid="cta-book-now">
              <Link to="/services">Book Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600">
              <Link to="/partner">Join as Professional</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
