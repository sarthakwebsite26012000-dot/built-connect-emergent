import { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext, API } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock } from 'lucide-react';

const BookService = () => {
  const { serviceName } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const decodedServiceName = decodeURIComponent(serviceName);

  const [formData, setFormData] = useState({
    booking_date: '',
    time_slot: '',
    location: '',
    pincode: '',
    description: '',
    pricing_type: 'fixed',
  });
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM',
    '6:00 PM - 8:00 PM',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const bookingData = {
        ...formData,
        service_name: decodedServiceName,
        service_category: 'General',
        estimated_price: 499,
      };

      const response = await axios.post(`${API}/bookings`, bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Booking created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2" data-testid="book-service-title">Book {decodedServiceName}</h1>
              <p className="text-slate-600">Fill in the details to schedule your service</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date */}
              <div>
                <Label htmlFor="booking_date" className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  Preferred Date
                </Label>
                <Input
                  id="booking_date"
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.booking_date}
                  onChange={(e) => setFormData({...formData, booking_date: e.target.value})}
                  className="h-12"
                  data-testid="booking-date-input"
                />
              </div>

              {/* Time Slot */}
              <div>
                <Label htmlFor="time_slot" className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" />
                  Time Slot
                </Label>
                <Select 
                  required
                  value={formData.time_slot} 
                  onValueChange={(value) => setFormData({...formData, time_slot: value})}
                >
                  <SelectTrigger className="h-12" data-testid="time-slot-select">
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location" className="mb-2 block">Service Location</Label>
                <Textarea
                  id="location"
                  required
                  placeholder="Enter your complete address"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="min-h-24"
                  data-testid="location-input"
                />
              </div>

              {/* Pincode */}
              <div>
                <Label htmlFor="pincode" className="mb-2 block">Pincode</Label>
                <Input
                  id="pincode"
                  type="text"
                  required
                  placeholder="Enter 6-digit pincode"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                  className="h-12"
                  data-testid="pincode-input"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="mb-2 block">Service Description</Label>
                <Textarea
                  id="description"
                  required
                  placeholder="Describe your requirements in detail"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="min-h-32"
                  data-testid="description-input"
                />
              </div>

              {/* Pricing Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Estimated Price:</span>
                  <span className="text-2xl font-bold text-blue-600">₹499</span>
                </div>
                <p className="text-sm text-slate-600">Final price will be confirmed after inspection</p>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1 h-12"
                >Cancel</Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
                  data-testid="confirm-booking-btn"
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookService;
