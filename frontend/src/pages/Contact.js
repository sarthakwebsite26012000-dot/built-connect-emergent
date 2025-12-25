import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Thank you! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="contact-page-title">Contact Us</h1>
            <p className="text-lg text-slate-600">Have questions? We're here to help!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-12 mt-2"
                    data-testid="contact-name-input"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="h-12 mt-2"
                    data-testid="contact-email-input"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="h-12 mt-2"
                    data-testid="contact-phone-input"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    required
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="min-h-32 mt-2"
                    data-testid="contact-message-input"
                  />
                </div>
                <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700" data-testid="contact-submit-btn">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Email</div>
                      <div className="text-slate-600">support@buildconnect.com</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Phone</div>
                      <div className="text-slate-600">1800-123-4567 (Toll Free)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Address</div>
                      <div className="text-slate-600">
                        BuildConnect Headquarters<br />
                        Bangalore, Karnataka 560001<br />
                        India
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-100 rounded-xl p-6">
                <h3 className="font-semibold mb-2">Business Hours</h3>
                <div className="text-sm text-slate-600 space-y-1">
                  <div>Monday - Saturday: 9:00 AM - 8:00 PM</div>
                  <div>Sunday: 10:00 AM - 6:00 PM</div>
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

export default Contact;
