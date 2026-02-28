import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

const Auth = ({ mode = 'login' }: { mode?: 'login' | 'register' }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'buyer' as 'buyer' | 'seller'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    name: data.name,
                    email: data.email,
                    role: data.role
                }));
                navigate('/dashboard');
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch (err) {
            setError('Could not connect to the server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex relative overflow-hidden">
            <div className="hidden lg:flex w-1/2 bg-secondary items-center justify-center p-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/assets/home-bg.jpg')] opacity-20 bg-cover bg-center grayscale"></div>
                <h2 className="text-6xl font-black text-white leading-tight uppercase tracking-tighter relative z-10">
                    Unlock Your <br />
                    <span className="text-primary italic">Next Level</span> <br />
                    of Living
                </h2>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative">
                <div className="w-full max-w-md space-y-12">
                    <div className="space-y-4">
                        <Link to="/" className="text-secondary-light font-bold hover:text-primary transition-colors flex items-center gap-2">
                            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
                        </Link>
                        <h3 className="text-4xl font-black text-secondary uppercase tracking-tight">
                            {mode === 'login' ? 'Welcome back' : 'Create account'}
                        </h3>
                        <p className="text-secondary-light font-medium">
                            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                            <Link to={mode === 'login' ? '/register' : '/login'} className="text-primary font-black uppercase hover:underline">
                                {mode === 'login' ? 'Register' : 'Log In'}
                            </Link>
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
                            <p className="text-red-700 text-sm font-bold">{error}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {mode === 'register' && (
                            <div className="space-y-2">
                                <label className="text-xs font-black text-secondary-light uppercase flex items-center gap-2">
                                    <User className="w-3 h-3 text-primary" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Alex Carter"
                                    className="w-full bg-slate-50 border-none p-4 rounded-2xl font-semibold focus:ring-2 focus:ring-primary/20 transition-all"
                                    required={mode === 'register'}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-secondary-light uppercase flex items-center gap-2">
                                <Mail className="w-3 h-3 text-primary" /> Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="alex@domain.com"
                                className="w-full bg-slate-50 border-none p-4 rounded-2xl font-semibold focus:ring-2 focus:ring-primary/20 transition-all"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-secondary-light uppercase flex items-center gap-2">
                                <Lock className="w-3 h-3 text-primary" /> Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-slate-50 border-none p-4 rounded-2xl font-semibold focus:ring-2 focus:ring-primary/20 transition-all"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        {mode === 'register' && (
                            <div className="space-y-4 pt-2">
                                <label className="text-xs font-black text-secondary-light uppercase flex items-center gap-2">
                                    I am a...
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'buyer' })}
                                        className={`p-4 rounded-2xl border-2 transition-all font-black uppercase text-xs tracking-widest ${formData.role === 'buyer'
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-slate-100 text-secondary-light hover:border-slate-200'
                                            }`}
                                    >
                                        Buyer / Tenant
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'seller' })}
                                        className={`p-4 rounded-2xl border-2 transition-all font-black uppercase text-xs tracking-widest ${formData.role === 'seller'
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-slate-100 text-secondary-light hover:border-slate-200'
                                            }`}
                                    >
                                        Property Owner
                                    </button>
                                </div>
                            </div>
                        )}
                        <button
                            disabled={loading}
                            className="w-full btn-primary py-5 rounded-2xl text-xl font-black shadow-xl shadow-primary/20 uppercase flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    {mode === 'login' ? 'Log In' : 'Create Account'}
                                    <ArrowRight className="w-6 h-6" />
                                </>
                            )}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Auth;
