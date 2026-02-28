/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#3b82f6', // Modern SaaS Blue
                    dark: '#2563eb',
                    light: '#60a5fa',
                },
                secondary: {
                    DEFAULT: '#0f172a', // Deep Slate
                    light: '#64748b',
                },
                accent: {
                    DEFAULT: '#f8fafc',
                    dark: '#f1f5f9',
                },
                success: '#10b981',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                montserrat: ['Montserrat', 'sans-serif'],
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
            },
            boxShadow: {
                'premium': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            }
        },
    },
    plugins: [],
}
