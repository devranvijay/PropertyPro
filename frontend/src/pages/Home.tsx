import { useState, useEffect } from 'react';
import { MapPin, Bed, Bath, Maximize, Heart, ArrowRight, Zap, Shield, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import EMICalculator from '../components/EMICalculator';
import FilterBar from '../components/FilterBar';
import AnimatedBackground from '../components/AnimatedBackground';

interface Property {
    _id: string;
    title: string;
    location: string;
    price: number;
    images: string[];
    amenities: string[];
}

const Home = () => {
    const [latestProperties, setLatestProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/properties');
                const data = await response.json();
                if (response.ok) {
                    setLatestProperties(data.slice(0, 3));
                }
            } catch (err) {
                console.error('Error fetching latest properties:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLatest();
    }, []);

    return (
        <div className="bg-white overflow-hidden text-secondary">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-32 overflow-hidden" style={{ background: '#060612' }}>
                {/* Animated Prism background */}
                <AnimatedBackground />

                {/* Subtle dot grid overlay */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        zIndex: 1,
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                />

                {/* Right panel accent (dark glass) */}
                <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block" style={{ zIndex: 1, background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(2px)', clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }} />

                <div className="section-padding relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" style={{ zIndex: 2 }}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-6 uppercase tracking-wider font-black" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#7dd3fc' }}>
                            Real Estate Saas for Modern Living
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-6" style={{ color: '#ffffff' }}>
                            Find your next <br />
                            <span style={{ background: 'linear-gradient(135deg, #00dcc8, #8b3cff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic' }}>dream home</span> <br />
                            <span style={{ color: 'rgba(255,255,255,0.85)' }}>with peace of mind.</span>
                        </h1>
                        <p className="text-xl mb-10 max-w-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                            A seamless, tech-enabled platform to buy, sell, or rent properties. Transparent, fast, and secure.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link to="/listings" className="btn-primary px-8 text-lg">
                                Explore Listings <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link to="/contact" className="px-8 py-3.5 font-bold rounded-xl transition-colors" style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}>
                                Contact Experts
                            </Link>
                        </div>

                        <div className="mt-12 flex items-center gap-8">
                            {[['10k+', 'Properties'], ['5k+', 'Happy Users'], ['200+', 'Agents']].map(([val, label], i) => (
                                <>
                                    {i > 0 && <div key={`sep-${i}`} className="w-px h-10" style={{ background: 'rgba(255,255,255,0.1)' }} />}
                                    <div key={val}>
                                        <h4 className="text-3xl font-black" style={{ color: '#fff' }}>{val}</h4>
                                        <p className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</p>
                                    </div>
                                </>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl rotate-2">
                            <img src="/assets/home-bg.jpg" alt="Modern Home" className="w-full h-[600px] object-cover" />
                        </div>
                        {/* Floating Cards */}
                        <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-premium border border-slate-100 z-20 flex items-center gap-4 animate-bounce-slow">
                            <div className="bg-success/10 p-3 rounded-xl">
                                <CheckCircle2 className="text-success w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-secondary-light font-bold uppercase">Status</p>
                                <p className="text-sm font-black text-secondary">Property Verified</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Smart Search Filter */}
            <section className="mt-[-60px] relative z-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <FilterBar />
                </div>
            </section>

            {/* Features/Services */}
            <section className="section-padding">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl font-black text-secondary mb-6 lowercase">the propertypro <span className="text-primary italic uppercase">Experience</span></h2>
                    <p className="text-lg text-secondary-light">We've automated the complex parts of real estate to let you focus on what matters.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Smart Matching", icon: <Zap />, desc: "Our AI finds the perfect property based on your lifestyle patterns." },
                        { title: "Secure Transactions", icon: <Shield />, desc: "Blockchain-backed document verification for maximum security." },
                        { title: "Quick Move-in", icon: <CheckCircle2 />, desc: "Fast-track paperwork that gets you moved in 48 hours." }
                    ].map((feature, idx) => (
                        <div key={idx} className="p-10 bg-slate-50 rounded-[2rem] hover:bg-white hover:shadow-premium hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-slate-100 group">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-black text-secondary mb-4">{feature.title}</h3>
                            <p className="text-secondary-light leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Latest Listings */}
            <section className="bg-slate-50 section-padding">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 px-4">
                    <div className="max-w-xl">
                        <h2 className="text-4xl font-black text-secondary uppercase leading-[0.9] mb-4">Newest <br /><span className="text-primary italic">Hand-picked</span> Gems</h2>
                        <p className="text-lg text-secondary-light font-medium">Curated listings that match our quality standards.</p>
                    </div>
                    <Link to="/listings" className="group flex items-center gap-2 font-bold text-secondary hover:text-primary transition-colors pr-4">
                        View gallery <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-[2rem] h-[500px] animate-pulse" />
                        ))
                    ) : latestProperties.length > 0 ? (
                        latestProperties.map((property) => (
                            <motion.div
                                key={property._id}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-[2rem] overflow-hidden shadow-premium group border border-slate-100"
                            >
                                <div className="relative h-72 overflow-hidden">
                                    <img
                                        src={(property.images?.[0]?.startsWith("/uploads") ? "http://localhost:5001" + property.images[0] : property.images?.[0]) || '/assets/house-img-1.webp'}
                                        alt={property.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-6 left-6 flex gap-2">
                                        <span className="bg-white/90 backdrop-blur-md text-secondary px-4 py-1.5 rounded-full text-xs font-black uppercase shadow-sm">new listing</span>
                                        <span className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-black uppercase shadow-lg shadow-primary/20">sale</span>
                                    </div>
                                    <button className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-md text-secondary rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-colors">
                                        <Heart className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-2xl font-black text-secondary leading-tight group-hover:text-primary transition-colors cursor-pointer">{property.title}</h3>
                                        <p className="text-xl font-black text-primary">₹{property.price.toLocaleString('en-IN')}</p>
                                    </div>
                                    <p className="flex items-center gap-2 text-secondary-light font-bold text-sm mb-8">
                                        <MapPin className="w-4 h-4 text-primary" /> {property.location}
                                    </p>
                                    <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-8 mb-8">
                                        <div className="flex flex-col items-center gap-1">
                                            <p className="text-sm font-black text-secondary">3</p>
                                            <p className="text-[10px] uppercase font-bold text-secondary-light flex items-center gap-1"><Bed className="w-3 h-3 text-primary" /> Beds</p>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 border-x border-slate-100">
                                            <p className="text-sm font-black text-secondary">2</p>
                                            <p className="text-[10px] uppercase font-bold text-secondary-light flex items-center gap-1"><Bath className="w-3 h-3 text-primary" /> Baths</p>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <p className="text-sm font-black text-secondary">1.2k</p>
                                            <p className="text-[10px] uppercase font-bold text-secondary-light flex items-center gap-1"><Maximize className="w-3 h-3 text-primary" /> Sqft</p>
                                        </div>
                                    </div>
                                    <Link to={`/view-property?id=${property._id}`} className="w-full btn-primary text-base font-black py-4 rounded-2xl flex items-center justify-center">
                                        View full details
                                    </Link>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-secondary-light">New gems arriving soon!</p>
                        </div>
                    )}
                </div>
            </section>

            <EMICalculator />

            {/* CTA Section */}
            <section className="section-padding">
                <div className="bg-secondary rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-primary blur-[120px] opacity-20"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary blur-[120px] opacity-20"></div>

                    <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 tracking-tighter">Ready to find your <br /><span className="text-primary italic">next chapter?</span></h2>
                    <p className="text-xl text-white/60 mb-12 max-w-xl mx-auto">Join 50,000+ users who found their dream homes through PropertyPro.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/register" className="btn-primary px-12 text-lg">Create Free Account</Link>
                        <Link to="/about" className="px-12 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10">Learn More</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
