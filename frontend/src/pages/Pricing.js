import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const Pricing = () => {
  const pricingModels = [
    {
      name: 'Fixed Price',
      description: 'Pay a flat rate for standard services',
      features: ['Transparent pricing', 'No surprises', 'Best for routine tasks'],
      example: 'House Cleaning: ₹499',
    },
    {
      name: 'Hourly Rate',
      description: 'Pay based on time spent',
      features: ['Flexible billing', 'Ideal for longer tasks', 'Professional rates'],
      example: 'Carpenter: ₹500/hour',
    },
    {
      name: 'Inspection Based',
      description: 'Price determined after assessment',
      features: ['Accurate estimates', 'No commitment upfront', 'Best for complex work'],
      example: 'AC Repair: Quote after inspection',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="pricing-page-title">Transparent Pricing</h1>
            <p className="text-lg text-slate-600">Choose the pricing model that works best for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {pricingModels.map((model, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <h3 className="text-2xl font-bold mb-3">{model.name}</h3>
                <p className="text-slate-600 mb-6">{model.description}</p>
                <ul className="space-y-3 mb-6">
                  {model.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600 font-semibold">Example:</p>
                  <p className="text-slate-900 font-medium">{model.example}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">No Hidden Charges</h2>
            <p className="text-lg text-slate-600 mb-6">What you see is what you pay. All prices are inclusive of materials and labor.</p>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link to="/services">Browse Services</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
