import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API } from '@/App';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Search } from 'lucide-react';
import * as Icons from 'lucide-react';

const Services = () => {
  const { category } = useParams();
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, [category]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/services/categories`);
      let data = response.data;
      if (category) {
        data = data.filter(cat => cat.slug === category);
      }
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.map(cat => ({
    ...cat,
    services: cat.services.filter(service => 
      service.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.services.length > 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="services-page-title">
              {category ? categories[0]?.name : 'All Services'}
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              {category ? categories[0]?.description : 'Browse all available services'}
            </p>
            
            {/* Search */}
            <div className="max-w-xl relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-base"
                data-testid="service-search-input"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading services...</div>
          ) : (
            <div className="space-y-16">
              {filteredCategories.map((cat) => {
                const IconComponent = Icons[cat.icon] || Icons.Wrench;
                return (
                  <div key={cat.id}>
                    <div className="flex items-center gap-3 mb-6">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                      <h2 className="text-3xl font-bold">{cat.name}</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {cat.services.map((service, idx) => (
                        <Link
                          key={idx}
                          to={`/service/${encodeURIComponent(service)}`}
                          className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all group"
                          data-testid={`service-${service.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <h3 className="font-semibold text-lg mb-2">{service}</h3>
                          <div className="flex items-center text-blue-600 text-sm font-medium">
                            Book Now <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">No services found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Services;
