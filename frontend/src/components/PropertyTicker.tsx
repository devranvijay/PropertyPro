import { motion } from 'framer-motion';

const PropertyTicker = () => {
    const feeds = [
        { label: 'JUST BOUGHT:', text: 'Penthouse in Worli, Mumbai', price: '₹14.2 Cr', time: '2m ago' },
        { label: 'NEW LISTING:', text: '3BHK in Gurgaon Phase 5', price: '₹4.5 Cr', time: '14m ago' },
        { label: 'SOLD FAST:', text: 'Studio in Bangalore North', price: '₹85 L', time: '41m ago' },
        { label: 'PRICE DROP:', text: 'Villa in Rajarhat, Kolkata', price: '₹1.2 Cr', time: '1h ago' },
        { label: 'HOT ASSET:', text: 'Commercial in Hyderabad', price: '₹8.9 Cr', time: '3h ago' },
    ];

    return (
        <div className="bg-white border-y border-slate-100 py-3 overflow-hidden whitespace-nowrap relative group">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

            <motion.div
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                className="inline-flex items-center gap-12"
            >
                {[...feeds, ...feeds].map((feed, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded uppercase tracking-tighter italic">{feed.label}</span>
                            <span className="text-sm font-bold text-secondary">{feed.text}</span>
                        </div>
                        <span className="text-sm font-black text-secondary border-l border-slate-200 pl-4">{feed.price}</span>
                        <span className="text-[10px] font-black text-secondary-light uppercase tracking-widest">{feed.time}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default PropertyTicker;
