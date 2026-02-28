import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                setStatus({ type: 'success', message: 'Message sent! We will get back to you soon.' });
                setFormData({ name: '', email: '', phone: '', message: '' });
            } else {
                setStatus({ type: 'error', message: data.message || 'Something went wrong.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Could not connect to the server.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white pt-32">
            <section className="section-padding grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-5xl lg:text-7xl font-black text-secondary leading-tight mb-8">
                        Let's <span className="text-primary italic">connect</span> <br />
                        and find your <br />
                        perfect space.
                    </h1>

                    <div className="space-y-8 mt-12">
                        <div className="flex items-center gap-6 group">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-secondary-light uppercase tracking-widest mb-1">Call us</p>
                                <p className="text-xl font-black text-secondary">+91 9987298618</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 group">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-secondary-light uppercase tracking-widest mb-1">Email us</p>
                                <p className="text-xl font-black text-secondary">devchiragyadav@gmail.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 group">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-secondary-light uppercase tracking-widest mb-1">Visit us</p>
                                <p className="text-xl font-black text-secondary">Powai, Mumbai 400072</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 lg:p-12 bg-white rounded-[3rem] shadow-premium border border-slate-100"
                >
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {status.type && (
                            <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 mb-6 ${status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {status.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                                {status.message}
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full bg-slate-50 border-none p-4 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-slate-50 border-none p-4 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            className="w-full bg-slate-50 border-none p-4 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <textarea
                            placeholder="Your Message..."
                            rows={5}
                            className="w-full bg-slate-50 border-none p-4 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-semibold resize-none"
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        ></textarea>
                        <button
                            className={`w-full btn-primary text-xl font-black py-5 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-opacity ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Message'} <Send className="w-6 h-6" />
                        </button>
                    </form>
                </motion.div>
            </section>
        </div>
    );
};

export default Contact;
