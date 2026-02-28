import { useState, useEffect } from 'react';
import { Home, Send, Menu, X, Heart, ChevronDown, User, ArrowRight, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import PropertyTicker from './PropertyTicker';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<any>(null);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                setUser(null);
            }
        };

        checkAuth();
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsProfileOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdowns on route change
    useEffect(() => {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Buy', path: '/listings?type=buy' },
        { name: 'Rent', path: '/listings?type=rent' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-[1000] transition-all duration-300",
            scrolled ? "shadow-premium" : ""
        )}>
            <div className="bg-white border-b border-slate-100">
                <PropertyTicker />
            </div>
            <nav className={cn(
                "w-full transition-all duration-300 px-6 py-3",
                scrolled ? "bg-white shadow-lg py-2" : "bg-white border-b border-slate-100"
            )}>
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-black flex items-center gap-2 group">
                        <div className="bg-primary p-2.5 rounded-2xl group-hover:rotate-6 transition-transform shadow-xl shadow-primary/20 flex items-center justify-center">
                            <Home className="text-white w-6 h-6 border-2 border-white/20 rounded-md" />
                        </div>
                        <span className="tracking-tighter text-secondary">Property<span className="text-primary italic">Pro</span></span>
                    </Link>

                    {/* Navigation */}
                    <div className="hidden lg:flex items-center gap-10">
                        <ul className="flex items-center gap-8">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className={cn(
                                            "text-xs font-black uppercase tracking-widest transition-all hover:text-primary relative group",
                                            location.pathname === link.path ? "text-primary" : "text-secondary/60"
                                        )}
                                    >
                                        {link.name}
                                        <span className={cn(
                                            "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                                            location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
                                        )}></span>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="flex items-center gap-6 pl-8 border-l border-slate-200">
                            <Link to="/saved" className="p-2.5 text-secondary/60 hover:text-primary transition-colors bg-slate-50 border border-slate-100 rounded-xl relative group">
                                <Heart className="w-5 h-5 group-hover:fill-current" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-white scale-0 group-hover:scale-100 transition-transform"></span>
                            </Link>

                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-3 p-1.5 pr-4 bg-white border border-slate-100 rounded-2xl hover:border-primary/20 transition-all shadow-sm group"
                                    >
                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/5 group-hover:bg-primary group-hover:text-white transition-all text-primary font-black">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter leading-none mb-1">Signed In</p>
                                            <p className="text-sm font-black text-secondary group-hover:text-primary transition-colors">{user.name.split(' ')[0]}</p>
                                        </div>
                                        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", isProfileOpen && "rotate-180")} />
                                    </button>

                                    {/* Profile Menu */}
                                    {isProfileOpen && (
                                        <div className="absolute top-full right-0 mt-4 w-72 bg-white rounded-[2.5rem] shadow-premium border border-slate-100 overflow-hidden py-4 z-[1001] animate-in fade-in slide-in-from-top-4 duration-300">
                                            <div className="px-8 py-4 border-b border-slate-50 mb-4 bg-slate-50/50">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">User Account</p>
                                                <p className="font-black text-secondary break-all">{user.email}</p>
                                            </div>

                                            <div className="px-4 space-y-2">
                                                <Link to="/dashboard" className="flex items-center gap-4 px-6 py-4 rounded-2xl text-secondary hover:bg-primary/5 hover:text-primary transition-all group">
                                                    <LayoutDashboard className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                                                    <span className="font-bold text-sm">My Dashboard</span>
                                                </Link>

                                                {user.role === 'admin' && (
                                                    <Link to="/admin" className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all group">
                                                        <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                        <span className="font-extrabold text-sm uppercase tracking-tighter">Admin Panel</span>
                                                    </Link>
                                                )}

                                                <Link to="/saved" className="flex items-center gap-4 px-6 py-4 rounded-2xl text-secondary hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100">
                                                    <User className="w-5 h-5 text-slate-400" />
                                                    <span className="font-bold text-sm">Saved Properties</span>
                                                </Link>
                                            </div>

                                            <div className="mt-4 pt-4 px-4 border-t border-slate-50">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-400 hover:text-red-500 transition-all font-black text-xs uppercase tracking-[0.2em]"
                                                >
                                                    <X className="w-4 h-4" /> Log Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link to="/login" className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-secondary hover:text-primary transition-all bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 group">
                                    <User className="w-4 h-4 border-2 border-primary/20 rounded-full p-0.5 group-hover:scale-110 transition-transform" /> Sign In
                                </Link>
                            )}

                            <Link to="/post-property" className="bg-primary hover:primary-dark text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.1em] shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center gap-3 group relative overflow-hidden">
                                <span className="relative z-10">List Property</span>
                                <Send className="w-4 h-4 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                <div className="absolute top-0 left-0 w-full h-full bg-secondary-dark opacity-0 group-hover:opacity-10 transition-opacity"></div>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2 text-secondary bg-slate-100 rounded-xl"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation */}
            <div className={cn(
                "lg:hidden fixed inset-0 z-[-1] bg-white pt-28 px-6 transition-transform duration-500 ease-in-out",
                isMenuOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="flex flex-col h-full pb-10">
                    <ul className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    to={link.path}
                                    className={cn(
                                        "text-2xl font-black text-secondary flex justify-between items-center p-6 rounded-3xl transition-all",
                                        location.pathname === link.path ? "bg-primary/5 text-primary" : "bg-slate-50"
                                    )}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name} <ArrowRight className="w-5 h-5 opacity-20" />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-auto space-y-4">
                        {user ? (
                            <div className="bg-secondary p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                                <div className="relative z-10 flex flex-col gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/20 text-primary text-xl font-black">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Signed In</p>
                                            <p className="text-xl font-black text-white">{user.name}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            to="/dashboard"
                                            className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex flex-col gap-2 text-white transition-all"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <LayoutDashboard className="w-5 h-5 text-primary" />
                                            <span className="text-xs font-black uppercase">Dashboard</span>
                                        </Link>
                                        <Link
                                            to="/saved"
                                            className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex flex-col gap-2 text-white transition-all"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <Heart className="w-5 h-5 text-red-400" />
                                            <span className="text-xs font-black uppercase">Saved</span>
                                        </Link>
                                    </div>

                                    {user.role === 'admin' && (
                                        <Link
                                            to="/admin"
                                            className="bg-red-500/20 p-4 rounded-2xl flex items-center justify-between text-red-400 border border-red-500/20"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <span className="text-xs font-black uppercase flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Admin Panel</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className="w-full py-4 bg-white/5 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors"
                                    >
                                        Log Out
                                    </button>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary blur-[60px] opacity-10"></div>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center justify-center gap-4 p-8 bg-slate-900 text-white rounded-[2.5rem] text-xl font-black uppercase tracking-widest shadow-xl"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <User className="text-primary" /> Sign In
                            </Link>
                        )}
                        <Link
                            to="/post-property"
                            className="flex items-center justify-center gap-4 p-8 bg-primary text-white rounded-[2.5rem] text-xl font-black uppercase tracking-widest shadow-2xl shadow-primary/30"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Send className="w-5 h-5" /> List Property
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
