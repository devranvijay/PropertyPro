import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowDown, Star, Landmark, Users, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const StorySection = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });

    return (
        <motion.div
            ref={ref}
            animate={{ opacity: isInView ? 1 : 0.3, x: isInView ? 0 : -20 }}
            transition={{ duration: 0.8 }}
            className="min-h-[80vh] flex flex-col justify-center py-20"
        >
            {children}
        </motion.div>
    );
};

const About = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const opacity1 = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
    const opacity2 = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);
    const opacity3 = useTransform(scrollYProgress, [0.75, 1], [0, 1]);

    const stories = [
        {
            year: "2018",
            title: "The Fragmented Beginning",
            desc: "Real estate was a jungle of manual paperwork and untrusted agents. We saw the chaos and decided to build a bridge.",
            icon: <Target className="w-8 h-8" />
        },
        {
            year: "2020",
            title: "Digital Acceleration",
            desc: "When the world stopped, we moved faster. We launched our full-service digital portal, enabling remote property tours and secure payments.",
            icon: <Landmark className="w-8 h-8" />
        },
        {
            year: "2023",
            title: "10,000 Dreams Realized",
            desc: "A milestone of trust. We've helped over 10,000 families find their peace in the urban sprawl of modern cities.",
            icon: <Users className="w-8 h-8" />
        },
        {
            year: "Today",
            title: "The Standard of Tomorrow",
            desc: "We continue to redefine the boundary between technology and living space. Welcome to the PropertyPro era.",
            icon: <Star className="w-8 h-8" />
        }
    ];

    return (
        <div className="bg-white font-sans">
            {/* Hero Scroll Entry */}
            <section className="h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden bg-secondary">
                <div className="absolute inset-0 opacity-20 bg-[url('/assets/home-bg.jpg')] bg-cover bg-center grayscale"></div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="relative z-10"
                >
                    <h1 className="text-7xl lg:text-9xl font-black text-white italic tracking-tighter mb-6 uppercase">Our <br /><span className="text-primary NOT-italic">Story</span></h1>
                    <p className="text-2xl text-white/40 font-bold max-w-xl mx-auto uppercase tracking-widest">A journey through innovation and living spaces.</p>
                </motion.div>
                <div className="absolute bottom-12 animate-bounce flex flex-col items-center gap-2">
                    <p className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Scroll to start</p>
                    <ArrowDown className="text-primary w-6 h-6" />
                </div>
            </section>

            {/* Scrollytelling Container */}
            <div ref={containerRef} className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 relative">

                {/* Left side: Sticky Visuals */}
                <div className="hidden lg:block sticky top-0 h-screen flex items-center">
                    <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-50">
                        <motion.img
                            style={{ opacity: opacity1 }}
                            src="/assets/about-img.svg"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <motion.img
                            style={{ opacity: opacity2 }}
                            src="/assets/home-bg.jpg"
                            className="absolute inset-0 w-full h-full object-cover grayscale"
                        />
                        <motion.img
                            style={{ opacity: opacity3 }}
                            src="/assets/house-img-1.webp"
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Interactive Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent p-12 flex items-end">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full"
                            >
                                <div className="h-2 w-full bg-white/20 rounded-full">
                                    <motion.div
                                        style={{ width: scrollYProgress }}
                                        className="h-full bg-primary rounded-full shadow-lg shadow-primary/40"
                                    />
                                </div>
                                <p className="text-[10px] font-black text-white uppercase mt-4 tracking-widest flex justify-between">
                                    <span>Reading Progress</span>
                                    <span>{(scrollYProgress.get() * 100).toFixed(0)}%</span>
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Right side: Scrolling Story */}
                <div className="space-y-20 py-20 lg:py-[40vh]">
                    {stories.map((story, i) => (
                        <StorySection key={i}>
                            <span className="text-primary font-black text-2xl mb-4 inline-block tracking-tighter italic">{story.year}</span>
                            <div className="text-primary mb-6">{story.icon}</div>
                            <h2 className="text-4xl lg:text-6xl font-black text-secondary leading-tight uppercase mb-8">{story.title}</h2>
                            <p className="text-xl text-secondary-light leading-relaxed font-medium">
                                {story.desc}
                            </p>

                            {/* Mobile Visual */}
                            <div className="lg:hidden mt-12 h-64 rounded-2xl bg-slate-100 overflow-hidden">
                                <img src={i === 0 ? "/assets/about-img.svg" : i === 1 ? "/assets/home-bg.jpg" : "/assets/house-img-1.webp"} className="w-full h-full object-cover" />
                            </div>
                        </StorySection>
                    ))}
                </div>
            </div>

            {/* Ending CTA */}
            <section className="bg-secondary p-12 lg:p-24 text-center rounded-t-[4rem]">
                <h2 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-tight">Your story <br /><span className="text-primary italic">starts with us.</span></h2>
                <div className="flex flex-wrap justify-center gap-6">
                    <Link to="/listings" className="btn-primary px-12 py-5 text-xl font-black rounded-2xl">Start Searching</Link>
                    <Link to="/register" className="px-12 py-5 bg-white/5 border border-white/20 text-white font-black rounded-2xl hover:bg-white/10 transition-all text-xl text-center">Join the Team</Link>
                </div>
            </section>
        </div>
    );
};

export default About;
