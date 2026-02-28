import { MapPin, Phone, Mail, Check, Heart, Share2, ArrowLeft, Image as ImageIcon, X, Calendar, IndianRupee, Send, CheckCircle } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import EMICalculator from '../components/EMICalculator';

interface Property {
    _id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    type: string;
    images: string[];
    amenities: string[];
}

// ─── Reusable Modal Wrapper ─────────────────────────────────
const Modal = ({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                    <h3 className="font-black text-secondary text-lg">{title}</h3>
                    <button onClick={onClose} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="px-8 py-6">{children}</div>
            </div>
        </div>
    );
};

// ─── Success Banner ────────────────────────────────────────────
const SuccessBanner = ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div className="fixed bottom-6 right-6 z-[2000] bg-green-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
        <CheckCircle className="w-5 h-5 shrink-0" />
        <span className="font-bold text-sm">{message}</span>
        <button onClick={onClose} className="ml-2 opacity-75 hover:opacity-100"><X className="w-4 h-4" /></button>
    </div>
);

const PropertyDetail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const propertyId = searchParams.get('id');
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [contactRevealed, setContactRevealed] = useState(false);

    // Modal states
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [showVisitModal, setShowVisitModal] = useState(false);
    const [showInquiryModal, setShowInquiryModal] = useState(false);
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Offer form
    const [offerAmount, setOfferAmount] = useState('');
    const [offerNote, setOfferNote] = useState('');

    // Visit form
    const [visitDate, setVisitDate] = useState('');
    const [visitTime, setVisitTime] = useState('10:00');
    const [visitName, setVisitName] = useState('');
    const [visitPhone, setVisitPhone] = useState('');

    // Inquiry form
    const [inquiryMsg, setInquiryMsg] = useState('');

    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');

    const showSuccess = (msg: string) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(''), 5000);
    };

    useEffect(() => {
        const fetchProperty = async () => {
            if (!propertyId) return;
            try {
                const response = await fetch(`http://localhost:5001/api/properties/${propertyId}`);
                const data = await response.json();
                if (response.ok) setProperty(data);
            } catch (err) {
                console.error('Error fetching property:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [propertyId]);

    // Pre-fill user info in forms
    useEffect(() => {
        if (user) {
            setVisitName(user.name || '');
            setInquiryMsg(`Hi, I'm interested in this property and would like more information.`);
            if (property) {
                setOfferAmount(property.price.toString());
            }
        }
    }, [user, property]);

    useEffect(() => {
        const incrementView = async () => {
            if (propertyId) {
                try {
                    await fetch(`http://localhost:5001/api/properties/${propertyId}/view`, { method: 'PUT' });
                } catch { }
            }
        };
        incrementView();
    }, [propertyId]);

    const handleSave = async () => {
        if (!token) return navigate('/login');
        try {
            const res = await fetch('http://localhost:5001/api/users/toggle-save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ propertyId })
            });
            const data = await res.json();
            if (res.ok) {
                setIsSaved(data.isSaved);
                showSuccess(data.isSaved ? 'Property saved to your list!' : 'Property removed from saved list.');
            }
        } catch (err) {
            console.error('Save failed:', err);
        }
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            showSuccess('Link copied to clipboard!');
        } catch {
            showSuccess('Copy this URL: ' + window.location.href);
        }
    };

    const handleOffer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return navigate('/login');
        setSubmitting(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/offers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    propertyId: property!._id,
                    offerAmount: Number(offerAmount),
                    note: offerNote,
                    buyerPhone: visitPhone
                })
            });
            const data = await res.json();
            if (res.ok) {
                setShowOfferModal(false);
                showSuccess('Your offer has been submitted! The seller will contact you soon.');
                setOfferNote('');
            } else {
                showSuccess(data.message || 'Failed to submit offer.');
            }
        } catch (err) {
            console.error('Offer failed:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleVisit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return navigate('/login');
        setSubmitting(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/visits`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    propertyId: property!._id,
                    visitorName: visitName,
                    visitorPhone: visitPhone,
                    visitDate,
                    visitTime
                })
            });
            const data = await res.json();
            if (res.ok) {
                setShowVisitModal(false);
                showSuccess(`Visit scheduled for ${visitDate} at ${visitTime}! You'll be contacted to confirm.`);
            } else {
                showSuccess(data.message || 'Failed to book visit.');
            }
        } catch (err) {
            console.error('Visit booking failed:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleInquiry = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return navigate('/login');
        setSubmitting(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/inquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    propertyId: property!._id,
                    message: inquiryMsg,
                    senderPhone: visitPhone
                })
            });
            const data = await res.json();
            if (res.ok) {
                setShowInquiryModal(false);
                showSuccess('Inquiry sent! The seller will get back to you soon.');
            } else {
                showSuccess(data.message || 'Failed to send inquiry.');
            }
        } catch (err) {
            console.error('Inquiry failed:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center pt-32"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
    }

    if (!property) {
        return <div className="min-h-screen flex items-center justify-center pt-32"><p className="text-2xl font-black text-secondary">Property not found</p></div>;
    }

    const getImgSrc = (img: string) => img?.startsWith('/uploads') ? `http://localhost:5001${img}` : img;
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <div className="bg-slate-50 min-h-screen pt-32">
            {/* Success Banner */}
            {success && <SuccessBanner message={success} onClose={() => setSuccess('')} />}

            {/* ── Make an Offer Modal ── */}
            <Modal open={showOfferModal} onClose={() => setShowOfferModal(false)} title="Make an Offer">
                <form onSubmit={handleOffer} className="space-y-5">
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Your Offer (₹)</label>
                        <div className="relative">
                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                            <input
                                type="number"
                                value={offerAmount}
                                onChange={e => setOfferAmount(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl font-black text-secondary focus:ring-2 focus:ring-primary/20 border-0 text-lg"
                                placeholder="Enter your offer"
                                required
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 font-bold">Asking price: ₹{property.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Phone Number</label>
                        <input
                            type="tel"
                            value={visitPhone}
                            onChange={e => setVisitPhone(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 rounded-2xl font-semibold text-secondary focus:ring-2 focus:ring-primary/20 border-0"
                            placeholder="+91 98765 43210"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Additional Note (optional)</label>
                        <textarea
                            value={offerNote}
                            onChange={e => setOfferNote(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 rounded-2xl font-semibold text-secondary focus:ring-2 focus:ring-primary/20 border-0 min-h-[80px] resize-none"
                            placeholder="Any conditions or notes for the seller..."
                        />
                    </div>
                    <button
                        type="submit" disabled={submitting}
                        className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                        {submitting ? 'Submitting...' : 'Submit Offer'}
                    </button>
                </form>
            </Modal>

            {/* ── Schedule a Visit Modal ── */}
            <Modal open={showVisitModal} onClose={() => setShowVisitModal(false)} title="Schedule a Visit">
                <form onSubmit={handleVisit} className="space-y-5">
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Your Name</label>
                        <input
                            type="text"
                            value={visitName}
                            onChange={e => setVisitName(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 rounded-2xl font-semibold text-secondary focus:ring-2 focus:ring-primary/20 border-0"
                            placeholder="Your full name"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Phone Number</label>
                        <input
                            type="tel"
                            value={visitPhone}
                            onChange={e => setVisitPhone(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 rounded-2xl font-semibold text-secondary focus:ring-2 focus:ring-primary/20 border-0"
                            placeholder="+91 98765 43210"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Preferred Date</label>
                            <input
                                type="date"
                                value={visitDate}
                                min={minDate}
                                onChange={e => setVisitDate(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 rounded-2xl font-semibold text-secondary focus:ring-2 focus:ring-primary/20 border-0"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Preferred Time</label>
                            <select
                                value={visitTime}
                                onChange={e => setVisitTime(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 rounded-2xl font-semibold text-secondary focus:ring-2 focus:ring-primary/20 border-0"
                            >
                                {['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        type="submit" disabled={submitting}
                        className="w-full bg-secondary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Calendar className="w-4 h-4" />}
                        {submitting ? 'Booking...' : 'Confirm Visit'}
                    </button>
                </form>
            </Modal>

            {/* ── Send Inquiry Modal ── */}
            <Modal open={showInquiryModal} onClose={() => setShowInquiryModal(false)} title="Send Inquiry">
                <form onSubmit={handleInquiry} className="space-y-5">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Property</p>
                        <p className="font-black text-secondary">{property.title}</p>
                        <p className="text-sm text-primary font-bold">₹{property.price.toLocaleString('en-IN')}</p>
                    </div>
                    {!user && (
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-sm text-amber-700 font-bold">
                            Please <Link to="/login" className="underline">sign in</Link> to send an inquiry.
                        </div>
                    )}
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Phone (optional)</label>
                        <input
                            type="tel"
                            value={visitPhone}
                            onChange={e => setVisitPhone(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 rounded-2xl font-semibold text-secondary focus:ring-2 focus:ring-primary/20 border-0"
                            placeholder="+91 98765 43210"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Message</label>
                        <textarea
                            value={inquiryMsg}
                            onChange={e => setInquiryMsg(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 rounded-2xl font-semibold text-secondary focus:ring-2 focus:ring-primary/20 border-0 min-h-[100px] resize-none"
                            placeholder="Tell the seller what you'd like to know..."
                            required
                        />
                    </div>
                    <button
                        type="submit" disabled={submitting || !user}
                        className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Mail className="w-4 h-4" />}
                        {submitting ? 'Sending...' : 'Send Inquiry'}
                    </button>
                </form>
            </Modal>

            <section className="max-w-7xl mx-auto px-6 pb-20">
                <Link to="/listings" className="inline-flex items-center gap-2 text-secondary-light font-bold hover:text-primary transition-colors mb-8 group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to listings
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Gallery */}
                        <div className="bg-white rounded-[3rem] overflow-hidden shadow-premium border border-slate-100">
                            {property.images?.length > 0 ? (
                                <div className="grid grid-cols-2 gap-1">
                                    <img
                                        src={getImgSrc(property.images[0])}
                                        alt={property.title}
                                        className="col-span-2 h-80 object-cover"
                                    />
                                    {property.images.slice(1, 3).map((img, i) => (
                                        <img key={i} src={getImgSrc(img)} alt={`View ${i + 2}`} className="h-40 object-cover" />
                                    ))}
                                </div>
                            ) : (
                                <div className="h-80 flex items-center justify-center bg-slate-50">
                                    <ImageIcon className="w-16 h-16 text-slate-200" />
                                </div>
                            )}
                        </div>

                        {/* Property Info */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-slate-100">
                            <div>
                                <div className="flex flex-wrap items-center gap-4 mb-4">
                                    <span className={`px-4 py-1 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${property.type === 'rent' ? 'bg-blue-500' :
                                        property.type === 'commercial' ? 'bg-amber-500' : 'bg-primary shadow-primary/20'
                                        }`}>
                                        {property.type === 'rent' ? 'For Rent' : property.type === 'commercial' ? 'Commercial' : 'For Sale'}
                                    </span>
                                    <span className="px-4 py-1 bg-white text-secondary rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100">Featured</span>
                                </div>
                                <h1 className="text-4xl lg:text-5xl font-black text-secondary leading-tight mb-4">{property.title}</h1>
                                <p className="flex items-center gap-2 text-secondary-light font-bold">
                                    <MapPin className="w-5 h-5 text-primary" /> {property.location}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-slate-100">
                            <h3 className="text-2xl font-black text-secondary mb-6 border-l-4 border-primary pl-6 uppercase tracking-tight">Description</h3>
                            <p className="text-lg text-secondary-light leading-relaxed font-medium font-sans whitespace-pre-line">
                                {property.description}
                            </p>
                        </div>

                        {/* Amenities */}
                        {property.amenities?.length > 0 && (
                            <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-slate-100">
                                <h3 className="text-2xl font-black text-secondary mb-6 border-l-4 border-primary pl-6 uppercase tracking-tight">Features & Amenities</h3>
                                <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {property.amenities.map((amenity, i) => (
                                        <li key={i} className="flex items-center gap-3 text-secondary font-bold">
                                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                <Check className="w-4 h-4 text-primary" />
                                            </div>
                                            {amenity}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* EMI Calculator */}
                        <EMICalculator propertyPrice={property.price} />
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-[3rem] shadow-premium border border-slate-100 sticky top-36">
                            {/* Price + Save/Share */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <p className="text-3xl font-black text-secondary">₹{property.price.toLocaleString('en-IN')}</p>
                                    {property.type === 'rent' && <p className="text-sm text-slate-400 font-bold">per month</p>}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSave}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isSaved ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-secondary hover:text-primary hover:bg-primary/10'}`}
                                    >
                                        <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-secondary hover:text-primary hover:bg-primary/10 transition-all"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 mb-8">
                                <button
                                    onClick={() => token ? setShowOfferModal(true) : navigate('/login')}
                                    className="w-full bg-primary text-white py-4 rounded-2xl text-base font-black shadow-xl shadow-primary/20 uppercase tracking-wide hover:opacity-90 active:scale-95 transition-all"
                                >
                                    Make an Offer
                                </button>
                                <button
                                    onClick={() => token ? setShowVisitModal(true) : navigate('/login')}
                                    className="w-full py-4 bg-secondary text-white text-base font-black rounded-2xl hover:bg-slate-800 active:scale-95 transition-all uppercase tracking-wide"
                                >
                                    Schedule a Visit
                                </button>
                            </div>

                            {/* Agent Card */}
                            <div className="pt-6 border-t border-slate-100">
                                <div className="flex items-center gap-4 mb-5">
                                    <img src="/assets/pic-1.png" alt="Agent" className="w-14 h-14 rounded-full border-2 border-primary/20 p-1 object-cover" />
                                    <div>
                                        <p className="font-black text-secondary">Platform Agent</p>
                                        <p className="text-xs font-black text-primary uppercase tracking-widest">Premium Partner</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {/* Show Contact */}
                                    {contactRevealed ? (
                                        <div className="w-full flex items-center justify-center gap-3 py-4 text-sm font-bold text-green-600 bg-green-50 rounded-2xl border border-green-100">
                                            <Phone className="w-4 h-4" /> +91 98765 43210
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                if (!token) return navigate('/login');
                                                setContactRevealed(true);
                                            }}
                                            className="w-full flex items-center justify-center gap-3 py-4 text-sm font-bold text-secondary-light hover:text-primary hover:bg-primary/5 transition-all bg-slate-50 rounded-2xl"
                                        >
                                            <Phone className="w-4 h-4" /> Show Contact
                                        </button>
                                    )}

                                    {/* Send Inquiry */}
                                    <button
                                        onClick={() => token ? setShowInquiryModal(true) : navigate('/login')}
                                        className="w-full flex items-center justify-center gap-3 py-4 text-sm font-bold text-secondary-light hover:text-primary hover:bg-primary/5 transition-all bg-slate-50 rounded-2xl"
                                    >
                                        <Mail className="w-4 h-4" /> Send Inquiry
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PropertyDetail;
