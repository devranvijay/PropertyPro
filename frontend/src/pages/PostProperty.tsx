import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, Home, MapPin, IndianRupee, Info } from 'lucide-react';

const PostProperty = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        type: 'buy',
        amenities: [] as string[]
    });
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setImages(prev => [...prev, ...selectedFiles]);

            const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please login to post a property');
            setLoading(false);
            return;
        }

        try {
            let uploadedImageUrls = [];

            // 1. Upload Images if any
            if (images.length > 0) {
                const formDataUpload = new FormData();
                images.forEach(image => formDataUpload.append('images', image));

                const uploadRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/upload`, {
                    method: 'POST',
                    body: formDataUpload
                });

                if (!uploadRes.ok) throw new Error('Failed to upload images');
                const uploadData = await uploadRes.json();
                uploadedImageUrls = uploadData.imageUrls;
            } else {
                uploadedImageUrls = ['/assets/house-img-1.webp']; // Fallback
            }

            // 2. Create Property
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/properties`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                    images: uploadedImageUrls
                })
            });

            if (response.ok) {
                navigate('/listings');
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to create listing');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not connect to the server');
        } finally {
            setLoading(false);
        }
    };

    const toggleAmenity = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };
    return (
        <div className="bg-slate-50 min-h-screen pt-32 pb-20">
            <section className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-4xl lg:text-5xl font-black text-secondary leading-tight mb-4 uppercase tracking-tighter">
                        List Your <span className="text-primary italic">Property</span>
                    </h1>
                    <p className="text-lg text-secondary-light font-medium">Join our premium network and find the right buyer/tenant in 48 hours.</p>
                </motion.div>

                <div className="bg-white rounded-[3rem] shadow-premium border border-slate-100 overflow-hidden">
                    <div className="bg-secondary p-8 text-white flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                                <Plus className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight">New Listing</h2>
                        </div>
                        <span className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/50 border border-white/10">Step 1 of 3</span>
                    </div>

                    <form className="p-8 lg:p-12 space-y-10" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
                                <p className="text-red-700 text-sm font-bold">{error}</p>
                            </div>
                        )}
                        {/* Section: Basic Info */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-secondary-light uppercase tracking-[0.3em] border-l-4 border-primary pl-4">Basic Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-secondary">Property Name</label>
                                    <div className="relative">
                                        <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="e.g. Urban Skyview"
                                            className="w-full bg-slate-50 border-none p-4 pl-12 rounded-2xl font-semibold focus:ring-2 focus:ring-primary/20 transition-all"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-secondary">Price (₹)</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            className="w-full bg-slate-50 border-none p-4 pl-12 rounded-2xl font-semibold focus:ring-2 focus:ring-primary/20 transition-all"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-secondary">Description</label>
                                <textarea
                                    placeholder="Tell us about your property..."
                                    className="w-full bg-slate-50 border-none p-4 rounded-2xl font-semibold focus:ring-2 focus:ring-primary/20 transition-all min-h-[120px]"
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {/* Listing Type */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-secondary">Listing Type</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { value: 'buy', label: '🏠 For Sale', desc: 'Sell your property' },
                                        { value: 'rent', label: '🔑 For Rent', desc: 'Monthly rental' },
                                        { value: 'commercial', label: '🏢 Commercial', desc: 'Office / Shop' }
                                    ].map(opt => (
                                        <label
                                            key={opt.value}
                                            className={`flex flex-col gap-1 p-4 rounded-2xl cursor-pointer transition-all border-2 ${formData.type === opt.value ? 'border-primary bg-primary/5' : 'border-transparent bg-slate-50 hover:bg-slate-100'}`}
                                        >
                                            <input
                                                type="radio"
                                                name="type"
                                                value={opt.value}
                                                checked={formData.type === opt.value}
                                                onChange={() => setFormData({ ...formData, type: opt.value })}
                                                className="hidden"
                                            />
                                            <span className="font-black text-secondary text-sm">{opt.label}</span>
                                            <span className="text-[10px] text-slate-400 font-bold">{opt.desc}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Section: Location */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-secondary-light uppercase tracking-[0.3em] border-l-4 border-primary pl-4">Precise Location</h3>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Full Address, Zip Code..."
                                    className="w-full bg-slate-50 border-none p-4 pl-12 rounded-2xl font-semibold focus:ring-2 focus:ring-primary/20 transition-all"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Section: Features */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-secondary-light uppercase tracking-[0.3em] border-l-4 border-primary pl-4">Property Features</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['3 BHK', '2 Bath', 'Balcony', 'Parking', 'Pool', 'Gym', 'Garden', 'WiFi'].map(feature => (
                                    <label key={feature} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors border-2 border-transparent has-[:checked]:border-primary has-[:checked]:bg-primary/5 group">
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.amenities.includes(feature)}
                                            onChange={() => toggleAmenity(feature)}
                                        />
                                        <div className="w-5 h-5 border-2 border-slate-200 rounded flex items-center justify-center group-has-[:checked]:bg-primary group-has-[:checked]:border-primary">
                                            <div className="w-2 h-2 bg-white rounded-sm opacity-0 group-has-[:checked]:opacity-100 transition-opacity" />
                                        </div>
                                        <span className="text-sm font-bold text-secondary">{feature}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Section: Media */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-secondary-light uppercase tracking-[0.3em] border-l-4 border-primary pl-4">Exhibition Hub (Media)</h3>

                            {/* Previews */}
                            {previews.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {previews.map((preview, index) => (
                                        <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div
                                onClick={() => document.getElementById('image-upload')?.click()}
                                className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-12 text-center hover:border-primary/20 hover:bg-slate-50 transition-all cursor-pointer group"
                            >
                                <input
                                    type="file"
                                    id="image-upload"
                                    className="hidden"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary mb-6 group-hover:scale-110 transition-transform">
                                    <Upload className="w-8 h-8" />
                                </div>
                                <h4 className="text-xl font-black text-secondary mb-2">Drag & Drop Property Shots</h4>
                                <p className="text-sm text-secondary-light font-medium">Capture the best angles of your space. Max 10 images (JPEG, PNG, WebP).</p>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-5 rounded-2xl text-xl font-black shadow-xl shadow-primary/20 uppercase tracking-tighter disabled:opacity-50"
                            >
                                {loading ? 'Launching listing...' : 'Review & Launch Listing'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 flex items-center justify-center gap-4 text-secondary-light">
                    <Info className="w-5 h-5 text-primary" />
                    <p className="text-sm font-bold font-sans uppercase tracking-widest">Listing will be verified within 2 hours.</p>
                </div>
            </section>
        </div>
    );
};

export default PostProperty;
