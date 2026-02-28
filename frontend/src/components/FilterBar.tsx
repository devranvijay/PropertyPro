import { useState } from 'react';
import { Search, ChevronDown, Filter, X, Check, IndianRupee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface FilterBarProps {
    className?: string;
    onSearch?: (filters: any) => void;
}

const FilterBar = ({ className, onSearch }: FilterBarProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [search, setSearch] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [activeBHK, setActiveBHK] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch({
                search,
                minPrice,
                maxPrice,
                bhk: activeBHK,
                type: selectedTypes
            });
        }
    };

    const bhkOptions = ['1 BHK', '2 BHK', '3 BHK', '4+ BHK'];
    const propertyTypes = ['Flat/Condo', 'Independent Villa', 'Studio', 'Penthouse', 'Commercial'];

    const toggleBHK = (bhk: string) => {
        setActiveBHK(prev =>
            prev.includes(bhk) ? prev.filter(b => b !== bhk) : [...prev, bhk]
        );
    };

    return (
        <div className={cn("w-full transition-all duration-500", className)}>
            <div className={cn(
                "bg-white rounded-[2.5rem] shadow-premium border border-slate-100 overflow-hidden transition-all duration-500",
                isExpanded ? "p-8 lg:p-12" : "p-4 lg:p-6"
            )}>
                <form className="space-y-8" onSubmit={handleSearchSubmit}>
                    {/* Main Search Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-end">
                        <div className="lg:col-span-5 space-y-2">
                            <label className="text-[10px] font-black text-secondary-light uppercase tracking-widest ml-1">Universal Search</label>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5 group-focus-within:scale-110 transition-transform" />
                                <input
                                    type="text"
                                    placeholder="Location, Landmark, or Project..."
                                    className="w-full bg-slate-50 border-none p-4 pl-12 rounded-2xl font-semibold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-3 space-y-2">
                            <label className="text-[10px] font-black text-secondary-light uppercase tracking-widest ml-1">Budget (Min - Max)</label>
                            <div className="flex items-center bg-slate-50 rounded-2xl p-1">
                                <div className="relative flex-grow">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary/50" />
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="w-full bg-transparent border-none p-3 pl-8 text-sm font-bold focus:ring-0"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                    />
                                </div>
                                <div className="h-4 w-px bg-slate-200"></div>
                                <div className="relative flex-grow">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary/50" />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="w-full bg-transparent border-none p-3 pl-8 text-sm font-bold focus:ring-0"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <button
                                type="button"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className={cn(
                                    "w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-black text-sm uppercase transition-all border-2",
                                    isExpanded
                                        ? "bg-secondary text-white border-secondary shadow-lg"
                                        : "bg-white text-secondary border-slate-100 hover:border-primary/20"
                                )}
                            >
                                <Filter className="w-4 h-4" />
                                More <span className="hidden xl:inline">Filters</span>
                                <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded ? "rotate-180" : "")} />
                            </button>
                        </div>

                        <div className="lg:col-span-2">
                            <button className="w-full bg-primary hover:bg-primary-dark text-white p-4 rounded-2xl font-black shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group transform active:scale-95">
                                Search Now
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                    <Check className="w-4 h-4" />
                                </motion.div>
                            </button>
                        </div>
                    </div>

                    {/* Expandable Advanced Options */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <div className="pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {/* BHK Chips */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Select Configuration</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {bhkOptions.map(bhk => (
                                                <button
                                                    key={bhk}
                                                    type="button"
                                                    onClick={() => toggleBHK(bhk)}
                                                    className={cn(
                                                        "px-5 py-2.5 rounded-xl text-xs font-black transition-all border-2",
                                                        activeBHK.includes(bhk)
                                                            ? "bg-primary/10 border-primary text-primary shadow-sm"
                                                            : "bg-slate-50 border-transparent text-secondary-light hover:bg-slate-100"
                                                    )}
                                                >
                                                    {bhk}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Property Type Grid */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Property Type</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {propertyTypes.map(type => (
                                                <label key={type} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors group">
                                                    <div className="relative w-5 h-5 rounded border-2 border-slate-200 group-hover:border-primary transition-colors flex items-center justify-center overflow-hidden">
                                                        <input
                                                            type="checkbox"
                                                            className="absolute inset-0 opacity-0 cursor-pointer peer"
                                                            checked={selectedTypes.includes(type)}
                                                            onChange={() => {
                                                                setSelectedTypes(prev =>
                                                                    prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
                                                                );
                                                            }}
                                                        />
                                                        <div className="w-full h-full bg-primary flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform">
                                                            <Check className="w-3.5 h-3.5 text-white" />
                                                        </div>
                                                    </div>
                                                    <span className="text-xs font-bold text-secondary">{type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Additional Amenities */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Possession Status</h4>
                                        <div className="space-y-3">
                                            {['Ready to Move', 'Under Construction'].map(status => (
                                                <label key={status} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className="w-5 h-5 rounded-full border-2 border-slate-200 group-hover:border-primary transition-colors flex items-center justify-center">
                                                        <input type="radio" name="status" className="absolute opacity-0 cursor-pointer peer" />
                                                        <div className="w-2.5 h-2.5 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                                                    </div>
                                                    <span className="text-sm font-bold text-secondary-light group-hover:text-secondary transition-colors">{status}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between items-center">
                                    <button
                                        type="reset"
                                        onClick={() => { setActiveBHK([]); setIsExpanded(false); }}
                                        className="text-xs font-black text-secondary-light hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-2"
                                    >
                                        <X className="w-4 h-4" /> Reset All Filters
                                    </button>
                                    <p className="text-[10px] font-black text-secondary-light uppercase hidden md:block">
                                        Showing properties based on your elite preferences
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>
        </div>
    );
};

export default FilterBar;
