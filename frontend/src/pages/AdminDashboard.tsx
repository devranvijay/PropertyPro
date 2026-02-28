import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Eye, Building2, MessageSquare, ShieldCheck,
    Trash2, UserCheck, ArrowRight, MapPin, RefreshCw, Crown
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt?: string;
}

interface Property {
    _id: string;
    title: string;
    location: string;
    price: number;
    type: string;
    views: number;
    images: string[];
    owner?: { name: string; email: string };
}

interface Inquiry {
    _id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
    propertyId?: { title: string };
}

const AdminDashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'users' | 'properties' | 'inquiries'>('users');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const token = localStorage.getItem('token');

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [uRes, pRes, iRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/users/all`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/properties`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/contact/my`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            const [uData, pData, iData] = await Promise.all([uRes.json(), pRes.json(), iRes.json()]);
            if (uRes.ok) setUsers(Array.isArray(uData) ? uData : []);
            if (pRes.ok) setProperties(Array.isArray(pData) ? pData : []);
            if (iRes.ok) setInquiries(Array.isArray(iData) ? iData : []);
        } catch (err) {
            console.error('Admin fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Delete this user?')) return;
        setDeletingId(userId);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/users/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setUsers(prev => prev.filter(u => u._id !== userId));
        } catch (err) {
            console.error('Delete failed:', err);
        } finally {
            setDeletingId(null);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/users/${userId}/role`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            });
            if (res.ok) {
                setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
            }
        } catch (err) {
            console.error('Role update failed:', err);
        }
    };

    const stats = [
        { label: 'Total Users', value: users.length, icon: Users, color: 'bg-blue-500', light: 'bg-blue-50 text-blue-600' },
        { label: 'Properties', value: properties.length, icon: Building2, color: 'bg-primary', light: 'bg-primary/10 text-primary' },
        { label: 'Total Views', value: properties.reduce((a, p) => a + (p.views || 0), 0), icon: Eye, color: 'bg-purple-500', light: 'bg-purple-50 text-purple-600' },
        { label: 'Inquiries', value: inquiries.length, icon: MessageSquare, color: 'bg-amber-500', light: 'bg-amber-50 text-amber-600' },
    ];

    const getImgSrc = (images: string[]) => {
        const img = images?.[0];
        if (!img) return '/assets/house-img-1.webp';
        return img.startsWith('/uploads') ? `http://localhost:5001${img}` : img;
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-secondary rounded-2xl flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Super Admin</p>
                                <h1 className="text-2xl font-black text-secondary">Admin Control Panel</h1>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 font-medium">Full platform control — users, properties, inquiries</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchAll}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-500 hover:text-primary shadow-sm transition-all"
                        >
                            <RefreshCw className="w-4 h-4" /> Refresh
                        </button>
                        <Link to="/dashboard" className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
                            Dashboard <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${s.light}`}>
                                <s.icon className="w-5 h-5" />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                            <p className="text-3xl font-black text-secondary">{loading ? '—' : s.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Tab Nav */}
                <div className="flex gap-2 mb-8 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit">
                    {(['users', 'properties', 'inquiries'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-secondary text-white shadow-md' : 'text-slate-400 hover:text-secondary'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab: USERS */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between">
                            <h2 className="font-black text-secondary uppercase text-sm tracking-wide">All Registered Users ({users.length})</h2>
                        </div>
                        {loading ? (
                            <div className="p-8 space-y-4">{[1, 2, 3, 4, 5].map(i => <div key={i} className="h-14 bg-slate-50 rounded-2xl animate-pulse" />)}</div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                                            <th key={h} className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {users.map((u) => (
                                        <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${u.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <span className="font-black text-secondary text-sm">{u.name}</span>
                                                    {u.role === 'admin' && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-400">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border-0 cursor-pointer focus:ring-2 focus:ring-primary/20 ${u.role === 'admin' ? 'bg-red-50 text-red-600' :
                                                        u.role === 'seller' ? 'bg-blue-50 text-blue-600' :
                                                            'bg-primary/10 text-primary'
                                                        }`}
                                                >
                                                    <option value="buyer">Buyer</option>
                                                    <option value="seller">Seller</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-400">
                                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleDeleteUser(u._id)}
                                                    disabled={deletingId === u._id || u.role === 'admin'}
                                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title={u.role === 'admin' ? 'Cannot delete admin' : 'Delete user'}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Tab: PROPERTIES */}
                {activeTab === 'properties' && (
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-8 py-5 border-b border-slate-50">
                            <h2 className="font-black text-secondary uppercase text-sm tracking-wide">All Properties ({properties.length})</h2>
                        </div>
                        {loading ? (
                            <div className="p-8 grid grid-cols-3 gap-4">{[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-50 rounded-2xl animate-pulse" />)}</div>
                        ) : (
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {properties.map(p => (
                                    <Link
                                        to={`/property-detail?id=${p._id}`}
                                        key={p._id}
                                        className="group border border-slate-100 rounded-[1.5rem] overflow-hidden hover:border-primary/20 hover:shadow-md transition-all"
                                    >
                                        <div className="h-40 overflow-hidden relative">
                                            <img src={getImgSrc(p.images)} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <span className={`absolute top-3 left-3 px-3 py-1 text-[9px] font-black uppercase rounded-lg ${p.type === 'rent' ? 'bg-blue-500 text-white' :
                                                p.type === 'commercial' ? 'bg-amber-500 text-white' :
                                                    'bg-primary text-white'
                                                }`}>
                                                {p.type}
                                            </span>
                                            <span className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 text-white text-[9px] font-black px-2 py-1 rounded-lg">
                                                <Eye className="w-3 h-3" /> {p.views || 0}
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-black text-secondary text-sm mb-1 line-clamp-1">{p.title}</h3>
                                            <p className="text-xs text-slate-400 flex items-center gap-1 mb-2">
                                                <MapPin className="w-3 h-3 text-primary" /> {p.location}
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <p className="font-black text-primary text-sm">₹{p.price.toLocaleString('en-IN')}</p>
                                                <p className="text-[9px] text-slate-400 font-bold">{p.owner?.name || 'Demo Seller'}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Tab: INQUIRIES */}
                {activeTab === 'inquiries' && (
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-8 py-5 border-b border-slate-50">
                            <h2 className="font-black text-secondary uppercase text-sm tracking-wide">All Inquiries ({inquiries.length})</h2>
                        </div>
                        {loading ? (
                            <div className="p-8 space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse" />)}</div>
                        ) : inquiries.length === 0 ? (
                            <div className="p-16 text-center">
                                <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                                <p className="font-black text-secondary">No inquiries yet</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        {['From', 'Property', 'Message', 'Date'].map(h => (
                                            <th key={h} className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {inquiries.map(inq => (
                                        <tr key={inq._id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                                                        <UserCheck className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-secondary text-sm">{inq.name}</p>
                                                        <p className="text-[10px] text-slate-400">{inq.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-primary truncate max-w-[140px]">{inq.propertyId?.title || '—'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-xs text-slate-500 truncate max-w-[240px]">{inq.message}</p>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-400">
                                                {new Date(inq.createdAt).toLocaleDateString('en-IN')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
