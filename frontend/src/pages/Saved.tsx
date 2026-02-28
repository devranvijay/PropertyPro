import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, ArrowRight, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface Property {
    _id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    type: string;
    images: string[];
}

const Saved = () => {
    const [savedProperties, setSavedProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);

    const fetchSaved = async () => {
        const token = localStorage.getItem('token');
        if (!token) { setLoading(false); return; }
        try {
            const res = await fetch('http://localhost:5001/api/users/saved', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok && Array.isArray(data)) {
                setSavedProperties(data);
            }
        } catch (err) {
            console.error('Failed to fetch saved properties:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSaved(); }, []);

    const handleUnsave = async (propertyId: string) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        setRemovingId(propertyId);
        try {
            const res = await fetch('http://localhost:5001/api/users/toggle-save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ propertyId })
            });
            if (res.ok) {
                setSavedProperties(prev => prev.filter(p => p._id !== propertyId));
            }
        } catch (err) {
            console.error('Unsave failed:', err);
        } finally {
            setRemovingId(null);
        }
    };

    const getImageSrc = (images: string[]) => {
        const img = images?.[0];
        if (!img) return '/assets/house-img-1.webp';
        return img.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${img}` : img;
    };

    return (
        <div className="bg-slate-50 min-h-screen pt-32 pb-20">
            <section className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-12">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3">Your Collection</p>
                    <h1 className="text-5xl font-black text-secondary uppercase tracking-tighter leading-none mb-2">
                        Saved <span className="text-primary italic">Properties</span>
                    </h1>
                    <p className="text-secondary-light font-bold">
                        {loading ? 'Loading...' : `${savedProperties.length} propert${savedProperties.length === 1 ? 'y' : 'ies'} in your shortlist`}
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[420px] bg-white rounded-[3rem] animate-pulse border border-slate-100" />
                        ))}
                    </div>
                ) : savedProperties.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mb-8 border border-primary/10">
                            <Heart className="w-10 h-10 text-primary/30" />
                        </div>
                        <p className="text-2xl font-black text-secondary uppercase tracking-tight mb-2">No Favorites Yet</p>
                        <p className="text-secondary-light font-medium mb-8">
                            Start saving properties you love using the ❤ button on any listing.
                        </p>
                        <Link
                            to="/listings"
                            className="btn-primary px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-primary/20"
                        >
                            Browse Listings <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {savedProperties.map((property) => (
                                <motion.div
                                    key={property._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-[3rem] overflow-hidden shadow-premium group border border-slate-100 hover:border-primary/20 transition-all flex flex-col"
                                >
                                    {/* Image */}
                                    <div className="relative h-56 overflow-hidden flex-shrink-0">
                                        <img
                                            src={getImageSrc(property.images)}
                                            alt={property.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {/* Type Badge */}
                                        <span className="absolute top-6 left-6 px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary/20 capitalize">
                                            {property.type}
                                        </span>
                                        {/* Filled red heart to show it's saved */}
                                        <div className="absolute top-6 right-6 w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                                            <Heart className="w-5 h-5 text-white fill-current" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-black text-secondary leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                {property.title}
                                            </h3>
                                        </div>
                                        <p className="text-2xl font-black text-secondary mb-2">
                                            ₹{property.price.toLocaleString('en-IN')}
                                            {property.type === 'rent' && <span className="text-sm text-slate-400 font-bold">/mo</span>}
                                        </p>
                                        <p className="flex items-center gap-2 text-slate-500 font-bold text-sm mb-8">
                                            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                                            <span className="line-clamp-1">{property.location}</span>
                                        </p>

                                        <div className="mt-auto flex gap-3">
                                            <Link
                                                to={`/property-detail?id=${property._id}`}
                                                className="flex-grow btn-primary py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm"
                                            >
                                                View Details <ArrowRight className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleUnsave(property._id)}
                                                disabled={removingId === property._id}
                                                className="p-4 bg-slate-50 text-secondary-light hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all disabled:opacity-50"
                                                title="Remove from saved"
                                            >
                                                {removingId === property._id
                                                    ? <Loader2 className="w-5 h-5 animate-spin" />
                                                    : <Trash2 className="w-5 h-5" />
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Add more CTA */}
                        <motion.div
                            layout
                            className="border-4 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-primary/30 transition-all"
                        >
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                                <Heart className="w-8 h-8" />
                            </div>
                            <p className="text-secondary-light font-black uppercase tracking-widest text-xs mb-6">Save more to compare</p>
                            <Link to="/listings" className="text-primary font-black uppercase text-xs hover:underline flex items-center gap-2">
                                Explore Listings <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Saved;
