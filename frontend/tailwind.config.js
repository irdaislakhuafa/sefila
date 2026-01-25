/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4F46E5',
                secondary: '#EC4899',
                background: '#F3F4F6',
                textPrimary: '#1F2937',
                success: '#10B981',
                warning: '#F59E0B',
            },
        },
    },
    plugins: [],
}
