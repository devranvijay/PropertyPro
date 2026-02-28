import { Search, MapPin, SlidersHorizontal, ArrowRight, Heart, Map as MapIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

interface Property {
    _id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    type: string;
    images: string[];
    views: number;
}

const Listings = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
    const [savingId, setSavingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        type: searchParams.get('type') || '',
        minPrice: '',
        maxPrice: '',
        location: ''
    });

    // Sync URL ?type= param when user clicks Rent/Buy in nav
    useEffect(() => {
        const typeFromUrl = searchParams.get('type') || '';
        setFilters(prev => ({ ...prev, type: typeFromUrl }));
    }, [searchParams]);

    // Load saved property IDs on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/users/saved`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setSavedIds(new Set(data.map((p: any) => p._id)));
                }
            })
            .catch(() => { });
    }, []);

    const toggleSave = async (e: React.MouseEvent, propertyId: string) => {
        e.preventDefault();
        e.stopPropagation();
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        setSavingId(propertyId);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/users/toggle-save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ propertyId })
            });
            const data = await res.json();
            if (res.ok) {
                setSavedIds(prev => {
                    const next = new Set(prev);
                    if (data.isSaved) next.add(propertyId);
                    else next.delete(propertyId);
                    return next;
                });
            }
        } catch (err) {
            console.error('Toggle save failed:', err);
        } finally {
            setSavingId(null);
        }
    };

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const queryParams = new URLSearchParams();
                if (searchTerm) queryParams.append('search', searchTerm);
                if (filters.type) queryParams.append('type', filters.type);
                if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
                if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
                if (filters.location) queryParams.append('location', filters.location);

                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/properties?${queryParams.toString()}`);
                const data = await response.json();
                if (response.ok) {
                    setProperties(data);
                }
            } catch (err) {
                console.error('Error fetching properties:', err);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchProperties, 300);
        return () => clearTimeout(debounce);
    }, [searchTerm, filters]);

    return (
        <div className="bg-slate-50 min-h-screen pt-32">
            {/* Search & Filter Protocol */}
            <section className="max-w-7xl mx-auto px-6 mb-12">
                <div className="bg-white p-6 rounded-[2.5rem] shadow-premium border border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-bold text-secondary placeholder:text-slate-400"
                            />
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                            <select
                                value={filters.location}
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-bold text-secondary appearance-none"
                            >
                                <option value="">Global Location</option>
                                <option value="Mumbai">Mumbai</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Bangalore">Bangalore</option>
                            </select>
                        </div>
                        <div className="relative">
                            <SlidersHorizontal className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
                            <select
                                value={filters.type}
                                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-bold text-secondary appearance-none"
                            >
                                <option value="">All Types</option>
                                <option value="buy">Buy</option>
                                <option value="rent">Rent</option>
                                <option value="commercial">Commercial</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Asset Grid */}
            <section className="max-w-7xl mx-auto px-6 pb-24">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-secondary uppercase tracking-tight">Available <span className="text-primary italic">Properties</span></h2>
                        <p className="text-secondary-light font-bold mt-2">Showing {properties.length} verified listings</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">
                        <MapIcon className="w-4 h-4" /> Switch to Map
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => <div key={i} className="h-[450px] bg-white rounded-[3rem] animate-pulse border border-slate-100" />)}
                    </div>
                ) : properties.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-premium">
                        <p className="text-2xl font-black text-secondary uppercase italic">No properties found</p>
                        <button onClick={() => { setSearchTerm(''); setFilters({ type: '', minPrice: '', maxPrice: '', location: '' }) }} className="mt-6 text-primary font-black uppercase tracking-widest hover:underline">Clear Filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {properties.map((property) => (
                            <div key={property._id} className="group bg-white rounded-[3rem] overflow-hidden shadow-premium border border-slate-100 hover:border-primary/20 transition-all duration-500 hover:-translate-y-2">
                                <div className="h-64 relative overflow-hidden">
                                    <img
                                        src={(property.images?.[0]?.startsWith("/uploads") ? "http://localhost:5001" + property.images[0] : property.images?.[0]) || '/assets/house-img-1.webp'}
                                        alt={property.title}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                                        <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg ${property.type === 'rent'
                                            ? 'bg-blue-500 text-white shadow-blue-500/20'
                                            : property.type === 'commercial'
                                                ? 'bg-amber-500 text-white shadow-amber-500/20'
                                                : 'bg-primary text-white shadow-primary/20'
                                            }`}>
                                            {property.type === 'rent' ? 'Rent' : property.type === 'commercial' ? 'Commercial' : 'Buy'}
                                        </span>
                                        {property.views > 50 && <span className="px-4 py-1.5 bg-secondary text-white text-[10px] font-black uppercase tracking-widest rounded-full">Trending</span>}
                                    </div>
                                    <button
                                        onClick={(e) => toggleSave(e, property._id)}
                                        disabled={savingId === property._id}
                                        className={`absolute top-6 right-6 w-10 h-10 rounded-xl backdrop-blur flex items-center justify-center transition-all duration-300 ${savedIds.has(property._id)
                                            ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110'
                                            : 'bg-white/90 text-secondary hover:text-primary hover:scale-110'
                                            } ${savingId === property._id ? 'opacity-60 animate-pulse' : ''}`}
                                    >
                                        <Heart className={`w-5 h-5 transition-all ${savedIds.has(property._id) ? 'fill-current' : ''}`} />
                                    </button>
                                </div>

                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-black text-secondary leading-tight group-hover:text-primary transition-colors">{property.title}</h3>
                                        <p className="text-lg font-black text-secondary shrink-0 ml-4">
                                            ₹{property.price.toLocaleString('en-IN')}
                                            {property.type === 'rent' && <span className="text-sm text-slate-400 font-bold">/mo</span>}
                                        </p>
                                    </div>
                                    <p className="flex items-center gap-2 text-slate-500 font-bold text-sm mb-6">
                                        <MapPin className="w-4 h-4 text-primary" /> {property.location}
                                    </p>

                                    <Link
                                        to={`/property-detail?id=${property._id}`}
                                        className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 rounded-2xl font-black text-xs uppercase tracking-widest text-secondary hover:bg-primary hover:text-white transition-all group/btn"
                                    >
                                        View Details
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Listings;
