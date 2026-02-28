import { useEffect, useRef } from 'react';

const PrismBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Mouse parallax effect on blobs
        const el = containerRef.current;
        if (!el) return;
        const handleMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const cx = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
            const cy = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
            el.style.setProperty('--mx', `${cx}px`);
            el.style.setProperty('--my', `${cy}px`);
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden"
            style={{ zIndex: 0, background: '#060612' }}
        >
            <style>{`
                @keyframes prism-drift-1 {
                    0%, 100% { transform: translate(0%, 0%) scale(1); }
                    25% { transform: translate(8%, -12%) scale(1.1); }
                    50% { transform: translate(-5%, 8%) scale(0.95); }
                    75% { transform: translate(12%, 5%) scale(1.05); }
                }
                @keyframes prism-drift-2 {
                    0%, 100% { transform: translate(0%, 0%) scale(1); }
                    30% { transform: translate(-10%, 10%) scale(1.08); }
                    60% { transform: translate(6%, -8%) scale(0.92); }
                    80% { transform: translate(-4%, 4%) scale(1.12); }
                }
                @keyframes prism-drift-3 {
                    0%, 100% { transform: translate(0%, 0%) scale(1); }
                    20% { transform: translate(5%, 15%) scale(1.06); }
                    55% { transform: translate(-8%, -6%) scale(0.94); }
                    80% { transform: translate(10%, -10%) scale(1.1); }
                }
                @keyframes prism-drift-4 {
                    0%, 100% { transform: translate(0%, 0%) scale(1); }
                    35% { transform: translate(-12%, -5%) scale(1.07); }
                    70% { transform: translate(9%, 12%) scale(1.03); }
                }
                @keyframes shimmer-rotate {
                    0%, 100% { opacity: 0.6; transform: rotate(0deg) scale(1); }
                    50% { opacity: 1; transform: rotate(180deg) scale(1.1); }
                }
                .prism-noise {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
                    background-repeat: repeat;
                    background-size: 200px;
                    opacity: 0.035;
                }
            `}</style>

            {/* Blob 1 — Cyan/Teal — bottom left */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-5%',
                    width: '70%',
                    height: '65%',
                    borderRadius: '50% 60% 40% 70%',
                    background: 'radial-gradient(ellipse at center, rgba(0,220,200,0.55) 0%, rgba(0,180,160,0.3) 40%, transparent 70%)',
                    filter: 'blur(80px)',
                    animation: 'prism-drift-1 18s ease-in-out infinite',
                }}
            />

            {/* Blob 2 — Purple/Violet — center/upper */}
            <div
                style={{
                    position: 'absolute',
                    top: '-10%',
                    left: '20%',
                    width: '65%',
                    height: '70%',
                    borderRadius: '40% 60% 70% 30%',
                    background: 'radial-gradient(ellipse at center, rgba(130,60,255,0.5) 0%, rgba(100,40,200,0.28) 45%, transparent 70%)',
                    filter: 'blur(90px)',
                    animation: 'prism-drift-2 22s ease-in-out infinite',
                }}
            />

            {/* Blob 3 — Indigo/Blue — right side */}
            <div
                style={{
                    position: 'absolute',
                    top: '10%',
                    right: '-10%',
                    width: '55%',
                    height: '60%',
                    borderRadius: '60% 40% 50% 60%',
                    background: 'radial-gradient(ellipse at center, rgba(60,100,255,0.45) 0%, rgba(40,80,200,0.25) 45%, transparent 70%)',
                    filter: 'blur(85px)',
                    animation: 'prism-drift-3 25s ease-in-out infinite',
                }}
            />

            {/* Blob 4 — Green teal hint — bottom right */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '-15%',
                    right: '5%',
                    width: '45%',
                    height: '50%',
                    borderRadius: '50% 30% 60% 40%',
                    background: 'radial-gradient(ellipse at center, rgba(0,200,140,0.35) 0%, rgba(0,160,100,0.18) 45%, transparent 70%)',
                    filter: 'blur(75px)',
                    animation: 'prism-drift-4 20s ease-in-out infinite',
                }}
            />

            {/* Shimmer highlight stripe */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '-10%',
                    width: '120%',
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, rgba(0,220,200,0.8), rgba(130,60,255,0.8), rgba(0,200,140,0.7), transparent)',
                    animation: 'shimmer-rotate 8s ease-in-out infinite',
                    filter: 'blur(1px)',
                }}
            />

            {/* Noise texture overlay */}
            <div className="absolute inset-0 prism-noise" />

            {/* Dark vignette at top for text readability */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,6,18,0.5) 0%, transparent 100%)',
            }} />
        </div>
    );
};

export default PrismBackground;
