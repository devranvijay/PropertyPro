import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, Home, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-secondary text-white font-sans mt-20 relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary blur-[150px] opacity-10 -mr-48 -mb-48"></div>

            <section className="max-w-7xl mx-auto py-20 px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 relative z-10">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link to="/" className="text-2xl font-black flex items-center gap-2">
                            <div className="bg-primary p-2 rounded-xl">
                                <Home className="text-white w-6 h-6" />
                            </div>
                            <span>Property<span className="text-primary">Pro</span></span>
                        </Link>
                        <p className="text-white/50 leading-relaxed font-medium">
                            Providing the next generation of real estate solutions. Smart, secure, and seamless property management for everyone.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 bg-white/5 hover:bg-primary rounded-xl flex items-center justify-center transition-all">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-black uppercase tracking-tighter italic border-l-2 border-primary pl-4">Platform</h4>
                        <div className="flex flex-col gap-4 text-white/60 font-medium">
                            <Link to="/listings" className="hover:text-primary transition-colors flex items-center gap-2 group">
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /> Listings
                            </Link>
                            <Link to="/about" className="hover:text-primary transition-colors flex items-center gap-2 group">
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /> Our Story
                            </Link>
                            <Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-2 group">
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /> Contact Us
                            </Link>
                            <Link to="/saved" className="hover:text-primary transition-colors flex items-center gap-2 group">
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /> Saved Properties
                            </Link>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6 lg:col-span-2">
                        <h4 className="text-lg font-black uppercase tracking-tighter italic border-l-2 border-primary pl-4">Contact Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <a href="tel:123" className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary"><Phone className="w-5 h-5" /></div>
                                    <span className="font-bold">+91 1800 200 400</span>
                                </a>
                                <a href="mailto:x" className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary"><Mail className="w-5 h-5" /></div>
                                    <span className="font-bold">hello@propertypro.io</span>
                                </a>
                            </div>
                            <div className="flex gap-4 items-start text-white/60">
                                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary shrink-0"><MapPin className="w-5 h-5" /></div>
                                <div>
                                    <p className="font-bold text-white">Headquarters</p>
                                    <p className="text-sm">BKC 400051, Mumbai, India</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="border-t border-white/5 py-8 text-center text-white/30 text-sm font-bold uppercase tracking-[0.2em]">
                &copy; {new Date().getFullYear()} PropertyPro Inc. // All Systems Operational
            </div>
        </footer>
    );
};

export default Footer;
