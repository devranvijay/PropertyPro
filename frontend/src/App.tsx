import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Listings from './pages/Listings';
import PropertyDetail from './pages/PropertyDetail';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import PostProperty from './pages/PostProperty';
import Saved from './pages/Saved';
import { AnimatePresence } from 'framer-motion';

// Scroll to top on route change
function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-primary selection:text-white">
                <Header />
                <main className="flex-grow">
                    <AnimatePresence mode="wait">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/listings" element={<Listings />} />
                            <Route path="/view-property" element={<PropertyDetail />} />
                            <Route path="/property-detail" element={<PropertyDetail />} />

                            <Route path="/post-property" element={
                                <ProtectedRoute allowedRoles={['seller', 'admin']}>
                                    <PostProperty />
                                </ProtectedRoute>
                            } />

                            <Route path="/dashboard" element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } />

                            <Route path="/admin" element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } />

                            <Route path="/saved" element={
                                <ProtectedRoute allowedRoles={['buyer', 'admin']}>
                                    <Saved />
                                </ProtectedRoute>
                            } />

                            <Route path="/login" element={<Auth mode="login" />} />
                            <Route path="/register" element={<Auth mode="register" />} />
                        </Routes>
                    </AnimatePresence>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
