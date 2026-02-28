import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Property from './models/Property';

dotenv.config();

const seedProperties = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/propertypro');
        console.log('Connected to MongoDB...');

        // Get or create a seller user to own the properties
        let seller = await User.findOne({ email: 'seller@propertypro.com' });
        if (!seller) {
            const bcrypt = await import('bcryptjs');
            const hashed = await bcrypt.hash('Seller@123', 10);
            seller = await User.create({
                name: 'Demo Seller',
                email: 'seller@propertypro.com',
                password: hashed,
                role: 'seller'
            });
            console.log('Demo seller created: seller@propertypro.com / Seller@123');
        }

        const sellerId = seller._id;

        const properties = [
            {
                title: 'Luxurious 4BHK Villa in Jubilee Hills',
                description: 'A stunning 4BHK villa nestled in the prime locality of Jubilee Hills. Features a private garden, rooftop terrace, and floor-to-ceiling windows. The interior is crafted with Italian marble flooring, modular kitchen, and smart home automation. Perfect for families seeking luxury and privacy.',
                price: 18500000,
                location: 'Jubilee Hills, Hyderabad',
                type: 'buy',
                images: ['/assets/house-img-1.webp', '/assets/hall-img-1.webp', '/assets/kitchen-img-1.webp'],
                amenities: ['Swimming Pool', 'Garden', 'CCTV', 'Gym', 'Power Backup', 'Security'],
                owner: sellerId,
                views: 142
            },
            {
                title: 'Modern 3BHK Apartment in Bandra West',
                description: 'Premium 3BHK apartment with sea-facing views in the heart of Bandra West. Recently renovated with a contemporary design, offering an open-plan living area, a chef\'s kitchen, and a spacious balcony overlooking the Arabian Sea. Steps away from Bandstand Promenade.',
                price: 32000000,
                location: 'Bandra West, Mumbai',
                type: 'buy',
                images: ['/assets/house-img-2.webp', '/assets/hall-img-2.webp', '/assets/bathroom-img-1.webp'],
                amenities: ['Sea View', 'Gym', 'Parking', 'Security', '24/7 Water Supply', 'Power Backup'],
                owner: sellerId,
                views: 289
            },
            {
                title: 'Elegant 2BHK Flat for Rent in Koramangala',
                description: 'Bright and airy 2BHK flat in the vibrant Koramangala neighbourhood, ideal for working professionals. Comes fully furnished with a high-speed internet connection. Walking distance to popular cafes, restaurants, and metro connectivity.',
                price: 35000,
                location: 'Koramangala, Bengaluru',
                type: 'rent',
                images: ['/assets/house-img-3.jpg', '/assets/hall-img-3.webp', '/assets/kitchen-img-2.webp'],
                amenities: ['Furnished', 'WiFi', 'AC', 'Parking', 'Security', 'Laundry'],
                owner: sellerId,
                views: 198
            },
            {
                title: 'Spacious Commercial Office in Cyber City',
                description: 'A premium Grade-A commercial office space in DLF Cyber City, Gurugram. 2200 sq ft of open-plan workspace with 20 dedicated workstations, a boardroom, reception area, and a fully equipped pantry. Excellent connectivity and surrounded by top-tier corporates.',
                price: 250000,
                location: 'Cyber City, Gurugram',
                type: 'commercial',
                images: ['/assets/house-img-4.webp', '/assets/hall-img-4.webp'],
                amenities: ['Parking', 'CCTV', 'Power Backup', 'Lift', 'Security', 'Cafeteria'],
                owner: sellerId,
                views: 74
            },
            {
                title: 'Charming 3BHK Independent House in Indiranagar',
                description: 'A beautifully maintained 3BHK independent house in the posh Indiranagar locality. Features a private front garden, a large garage, and a terrace. The house has a traditional South Indian design with modern amenities, offering the best of both worlds.',
                price: 15000000,
                location: 'Indiranagar, Bengaluru',
                type: 'buy',
                images: ['/assets/house-img-5.webp', '/assets/hall-img-5.webp', '/assets/kitchen-img-3.webp'],
                amenities: ['Garden', 'Garage', 'Terrace', 'Solar Power', 'Water Harvesting', 'Security'],
                owner: sellerId,
                views: 315
            },
            {
                title: 'Cozy 1BHK Studio Apartment in Powai',
                description: 'A well-designed studio apartment in the lakeside Powai locality, perfect for young professionals. Comes with a modular kitchen, wooden flooring, and a compact balcony overlooking Powai Lake. Minutes away from Hiranandani Business Park and IIT Bombay.',
                price: 22000,
                location: 'Powai, Mumbai',
                type: 'rent',
                images: ['/assets/house-img-6.webp', '/assets/bathroom-img-2.webp'],
                amenities: ['Lake View', 'Gym', 'Parking', 'Security', 'Club House', 'Swimming Pool'],
                owner: sellerId,
                views: 412
            },
            {
                title: 'Premium Penthouse in Worli Sea Face',
                description: 'An ultra-luxury penthouse with 360-degree views of the Bandra-Worli Sea Link and the Arabian Sea. Spanning 5000 sq ft across two floors, it offers 5 bedrooms, a home theatre, a private terrace pool, and concierge services. An iconic address for the discerning buyer.',
                price: 120000000,
                location: 'Worli, Mumbai',
                type: 'buy',
                images: ['/assets/house-img-1.webp', '/assets/hall-img-6.webp', '/assets/bathroom-img-3.webp', '/assets/kitchen-img-4.webp'],
                amenities: ['Terrace Pool', 'Sea View', 'Home Theatre', 'Concierge', 'Valet Parking', 'Gym'],
                owner: sellerId,
                views: 987
            },
            {
                title: 'Affordable 2BHK Flat in Salt Lake City',
                description: 'A well-ventilated and affordable 2BHK apartment in the planned township of Salt Lake City. Close to IT hubs and educational institutions. The flat has a spacious drawing room, two bedrooms with wardrobes, and a dedicated car parking space.',
                price: 4500000,
                location: 'Salt Lake City, Kolkata',
                type: 'buy',
                images: ['/assets/house-img-2.webp', '/assets/hall-img-1.webp'],
                amenities: ['Parking', 'Security', 'Power Backup', '24/7 Water Supply', 'Park', 'CCTV'],
                owner: sellerId,
                views: 56
            },
            {
                title: '3BHK Duplex Villa in Whitefield',
                description: 'A modern duplex villa in the rapidly developing Whitefield area with premium finishes. The ground floor features an open plan kitchen and living space, while the first floor has 3 luxurious bedrooms with attached bathrooms. A private courtyard is an added attraction.',
                price: 9800000,
                location: 'Whitefield, Bengaluru',
                type: 'buy',
                images: ['/assets/house-img-3.jpg', '/assets/kitchen-img-5.webp', '/assets/bathroom-img-4.jpg'],
                amenities: ['Courtyard', 'Parking', 'Security', 'Garden', 'Solar Power', 'WiFi'],
                owner: sellerId,
                views: 231
            },
            {
                title: 'Retail Shop Space in Connaught Place',
                description: 'A prime retail shop space at one of Delhi\'s most iconic commercial addresses — Connaught Place. Ground floor unit with high footfall, a glass front facade, and ample storage at the back. Surrounded by top national and international brands, ideal for a premium retail venture.',
                price: 380000,
                location: 'Connaught Place, New Delhi',
                type: 'commercial',
                images: ['/assets/house-img-4.webp', '/assets/hall-img-2.webp'],
                amenities: ['High Footfall', 'Parking', 'CCTV', 'Security', 'Power Backup', 'Metro Nearby'],
                owner: sellerId,
                views: 88
            },
            {
                title: '4BHK Sea-View Apartment in Marine Drive',
                description: 'A grand 4BHK apartment on the famed Marine Drive, often called the \'Queen's Necklace\'. Experience the iconic Mumbai skyline and seafront from your living room. The apartment features premium woodwork, a private balcony, and a spacious study room.',
                price: 65000000,
                location: 'Marine Drive, Mumbai',
                type: 'buy',
                images: ['/assets/house-img-5.webp', '/assets/hall-img-3.webp', '/assets/bathroom-img-5.webp'],
                amenities: ['Sea View', 'Parking', 'Security', 'Club House', 'Power Backup', 'Premium Interiors'],
                owner: sellerId,
                views: 762
            },
            {
                title: 'Budget 2BHK for Rent in Madhapur',
                description: 'A clean and comfortable 2BHK apartment in the IT hub of Madhapur, Hyderabad. Semi-furnished with a attached parking space. Close to HITEC City, DLF Cyber City, and Mindspace. Excellent public transport and social infrastructure in the vicinity.',
                price: 18000,
                location: 'Madhapur, Hyderabad',
                type: 'rent',
                images: ['/assets/house-img-6.webp', '/assets/kitchen-img-6.webp'],
                amenities: ['Semi-Furnished', 'Parking', 'Security', 'Metro Nearby', '24/7 Water', 'CCTV'],
                owner: sellerId,
                views: 145
            },
            {
                title: 'Luxury 3BHK Apartment in Gomti Nagar',
                description: 'A premium 3BHK apartment in the most sought-after residential area of Lucknow — Gomti Nagar. The apartment offers a modern layout with Italian marble flooring, a designer kitchen, and large windows providing abundant natural light. The complex offers world-class amenities.',
                price: 8500000,
                location: 'Gomti Nagar, Lucknow',
                type: 'buy',
                images: ['/assets/house-img-1.webp', '/assets/hall-img-4.webp', '/assets/kitchen-img-1.webp'],
                amenities: ['Gym', 'Swimming Pool', 'Garden', 'Security', 'Power Backup', 'Club House'],
                owner: sellerId,
                views: 167
            },
            {
                title: 'Independent Floor in Sector 17, Chandigarh',
                description: 'A well-built independent floor in the well-planned Sector 17 of Chandigarh. The property has 3 bedrooms, 2 bathrooms, a spacious drawing room and a private lawn. The floor is part of a quiet, residential society with excellent civic infrastructure and 24/7 security.',
                price: 7200000,
                location: 'Sector 17, Chandigarh',
                type: 'buy',
                images: ['/assets/house-img-2.webp', '/assets/hall-img-5.webp', '/assets/bathroom-img-6.jpg'],
                amenities: ['Private Lawn', 'Parking', 'Security', 'Garden', 'Water Harvesting', 'Power Backup'],
                owner: sellerId,
                views: 203
            },
            {
                title: '1BHK Fully Furnished for Rent in HSR Layout',
                description: 'A fully furnished 1BHK apartment in the buzzing HSR Layout, Bengaluru. The apartment has been tastefully designed with all appliances included — washing machine, refrigerator, TV, and AC. Perfect for a working professional or a couple. Immediate occupancy available.',
                price: 25000,
                location: 'HSR Layout, Bengaluru',
                type: 'rent',
                images: ['/assets/house-img-3.jpg', '/assets/hall-img-6.webp', '/assets/kitchen-img-2.webp'],
                amenities: ['Fully Furnished', 'AC', 'WiFi', 'Washing Machine', 'Parking', 'Security'],
                owner: sellerId,
                views: 523
            },
        ];

        // Clear existing seeded properties (optional: only delete ones owned by demo seller)
        const existingCount = await Property.countDocuments({ owner: sellerId });
        if (existingCount > 0) {
            await Property.deleteMany({ owner: sellerId });
            console.log(`Cleared ${existingCount} existing properties for demo seller.`);
        }

        await Property.insertMany(properties);
        console.log(`✅ Successfully seeded ${properties.length} properties!`);
        console.log('Demo Seller Login: seller@propertypro.com / Seller@123');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding properties:', error);
        process.exit(1);
    }
};

seedProperties();
