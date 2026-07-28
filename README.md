# PropertyPro

Full-stack real estate marketplace with JWT authentication (refresh-token rotation, bcrypt password hashing), Cloudinary-backed image uploads, and a MongoDB/Mongoose data layer. Deployed on Vercel.

Live demo: https://property-pro-gules.vercel.app

## Tech Stack

Backend: Node.js, Express, TypeScript, MongoDB (Mongoose), JWT auth, bcrypt, Helmet, Zod validation, Multer + Cloudinary for image storage, Nodemailer.

Frontend: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router.

## Features

Property listings with image upload via Cloudinary. JWT-based auth with refresh token rotation. Input validation with Zod. Separate frontend and backend deployments on Vercel.

## Running locally

Backend:
```
cd backend
npm install
npm run dev
```

Frontend (separate terminal):
```
cd frontend
npm install
npm run dev
```

Copy .env.example to .env in both backend/ and frontend/ and fill in your own MongoDB URI, JWT secret, and Cloudinary credentials.
