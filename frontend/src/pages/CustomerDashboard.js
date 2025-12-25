import { useState, useEffect, useContext } from 'react';
import { AuthContext, API } from '@/App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, IndianRupee } from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      in_progress: 'status-confirmed',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
    };
    return colors[status] || 'status-pending';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" data-testid="customer-dashboard-title">My Dashboard</h1>
            <p className="text-slate-600">Welcome back, {user?.full_name}!</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="stat-card">
              <div className="text-3xl font-bold text-blue-600">{bookings.length}</div>
              <div className="text-slate-600 mt-1">Total Bookings</div>
            </div>
            <div className="stat-card">
              <div className="text-3xl font-bold text-teal-600">
                {bookings.filter(b => b.status === 'completed').length}
              </div>
              <div className="text-slate-600 mt-1">Completed</div>
            </div>
            <div className="stat-card">
              <div className="text-3xl font-bold text-amber-600">
                {bookings.filter(b => ['pending', 'confirmed', 'in_progress'].includes(b.status)).length}
              </div>
              <div className="text-slate-600 mt-1">Active</div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">My Bookings</h2>
              <Button 
                onClick={() => navigate('/services')}
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="book-new-service-btn"
              >
                Book New Service
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-600 mb-4">No bookings yet</p>
                <Button onClick={() => navigate('/services')} className="bg-blue-600 hover:bg-blue-700">
                  Book Your First Service
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="booking-card" data-testid={`booking-${booking.id}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{booking.service_name}</h3>
                          <span className={`status-badge ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(booking.booking_date).toLocaleDateString('en-IN')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{booking.time_slot}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="line-clamp-1">{booking.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 text-2xl font-bold text-slate-900">
                          <IndianRupee className="w-5 h-5" />
                          {booking.final_price || booking.estimated_price}
                        </div>
                        <div className="text-sm text-slate-500">{booking.payment_status}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
