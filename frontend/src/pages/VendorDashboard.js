import { useState, useEffect, useContext } from 'react';
import { AuthContext, API } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, IndianRupee, Star, CheckCircle2, XCircle } from 'lucide-react';

const VendorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const [profileData, setProfileData] = useState({
    services: [],
    experience_years: 1,
    bio: '',
    availability: {},
    hourly_rate: '',
    fixed_rate: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch categories
      const categoriesRes = await axios.get(`${API}/services/categories`);
      setCategories(categoriesRes.data);
      
      // Try to fetch profile
      try {
        const profileRes = await axios.get(`${API}/vendors/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(profileRes.data);
        
        // Fetch bookings and earnings if profile exists
        const bookingsRes = await axios.get(`${API}/vendors/bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(bookingsRes.data);
        
        const earningsRes = await axios.get(`${API}/vendors/earnings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEarnings(earningsRes.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setShowProfileForm(true);
        }
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API}/vendors/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setShowProfileForm(false);
      toast.success('Profile created successfully!');
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create profile');
    }
  };

  const handleUpdateBooking = async (bookingId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API}/bookings/${bookingId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Booking updated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to update booking');
    }
  };

  const allServices = categories.flatMap(cat => cat.services);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (showProfileForm || !profile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-24 pb-16 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h1 className="text-3xl font-bold mb-6" data-testid="vendor-profile-form-title">Create Vendor Profile</h1>
              <form onSubmit={handleCreateProfile} className="space-y-6">
                <div>
                  <Label>Services Offered (Select multiple)</Label>
                  <Select 
                    value={profileData.services[0] || ''}
                    onValueChange={(value) => {
                      if (!profileData.services.includes(value)) {
                        setProfileData({...profileData, services: [...profileData.services, value]});
                      }
                    }}
                  >
                    <SelectTrigger className="mt-2" data-testid="service-select">
                      <SelectValue placeholder="Select services" />
                    </SelectTrigger>
                    <SelectContent>
                      {allServices.map(service => (
                        <SelectItem key={service} value={service}>{service}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {profileData.services.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {profileData.services.map(service => (
                        <span key={service} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {service}
                          <button 
                            type="button"
                            onClick={() => setProfileData({...profileData, services: profileData.services.filter(s => s !== service)})}
                            className="ml-2"
                          >×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <Label>Years of Experience</Label>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={profileData.experience_years}
                    onChange={(e) => setProfileData({...profileData, experience_years: parseInt(e.target.value)})}
                    className="mt-2"
                    data-testid="experience-input"
                  />
                </div>

                <div>
                  <Label>Bio</Label>
                  <Textarea
                    required
                    placeholder="Tell customers about yourself and your expertise"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    className="mt-2 min-h-32"
                    data-testid="bio-input"
                  />
                </div>

                <div>
                  <Label>Hourly Rate (₹)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 500"
                    value={profileData.hourly_rate}
                    onChange={(e) => setProfileData({...profileData, hourly_rate: e.target.value})}
                    className="mt-2"
                    data-testid="hourly-rate-input"
                  />
                </div>

                <div>
                  <Label>Fixed Rate (₹)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 1000"
                    value={profileData.fixed_rate}
                    onChange={(e) => setProfileData({...profileData, fixed_rate: e.target.value})}
                    className="mt-2"
                    data-testid="fixed-rate-input"
                  />
                </div>

                <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700" data-testid="create-profile-btn">
                  Create Profile
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" data-testid="vendor-dashboard-title">Vendor Dashboard</h1>
            <p className="text-slate-600">Welcome back, {user?.full_name}!</p>
          </div>

          {profile.approval_status === 'pending' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
              <p className="text-amber-900 font-semibold">Your profile is pending approval by admin.</p>
            </div>
          )}

          {profile.approval_status === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <p className="text-red-900 font-semibold">Your profile was rejected. Please contact support.</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-12">
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
              <div className="flex items-center text-3xl font-bold text-slate-900">
                <Star className="w-8 h-8 fill-amber-400 text-amber-400 mr-2" />
                {profile.rating.toFixed(1)}
              </div>
              <div className="text-slate-600 mt-1">Rating ({profile.total_reviews} reviews)</div>
            </div>
            <div className="stat-card">
              <div className="flex items-center text-3xl font-bold text-slate-900">
                <IndianRupee className="w-7 h-7" />
                {earnings?.net_earnings?.toFixed(0) || 0}
              </div>
              <div className="text-slate-600 mt-1">Net Earnings</div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList>
              <TabsTrigger value="bookings" data-testid="bookings-tab">Bookings</TabsTrigger>
              <TabsTrigger value="profile" data-testid="profile-tab">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-4">
              {bookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <p className="text-slate-600">No bookings yet</p>
                </div>
              ) : (
                bookings.map(booking => (
                  <div key={booking.id} className="booking-card" data-testid={`vendor-booking-${booking.id}`}>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{booking.service_name}</h3>
                        <div className="space-y-1 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(booking.booking_date).toLocaleDateString('en-IN')} - {booking.time_slot}</span>
                          </div>
                          <div><strong>Location:</strong> {booking.location}</div>
                          <div><strong>Description:</strong> {booking.description}</div>
                          <div><strong>Status:</strong> <span className="font-semibold">{booking.status}</span></div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handleUpdateBooking(booking.id, 'confirmed')}
                              className="bg-teal-600 hover:bg-teal-700"
                              data-testid="accept-booking-btn"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Accept
                            </Button>
                            <Button
                              onClick={() => handleUpdateBooking(booking.id, 'cancelled')}
                              variant="outline"
                              data-testid="reject-booking-btn"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <Button
                            onClick={() => handleUpdateBooking(booking.id, 'in_progress')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Start Service
                          </Button>
                        )}
                        {booking.status === 'in_progress' && (
                          <Button
                            onClick={() => handleUpdateBooking(booking.id, 'completed')}
                            className="bg-teal-600 hover:bg-teal-700"
                          >
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="profile">
              <div className="bg-white rounded-xl border border-slate-200 p-8">
                <h2 className="text-2xl font-bold mb-6">Profile Details</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-slate-600">Services</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.services.map(service => (
                        <span key={service} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{service}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Experience</div>
                    <div className="font-semibold">{profile.experience_years} years</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Bio</div>
                    <p className="text-slate-800">{profile.bio}</p>
                  </div>
                  {profile.hourly_rate && (
                    <div>
                      <div className="text-sm text-slate-600">Hourly Rate</div>
                      <div className="font-semibold">₹{profile.hourly_rate}</div>
                    </div>
                  )}
                  {profile.fixed_rate && (
                    <div>
                      <div className="text-sm text-slate-600">Fixed Rate</div>
                      <div className="font-semibold">₹{profile.fixed_rate}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-slate-600">Approval Status</div>
                    <div className="font-semibold capitalize">{profile.approval_status}</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
