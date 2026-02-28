import { useState, useEffect } from 'react';
import { Calculator, TrendingDown, IndianRupee } from 'lucide-react';

const EMICalculator = ({ propertyPrice }: { propertyPrice?: number }) => {
    const [loanAmount, setLoanAmount] = useState(propertyPrice || 5000000);
    const [interestRate, setInterestRate] = useState(8.5);
    const [tenure, setTenure] = useState(20);
    const [emi, setEmi] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);

    useEffect(() => {
        const r = interestRate / 12 / 100;
        const n = tenure * 12;
        const emiValue = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const rounded = Math.round(emiValue);
        setEmi(rounded);
        setTotalInterest(Math.round(rounded * n - loanAmount));
    }, [loanAmount, interestRate, tenure]);

    const fmt = (val: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    const SliderRow = ({
        label, value, displayValue, min, max, step, onChange, color = 'text-primary'
    }: { label: string; value: number; displayValue: string; min: number; max: number; step: number; onChange: (v: number) => void; color?: string }) => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</label>
                <span className={`text-base font-black ${color}`}>{displayValue}</span>
            </div>
            <input
                type="range" min={min} max={max} step={step} value={value}
                onChange={e => onChange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-slate-300 font-bold">
                <span>{min >= 100000 ? `₹${(min / 100000).toFixed(0)}L` : min}{min >= 100000 ? '' : min < 10 ? '%' : ' yr'}</span>
                <span>{max >= 100000 ? `₹${(max / 10000000).toFixed(0)}Cr` : max}{max >= 100000 ? '' : max < 20 ? '%' : ' yrs'}</span>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-premium overflow-hidden">
            {/* Header */}
            <div className="bg-secondary px-8 py-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                        <Calculator className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Tool</p>
                        <p className="font-black text-white text-lg leading-tight">EMI Calculator</p>
                    </div>
                </div>
                <p className="text-white/50 text-sm font-medium">
                    Estimate your monthly home loan repayment instantly.
                </p>
            </div>

            {/* Result Cards */}
            <div className="grid grid-cols-2 gap-4 p-6 bg-slate-50 border-b border-slate-100">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Monthly EMI</p>
                    <div className="flex items-baseline gap-1">
                        <IndianRupee className="w-4 h-4 text-primary shrink-0 mt-1" />
                        <span className="text-xl sm:text-2xl font-black text-secondary leading-none">
                            {emi.toLocaleString('en-IN')}
                        </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">per month</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Interest</p>
                    <div className="flex items-baseline gap-1">
                        <TrendingDown className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
                        <span className="text-xl sm:text-2xl font-black text-secondary leading-none">
                            {(totalInterest / 100000).toFixed(1)}L
                        </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">₹{totalInterest.toLocaleString('en-IN')}</p>
                </div>
            </div>

            {/* Sliders */}
            <div className="p-6 space-y-7">
                <SliderRow
                    label="Loan Amount"
                    value={loanAmount}
                    displayValue={fmt(loanAmount)}
                    min={100000} max={100000000} step={100000}
                    onChange={setLoanAmount}
                />
                <SliderRow
                    label="Interest Rate"
                    value={interestRate}
                    displayValue={`${interestRate}%`}
                    min={1} max={15} step={0.1}
                    onChange={setInterestRate}
                    color="text-amber-500"
                />
                <SliderRow
                    label="Loan Tenure"
                    value={tenure}
                    displayValue={`${tenure} yrs`}
                    min={1} max={30} step={1}
                    onChange={setTenure}
                    color="text-blue-500"
                />
            </div>

            {/* Breakdown bar */}
            <div className="px-6 pb-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Repayment Breakdown</p>
                <div className="h-3 rounded-full overflow-hidden flex">
                    <div
                        className="bg-primary h-full transition-all duration-500"
                        style={{ width: `${Math.round((loanAmount / (loanAmount + totalInterest)) * 100)}%` }}
                    />
                    <div className="bg-amber-400 h-full flex-1" />
                </div>
                <div className="flex justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        <span className="text-[10px] font-black text-slate-400">Principal {Math.round((loanAmount / (loanAmount + totalInterest)) * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span className="text-[10px] font-black text-slate-400">Interest {Math.round((totalInterest / (loanAmount + totalInterest)) * 100)}%</span>
                    </div>
                </div>
            </div>

            <div className="px-6 pb-6 text-center">
                <p className="text-[10px] text-slate-300 font-bold">
                    * For illustration only. Actual rates may vary.
                </p>
            </div>
        </div>
    );
};

export default EMICalculator;
