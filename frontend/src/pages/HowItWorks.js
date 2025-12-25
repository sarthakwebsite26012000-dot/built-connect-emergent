import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: 'Browse Services',
      description: 'Choose from our wide range of professional services across multiple categories',
    },
    {
      number: 2,
      title: 'Select Date & Time',
      description: 'Pick a convenient date and time slot that works for your schedule',
    },
    {
      number: 3,
      title: 'Book & Confirm',
      description: 'Provide your location and service details to complete the booking',
    },
    {
      number: 4,
      title: 'Professional Arrives',
      description: 'Our verified professional arrives at your location on time',
    },
    {
      number: 5,
      title: 'Service Completed',
      description: 'The service is completed to your satisfaction with quality guarantee',
    },
    {
      number: 6,
      title: 'Pay & Review',
      description: 'Make payment and leave a review to help others',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="how-it-works-title">How It Works</h1>
            <p className="text-lg text-slate-600">Getting your service done is easy with BuildConnect</p>
          </div>

          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-6 items-start">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  {step.number}
                </div>
                <div className="pt-3">
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorks;
