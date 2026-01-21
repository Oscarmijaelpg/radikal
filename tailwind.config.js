/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./screens/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                display: ['"Outfit"', 'sans-serif'],
                body: ['"Inter"', 'sans-serif'],
                mono: ['"Fira Code"', 'monospace'],
                tech: ['"Space Grotesk"', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#D946EF', // Fuchsia 500
                    hover: '#C026D3',   // Fuchsia 600
                    light: '#FAE8FF',   // Fuchsia 50
                },
                secondary: "#2DD4BF", // Mint Teal
                "radikal-fuchsia": "#E889E2",
                "radikal-mint": "#2DD4BF",
                "radikal-purple": "#A855F7",
                "background-light": "#F8FAFC",
                "background-dark": "#0F172A",
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'fade-in': 'fadeIn 0.5s ease-out',
                'spin-slow': 'spin 3s linear infinite',
                'blink': 'blink 1s infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                blink: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0' },
                }
            },
            boxShadow: {
                'glass-lg': '0 20px 50px rgba(0, 0, 0, 0.08), 0 1px 1px rgba(255, 255, 255, 0.8) inset',
                'glass-sm': '0 10px 30px rgba(0, 0, 0, 0.04), 0 1px 1px rgba(255, 255, 255, 1) inset',
            }
        },
    },
    plugins: [],
}
