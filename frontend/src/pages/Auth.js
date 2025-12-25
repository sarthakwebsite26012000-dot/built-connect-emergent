import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, API } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2 } from 'lucide-react';

const Auth = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    email: '', 
    password: '', 
    full_name: '', 
    phone: '',
    role: 'customer'
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API}/auth/login`, loginData);
      login(response.data.token, response.data.user);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API}/auth/register`, registerData);
      login(response.data.token, response.data.user);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="w-10 h-10 text-blue-600" />
            <span className="text-3xl font-bold">BuildConnect</span>
          </div>
          <p className="text-slate-600">One Platform. Every Service.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" data-testid="login-tab">Login</TabsTrigger>
              <TabsTrigger value="register" data-testid="register-tab">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    className="h-12 mt-2"
                    data-testid="login-email-input"
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="h-12 mt-2"
                    data-testid="login-password-input"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                  data-testid="login-submit-btn"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials:</p>
                <p className="text-sm text-blue-700">Admin: admin@buildconnect.com / admin123</p>
              </div>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input
                    id="register-name"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={registerData.full_name}
                    onChange={(e) => setRegisterData({...registerData, full_name: e.target.value})}
                    className="h-12 mt-2"
                    data-testid="register-name-input"
                  />
                </div>
                <div>
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    className="h-12 mt-2"
                    data-testid="register-email-input"
                  />
                </div>
                <div>
                  <Label htmlFor="register-phone">Phone</Label>
                  <Input
                    id="register-phone"
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                    className="h-12 mt-2"
                    data-testid="register-phone-input"
                  />
                </div>
                <div>
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    className="h-12 mt-2"
                    data-testid="register-password-input"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                  data-testid="register-submit-btn"
                >
                  {loading ? 'Registering...' : 'Register'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
