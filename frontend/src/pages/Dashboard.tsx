import {
    LayoutDashboard, Home, MessageSquare, LogOut,
    Search, MapPin, Bell, ArrowRight, Heart, Plus, ShieldCheck,
    Eye, Building2, Users, TrendingUp
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Property {
    _id: string;
    title: string;
    location: string;
    price: number;
    type: string;
    images: string[];
    views: number;
}

interface Inquiry {
    _id: string;
    senderName: string;
    senderEmail: string;
    message: string;
    propertyId?: { _id: string; title: string };
    status: string;
    createdAt: string;
}

interface Offer {
    _id: string;
    buyerName: string;
    buyerEmail: string;
    offerAmount: number;
    note?: string;
    status: string;
    propertyId?: { _id: string; title: string; price: number };
    createdAt: string;
}

interface Visit {
    _id: string;
    visitorName: string;
    visitorPhone: string;
    visitDate: string;
    visitTime: string;
    status: string;
    propertyId?: { _id: string; title: string };
    createdAt: string;
}

// ─────────────────────────────────────────────
// BUYER SIDEBAR LINKS
const buyerNav = [
    { icon: LayoutDashboard, label: 'My Dashboard', route: '/dashboard' },
    { icon: Heart, label: 'Saved Properties', route: '/saved' },
    { icon: Search, label: 'Browse Listings', route: '/listings' },
];

// SELLER SIDEBAR LINKS
const sellerNav = [
    { icon: LayoutDashboard, label: 'My Dashboard', route: '/dashboard' },
    { icon: Building2, label: 'My Listings', route: '/dashboard' },
    { icon: MessageSquare, label: 'Inquiries', route: '/dashboard' },
    { icon: Plus, label: 'Post New Property', route: '/post-property' },
];

// ADMIN SIDEBAR LINKS
const adminNav = [
    { icon: LayoutDashboard, label: 'Overview', route: '/dashboard' },
    { icon: ShieldCheck, label: 'Admin Panel', route: '/admin' },
    { icon: Users, label: 'All Users', route: '/admin' },
    { icon: Building2, label: 'All Properties', route: '/listings' },
];

// ─────────────────────────────────────────────

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [myProperties, setMyProperties] = useState<Property[]>([]);
    const [savedProperties, setSavedProperties] = useState<Property[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [visits, setVisits] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'inquiries' | 'offers' | 'visits'>('inquiries');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (!userData || !token) { navigate('/login'); return; }
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        const fetchData = async () => {
            try {
                if (parsedUser.role === 'seller') {
                    const [propRes, inqRes, offerRes, visitRes] = await Promise.all([
                        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/properties/my`, { headers: { 'Authorization': `Bearer ${token}` } }),
                        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/inquiries/received`, { headers: { 'Authorization': `Bearer ${token}` } }),
                        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/offers/received`, { headers: { 'Authorization': `Bearer ${token}` } }),
                        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/visits/incoming`, { headers: { 'Authorization': `Bearer ${token}` } })
                    ]);
                    const [propData, inqData, offerData, visitData] = await Promise.all([propRes.json(), inqRes.json(), offerRes.json(), visitRes.json()]);
                    if (propRes.ok) setMyProperties(propData);
                    if (inqRes.ok) setInquiries(Array.isArray(inqData) ? inqData : []);
                    if (offerRes.ok) setOffers(Array.isArray(offerData) ? offerData : []);
                    if (visitRes.ok) setVisits(Array.isArray(visitData) ? visitData : []);

                } else if (parsedUser.role === 'buyer') {
                    const [savedRes, sentInqRes, myOffersRes, myVisitsRes] = await Promise.all([
                        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/users/saved`, { headers: { 'Authorization': `Bearer ${token}` } }),
                        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/inquiries/sent`, { headers: { 'Authorization': `Bearer ${token}` } }),
                        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/offers/my`, { headers: { 'Authorization': `Bearer ${token}` } }),
                        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/visits/my`, { headers: { 'Authorization': `Bearer ${token}` } })
                    ]);
                    const [savedData, sentInqData, myOffersData, myVisitsData] = await Promise.all([savedRes.json(), sentInqRes.json(), myOffersRes.json(), myVisitsRes.json()]);
                    if (savedRes.ok) setSavedProperties(Array.isArray(savedData) ? savedData : []);
                    if (sentInqRes.ok) setInquiries(Array.isArray(sentInqData) ? sentInqData : []);
                    if (myOffersRes.ok) setOffers(Array.isArray(myOffersData) ? myOffersData : []);
                    if (myVisitsRes.ok) setVisits(Array.isArray(myVisitsData) ? myVisitsData : []);

                } else if (parsedUser.role === 'admin') {
                    const [userRes, propRes, inqRes, offerRes] = await Promise.all([
                        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/users/all`, { headers: { 'Authorization': `Bearer ${token}` } }),
                        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/properties`, { headers: { 'Authorization': `Bearer ${token}` } }),
                        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/inquiries/admin/all`, { headers: { 'Authorization': `Bearer ${token}` } }),
                        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/offers/admin/all`, { headers: { 'Authorization': `Bearer ${token}` } })
                    ]);
                    const [userData2, propData, inqData, offerData] = await Promise.all([userRes.json(), propRes.json(), inqRes.json(), offerRes.json()]);
                    if (userRes.ok) setUsers(Array.isArray(userData2) ? userData2 : []);
                    if (propRes.ok) setMyProperties(Array.isArray(propData) ? propData : []);
                    if (inqRes.ok) setInquiries(Array.isArray(inqData) ? inqData : []);
                    if (offerRes.ok) setOffers(Array.isArray(offerData) ? offerData : []);
                }
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleOfferStatus = async (offerId: string, status: string) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/offers/${offerId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setOffers(prev => prev.map(o => o._id === offerId ? { ...o, status } : o));
            }
        } catch (err) {
            console.error('Failed to update offer status:', err);
        }
    };

    const handleVisitStatus = async (visitId: string, status: string) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/visits/${visitId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setVisits(prev => prev.map(v => v._id === visitId ? { ...v, status } : v));
            }
        } catch (err) {
            console.error('Failed to update visit status:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return null;

    const navLinks = user.role === 'seller' ? sellerNav : user.role === 'admin' ? adminNav : buyerNav;
    const getImgSrc = (images: string[]) => {
        const img = images?.[0];
        if (!img) return '/assets/house-img-1.webp';
        return img.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${img}` : img;
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* ── Sidebar ── */}
            <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen">
                {/* Logo */}
                <div className="px-8 py-8 border-b border-slate-50">
                    <Link to="/" className="text-xl font-black text-secondary flex items-center gap-2">
                        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 text-sm">P</div>
                        Property<span className="text-primary italic">Pro</span>
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-grow px-4 py-6 space-y-1 overflow-y-auto">
                    <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                        {user.role === 'buyer' ? 'Buyer Menu' : user.role === 'seller' ? 'Seller Menu' : 'Admin Menu'}
                    </p>
                    {navLinks.map((item, i) => (
                        <Link
                            to={item.route}
                            key={i}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${window.location.pathname === item.route
                                ? 'bg-primary/10 text-primary'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-secondary'
                                }`}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* User Info */}
                <div className="px-4 py-6 border-t border-slate-50">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/10 flex items-center justify-center font-black text-primary">
                            {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <p className="font-black text-secondary text-sm truncate">{user.name}</p>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'text-red-500' : 'text-primary'}`}>
                                {user.role}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all font-bold text-sm"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="flex-grow p-8 overflow-y-auto">
                {/* Top Bar */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">
                            {user.role === 'buyer' ? '🏠 Buyer Portal' : user.role === 'seller' ? '🏢 Seller Portal' : '⚡ Admin Portal'}
                        </p>
                        <h2 className="text-3xl font-black text-secondary">
                            Welcome back, <span className="text-primary">{user.name.split(' ')[0]}</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary shadow-sm transition-all">
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full"></span>
                        </button>
                        <Link to="/" className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors">
                            <Home className="w-4 h-4" /> Home
                        </Link>
                    </div>
                </header>

                {/* ════════════ BUYER VIEW ════════════ */}
                {user.role === 'buyer' && (
                    <div className="space-y-8">
                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Saved Properties</p>
                                <p className="text-4xl font-black text-secondary">{savedProperties.length}</p>
                            </div>
                            <div className="bg-primary p-6 rounded-[2rem] shadow-xl shadow-primary/20">
                                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">Shortlisted</p>
                                <p className="text-4xl font-black text-white">{savedProperties.length}</p>
                            </div>
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Profile Status</p>
                                <p className="text-sm font-black text-green-500 flex items-center gap-2">
                                    Active <span className="w-2 h-2 bg-green-400 rounded-full animate-ping inline-block"></span>
                                </p>
                            </div>
                        </div>

                        {/* Saved Properties */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black text-secondary uppercase">
                                    Your <span className="text-primary italic">Saved Properties</span>
                                </h3>
                                <Link to="/saved" className="text-xs font-black text-primary hover:underline uppercase tracking-widest">
                                    View All →
                                </Link>
                            </div>
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[1, 2].map(i => <div key={i} className="h-48 bg-white rounded-[2rem] animate-pulse border border-slate-100" />)}
                                </div>
                            ) : savedProperties.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {savedProperties.map((p) => (
                                        <Link
                                            to={`/property-detail?id=${p._id}`}
                                            key={p._id}
                                            className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:border-primary/20 shadow-sm hover:shadow-lg transition-all group"
                                        >
                                            <div className="h-40 overflow-hidden relative">
                                                <img src={getImgSrc(p.images)} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute top-3 right-3 bg-primary rounded-xl p-2 shadow-lg">
                                                    <Heart className="w-3.5 h-3.5 text-white fill-current" />
                                                </div>
                                                <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 text-secondary text-[9px] font-black uppercase rounded-lg capitalize">
                                                    {p.type}
                                                </span>
                                            </div>
                                            <div className="p-5">
                                                <h4 className="font-black text-secondary text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">{p.title}</h4>
                                                <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                                                    <MapPin className="w-3 h-3 text-primary" /> {p.location}
                                                </p>
                                                <div className="flex justify-between items-center">
                                                    <p className="font-black text-primary">₹{p.price.toLocaleString('en-IN')}</p>
                                                    <span className="text-[9px] font-black text-slate-300 uppercase">View Details →</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-100 p-16 text-center">
                                    <Heart className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                                    <p className="font-black text-secondary mb-2">No saved properties yet</p>
                                    <p className="text-sm text-slate-400 mb-6">Browse listings and click the ❤️ to save properties here.</p>
                                    <Link to="/listings" className="btn-primary px-8 py-3 rounded-xl font-black text-sm inline-flex items-center gap-2">
                                        Browse Listings <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Buyer Activity */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black text-secondary uppercase">
                                    Activity <span className="text-primary italic">Tracking</span>
                                </h3>
                                <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
                                    {(['offers', 'visits', 'inquiries'] as const).map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-4 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-secondary text-white' : 'text-slate-400'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm min-h-[200px]">
                                {activeTab === 'offers' && (
                                    offers.length > 0 ? (
                                        <table className="w-full">
                                            <thead className="bg-slate-50 border-b border-slate-100">
                                                <tr>
                                                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase text-left">Property</th>
                                                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase text-left">Your Offer</th>
                                                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase text-left">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {offers.map(o => (
                                                    <tr key={o._id}>
                                                        <td className="px-6 py-4 text-xs font-bold text-secondary">{o.propertyId?.title || 'Property'}</td>
                                                        <td className="px-6 py-4 text-sm font-black text-primary">₹{o.offerAmount.toLocaleString()}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 text-[9px] font-black uppercase rounded-lg ${o.status === 'accepted' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>{o.status}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : <p className="p-12 text-center text-slate-400 font-bold">No offers made yet.</p>
                                )}

                                {activeTab === 'visits' && (
                                    visits.length > 0 ? (
                                        <table className="w-full">
                                            <thead className="bg-slate-50 border-b border-slate-100">
                                                <tr>
                                                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase text-left">Property</th>
                                                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase text-left">Date & Time</th>
                                                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase text-left">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {visits.map(v => (
                                                    <tr key={v._id}>
                                                        <td className="px-6 py-4 text-xs font-bold text-secondary">{v.propertyId?.title || 'Property'}</td>
                                                        <td className="px-6 py-4 text-xs font-bold text-slate-500">{v.visitDate} at {v.visitTime}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 text-[9px] font-black uppercase rounded-lg ${v.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>{v.status}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : <p className="p-12 text-center text-slate-400 font-bold">No visits scheduled yet.</p>
                                )}

                                {activeTab === 'inquiries' && (
                                    inquiries.length > 0 ? (
                                        <div className="p-6 space-y-4">
                                            {inquiries.map(inq => (
                                                <div key={inq._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <p className="text-[10px] font-black text-primary uppercase mb-1">{inq.propertyId?.title || 'General'}</p>
                                                    <p className="text-xs text-secondary italic mb-2">"{inq.message}"</p>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[9px] font-black uppercase text-slate-400">{new Date(inq.createdAt).toLocaleDateString()}</span>
                                                        <span className="px-2 py-0.5 bg-white text-secondary text-[8px] font-black uppercase rounded border border-slate-100">{inq.status}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : <p className="p-12 text-center text-slate-400 font-bold">No inquiries sent yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-secondary rounded-[2rem] p-8 flex flex-col md:flex-row gap-6 items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Ready to find your dream home?</p>
                                <h3 className="text-2xl font-black text-white">Explore New Properties</h3>
                            </div>
                            <Link to="/listings" className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-primary/30 shrink-0 hover:opacity-90 transition-opacity">
                                Browse Listings <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* ════════════ SELLER VIEW ════════════ */}
                {user.role === 'seller' && (
                    <div className="space-y-8">
                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                                <Building2 className="w-5 h-5 text-primary mb-3" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">My Listings</p>
                                <p className="text-3xl font-black text-secondary">{myProperties.length}</p>
                            </div>
                            <div className="bg-primary p-6 rounded-[2rem] shadow-xl shadow-primary/20">
                                <MessageSquare className="w-5 h-5 text-white/60 mb-3" />
                                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Inquiries</p>
                                <p className="text-3xl font-black text-white">{inquiries.length}</p>
                            </div>
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                                <Eye className="w-5 h-5 text-primary mb-3" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Views</p>
                                <p className="text-3xl font-black text-secondary">{myProperties.reduce((a, p) => a + (p.views || 0), 0)}</p>
                            </div>
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                                <TrendingUp className="w-5 h-5 text-green-500 mb-3" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                <p className="text-sm font-black text-green-500">Active</p>
                            </div>
                        </div>

                        {/* My Listings */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black text-secondary uppercase">
                                    My <span className="text-primary italic">Listings</span>
                                </h3>
                                <Link to="/post-property" className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20">
                                    <Plus className="w-3.5 h-3.5" /> Add Property
                                </Link>
                            </div>
                            {loading ? (
                                <div className="h-64 bg-white rounded-[2rem] border border-slate-100 flex items-center justify-center text-slate-400 font-bold">Loading...</div>
                            ) : myProperties.length > 0 ? (
                                <div className="space-y-4">
                                    {myProperties.map((p) => (
                                        <div key={p._id} className="bg-white p-5 rounded-[2rem] border border-slate-100 hover:border-primary/20 shadow-sm hover:shadow-md transition-all flex gap-5 items-center group">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                                                <img src={getImgSrc(p.images)} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <h4 className="font-black text-secondary truncate mb-1">{p.title}</h4>
                                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3 text-primary" /> {p.location}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-6 shrink-0">
                                                <div className="text-center">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase">Views</p>
                                                    <p className="font-black text-secondary">{p.views || 0}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase">Price</p>
                                                    <p className="font-black text-primary text-sm">₹{p.price.toLocaleString('en-IN')}</p>
                                                </div>
                                                <span className="px-3 py-1 bg-green-50 text-green-600 text-[9px] font-black uppercase rounded-lg">Live</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-100 p-16 text-center">
                                    <Building2 className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                                    <p className="font-black text-secondary mb-2">No listings yet</p>
                                    <Link to="/post-property" className="btn-primary px-8 py-3 rounded-xl font-black text-sm inline-flex items-center gap-2 mt-4">
                                        <Plus className="w-4 h-4" /> Post First Property
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Tabbed: Inquiries / Offers / Visits */}
                        <div>
                            {/* Tab Nav */}
                            <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-fit">
                                {(['inquiries', 'offers', 'visits'] as const).map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5 ${activeTab === tab ? 'bg-secondary text-white shadow' : 'text-slate-400 hover:text-secondary'
                                            }`}
                                    >
                                        {tab}
                                        {tab === 'inquiries' && inquiries.length > 0 && <span className="bg-primary text-white rounded-full w-4 h-4 text-[8px] flex items-center justify-center">{inquiries.length}</span>}
                                        {tab === 'offers' && offers.length > 0 && <span className="bg-amber-500 text-white rounded-full w-4 h-4 text-[8px] flex items-center justify-center">{offers.length}</span>}
                                        {tab === 'visits' && visits.length > 0 && <span className="bg-blue-500 text-white rounded-full w-4 h-4 text-[8px] flex items-center justify-center">{visits.length}</span>}
                                    </button>
                                ))}
                            </div>

                            {/* Inquiries Tab */}
                            {activeTab === 'inquiries' && (
                                inquiries.length > 0 ? (
                                    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                                        <table className="w-full">
                                            <thead className="bg-slate-50 border-b border-slate-100">
                                                <tr>
                                                    {['From', 'Property', 'Message', 'Status'].map(h => (
                                                        <th key={h} className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {inquiries.map((inq) => (
                                                    <tr key={inq._id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <p className="font-black text-secondary text-sm">{inq.senderName}</p>
                                                            <p className="text-xs text-slate-400">{inq.senderEmail}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-xs font-bold text-primary truncate max-w-[150px]">{inq.propertyId?.title || '—'}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-xs text-slate-500 truncate max-w-[200px]">{inq.message}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 text-[9px] font-black uppercase rounded-lg ${inq.status === 'unread' ? 'bg-blue-50 text-blue-600' :
                                                                inq.status === 'replied' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-500'
                                                                }`}>{inq.status}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-100 p-12 text-center">
                                        <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                                        <p className="font-black text-secondary">No inquiries yet</p>
                                        <p className="text-sm text-slate-400 mt-2">Buyer inquiries will appear here.</p>
                                    </div>
                                )
                            )}

                            {/* Offers Tab */}
                            {activeTab === 'offers' && (
                                offers.length > 0 ? (
                                    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                                        <table className="w-full">
                                            <thead className="bg-slate-50 border-b border-slate-100">
                                                <tr>
                                                    {['Buyer', 'Property', 'Offer Amount', 'Status', 'Date'].map(h => (
                                                        <th key={h} className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {offers.map((o) => (
                                                    <tr key={o._id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <p className="font-black text-secondary text-sm">{o.buyerName}</p>
                                                            <p className="text-xs text-slate-400">{o.buyerEmail}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-xs font-bold text-primary truncate max-w-[130px]">{o.propertyId?.title || '—'}</p>
                                                            {o.propertyId?.price && <p className="text-[10px] text-slate-400">Ask: ₹{o.propertyId.price.toLocaleString('en-IN')}</p>}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="font-black text-secondary text-sm">₹{o.offerAmount.toLocaleString('en-IN')}</p>
                                                            {o.note && <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{o.note}</p>}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 text-[9px] font-black uppercase rounded-lg ${o.status === 'accepted' ? 'bg-green-50 text-green-600' :
                                                                o.status === 'rejected' ? 'bg-red-50 text-red-500' :
                                                                    o.status === 'countered' ? 'bg-amber-50 text-amber-600' :
                                                                        'bg-blue-50 text-blue-600'
                                                                }`}>{o.status}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-xs text-slate-400">
                                                            {new Date(o.createdAt).toLocaleDateString('en-IN')}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {o.status === 'pending' && (
                                                                <div className="flex gap-2">
                                                                    <button onClick={() => handleOfferStatus(o._id, 'accepted')} className="px-2 py-1 bg-green-500 text-white text-[8px] font-black uppercase rounded-lg hover:bg-green-600 transition-colors">Accept</button>
                                                                    <button onClick={() => handleOfferStatus(o._id, 'rejected')} className="px-2 py-1 bg-red-500 text-white text-[8px] font-black uppercase rounded-lg hover:bg-red-600 transition-colors">Reject</button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-100 p-12 text-center">
                                        <Bell className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                                        <p className="font-black text-secondary">No offers yet</p>
                                        <p className="text-sm text-slate-400 mt-2">Buyer offers on your properties appear here.</p>
                                    </div>
                                )
                            )}

                            {/* Visits Tab */}
                            {activeTab === 'visits' && (
                                visits.length > 0 ? (
                                    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                                        <table className="w-full">
                                            <thead className="bg-slate-50 border-b border-slate-100">
                                                <tr>
                                                    {['Visitor', 'Property', 'Date & Time', 'Status'].map(h => (
                                                        <th key={h} className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {visits.map((v) => (
                                                    <tr key={v._id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <p className="font-black text-secondary text-sm">{v.visitorName}</p>
                                                            <p className="text-xs text-slate-400">{v.visitorPhone || '—'}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-xs font-bold text-primary truncate max-w-[140px]">{v.propertyId?.title || '—'}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-sm font-black text-secondary">{v.visitDate}</p>
                                                            <p className="text-xs text-slate-400">{v.visitTime}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 text-[9px] font-black uppercase rounded-lg ${v.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                                                                v.status === 'cancelled' ? 'bg-red-50 text-red-500' :
                                                                    v.status === 'completed' ? 'bg-slate-100 text-slate-500' :
                                                                        'bg-amber-50 text-amber-600'
                                                                }`}>{v.status}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            {v.status === 'pending' && (
                                                                <div className="flex gap-2 justify-end">
                                                                    <button onClick={() => handleVisitStatus(v._id, 'confirmed')} className="px-2 py-1 bg-secondary text-white text-[8px] font-black uppercase rounded-lg hover:bg-slate-700 transition-colors">Confirm</button>
                                                                    <button onClick={() => handleVisitStatus(v._id, 'cancelled')} className="px-2 py-1 bg-slate-100 text-slate-500 text-[8px] font-black uppercase rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-100 p-12 text-center">
                                        <ArrowRight className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                                        <p className="font-black text-secondary">No visits scheduled</p>
                                        <p className="text-sm text-slate-400 mt-2">Visit requests from buyers appear here.</p>
                                    </div>
                                )
                            )}
                        </div>

                    </div>
                )}

                {/* ════════════ ADMIN VIEW ════════════ */}
                {user.role === 'admin' && (
                    <div className="space-y-8">
                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="bg-secondary p-6 rounded-[2rem] shadow-xl">
                                <Users className="w-5 h-5 text-primary mb-3" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Users</p>
                                <p className="text-3xl font-black text-white">{users.length}</p>
                            </div>
                            <div className="bg-primary p-6 rounded-[2rem] shadow-xl shadow-primary/20">
                                <Building2 className="w-5 h-5 text-white/60 mb-3" />
                                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Total Properties</p>
                                <p className="text-3xl font-black text-white">{myProperties.length}</p>
                            </div>
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                                <MessageSquare className="w-5 h-5 text-primary mb-3" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Inquiries</p>
                                <p className="text-3xl font-black text-secondary">{inquiries.length}</p>
                            </div>
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                                <Eye className="w-5 h-5 text-primary mb-3" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Views</p>
                                <p className="text-3xl font-black text-secondary">{myProperties.reduce((a, p) => a + (p.views || 0), 0)}</p>
                            </div>
                        </div>

                        {/* Quick Admin Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Link to="/admin" className="bg-secondary p-8 rounded-[2rem] flex items-center gap-5 hover:opacity-90 transition-opacity group">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <ShieldCheck className="w-7 h-7 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Access</p>
                                    <h3 className="text-xl font-black text-white">Admin Panel</h3>
                                    <p className="text-xs text-slate-500 mt-1">Manage users, roles & all listings</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-500 ml-auto group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/listings" className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:border-primary/20 transition-colors group">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                                    <Building2 className="w-7 h-7 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Registry</p>
                                    <h3 className="text-xl font-black text-secondary">All Properties</h3>
                                    <p className="text-xs text-slate-400 mt-1">{myProperties.length} active listings</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300 ml-auto group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Users Table */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black text-secondary uppercase">
                                    Registered <span className="text-primary italic">Users</span>
                                </h3>
                                <Link to="/admin" className="text-xs font-black text-primary hover:underline uppercase tracking-widest">
                                    Full Management →
                                </Link>
                            </div>
                            <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">User</th>
                                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Role</th>
                                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Email</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {users.slice(0, 8).map((u) => (
                                            <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center font-black text-primary text-xs">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <span className="font-black text-secondary text-sm">{u.name}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${u.role === 'admin' ? 'bg-red-50 text-red-500' :
                                                        u.role === 'seller' ? 'bg-blue-50 text-blue-500' :
                                                            'bg-primary/10 text-primary'
                                                        }`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-xs text-slate-400">{u.email}</p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Properties */}
                        <div>
                            <h3 className="text-xl font-black text-secondary uppercase mb-6">
                                Latest <span className="text-primary italic">Properties</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {myProperties.slice(0, 6).map((p) => (
                                    <Link
                                        to={`/property-detail?id=${p._id}`}
                                        key={p._id}
                                        className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:border-primary/20 shadow-sm hover:shadow-md transition-all group"
                                    >
                                        <div className="h-36 overflow-hidden">
                                            <img src={getImgSrc(p.images)} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-black text-secondary text-sm mb-1 line-clamp-1">{p.title}</h4>
                                            <div className="flex justify-between items-center">
                                                <p className="font-black text-primary text-sm">₹{p.price.toLocaleString('en-IN')}</p>
                                                <span className="flex items-center gap-1 text-[9px] text-slate-400 font-bold">
                                                    <Eye className="w-3 h-3" /> {p.views || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
