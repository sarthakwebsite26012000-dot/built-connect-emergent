import { useState, useEffect, useContext } from 'react';
import { AuthContext, API } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Briefcase, IndianRupee, TrendingUp, CheckCircle2, XCircle, Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [statsRes, vendorsRes, bookingsRes] = await Promise.all([
        axios.get(`${API}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/admin/vendors`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/admin/bookings`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setStats(statsRes.data);
      setVendors(vendorsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVendor = async (vendorId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API}/admin/vendors/${vendorId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Vendor approved successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to approve vendor');
    }
  };

  const handleRejectVendor = async (vendorId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API}/admin/vendors/${vendorId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Vendor rejected');
      fetchData();
    } catch (error) {
      toast.error('Failed to reject vendor');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" data-testid="admin-dashboard-title">Admin Dashboard</h1>
            <p className="text-slate-600">Welcome back, {user?.full_name}!</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="stat-card">
              <Users className="w-8 h-8 text-blue-600 mb-3" />
              <div className="text-3xl font-bold text-slate-900">{stats?.total_users || 0}</div>
              <div className="text-slate-600 mt-1">Total Users</div>
            </div>
            <div className="stat-card">
              <Briefcase className="w-8 h-8 text-teal-600 mb-3" />
              <div className="text-3xl font-bold text-slate-900">{stats?.total_vendors || 0}</div>
              <div className="text-slate-600 mt-1">Total Vendors</div>
              <div className="text-sm text-amber-600 mt-2">
                {stats?.pending_vendors || 0} pending approval
              </div>
            </div>
            <div className="stat-card">
              <TrendingUp className="w-8 h-8 text-indigo-600 mb-3" />
              <div className="text-3xl font-bold text-slate-900">{stats?.total_bookings || 0}</div>
              <div className="text-slate-600 mt-1">Total Bookings</div>
            </div>
            <div className="stat-card">
              <IndianRupee className="w-8 h-8 text-green-600 mb-3" />
              <div className="text-3xl font-bold text-slate-900">
                {stats?.platform_revenue?.toFixed(0) || 0}
              </div>
              <div className="text-slate-600 mt-1">Platform Revenue</div>
              <div className="text-xs text-slate-500 mt-2">
                15% commission from ₹{stats?.total_revenue?.toFixed(0) || 0}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="vendors" className="space-y-6">
            <TabsList>
              <TabsTrigger value="vendors" data-testid="vendors-tab">Vendor Management</TabsTrigger>
              <TabsTrigger value="bookings" data-testid="all-bookings-tab">All Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="vendors" className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-2xl font-bold">Vendor Applications</h2>
                </div>
                <div className="divide-y divide-slate-200">
                  {vendors.length === 0 ? (
                    <div className="p-6 text-center text-slate-600">No vendors found</div>
                  ) : (
                    vendors.map((vendor) => (
                      <div key={vendor.id} className="p-6" data-testid={`vendor-${vendor.id}`}>
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold">
                                {vendor.user_details?.full_name || 'N/A'}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                vendor.approval_status === 'approved' ? 'bg-teal-100 text-teal-700' :
                                vendor.approval_status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {vendor.approval_status}
                              </span>
                            </div>
                            <div className="space-y-2 text-sm text-slate-600">
                              <div><strong>Email:</strong> {vendor.user_details?.email}</div>
                              <div><strong>Phone:</strong> {vendor.user_details?.phone}</div>
                              <div><strong>Services:</strong> {vendor.services.join(', ')}</div>
                              <div><strong>Experience:</strong> {vendor.experience_years} years</div>
                              <div><strong>Bio:</strong> {vendor.bio}</div>
                              {vendor.hourly_rate && <div><strong>Hourly Rate:</strong> ₹{vendor.hourly_rate}</div>}
                              {vendor.fixed_rate && <div><strong>Fixed Rate:</strong> ₹{vendor.fixed_rate}</div>}
                            </div>
                          </div>
                          {vendor.approval_status === 'pending' && (
                            <div className="flex flex-col gap-2">
                              <Button
                                onClick={() => handleApproveVendor(vendor.id)}
                                className="bg-teal-600 hover:bg-teal-700"
                                data-testid="approve-vendor-btn"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => handleRejectVendor(vendor.id)}
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50"
                                data-testid="reject-vendor-btn"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-4">
              {bookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <p className="text-slate-600">No bookings yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="booking-card" data-testid={`admin-booking-${booking.id}`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{booking.service_name}</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                            <div><strong>Customer ID:</strong> {booking.customer_id.slice(0, 8)}...</div>
                            <div><strong>Vendor ID:</strong> {booking.vendor_id ? booking.vendor_id.slice(0, 8) + '...' : 'Not assigned'}</div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(booking.booking_date).toLocaleDateString('en-IN')}</span>
                            </div>
                            <div><strong>Time:</strong> {booking.time_slot}</div>
                            <div><strong>Location:</strong> {booking.location}</div>
                            <div><strong>Pincode:</strong> {booking.pincode}</div>
                            <div><strong>Status:</strong> {booking.status}</div>
                            <div><strong>Payment:</strong> {booking.payment_status}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1 text-2xl font-bold text-slate-900">
                            <IndianRupee className="w-5 h-5" />
                            {booking.final_price || booking.estimated_price}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
