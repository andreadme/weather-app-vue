/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                'weather-primary': '#ACD2FC',
                'weather-secondary': '#EC6E4C',
                'weather-tertiary': '#F8F8F8',
            },
            fontFamily: {
                Roboto: ['Roboto, sans-serif'],
                Overpass: ['Overpass, sans-serif'],
            },
            container: {
                center: true,
                padding: '2rem', 
            },
            screens: {
                'sm': '640px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1280px',
            }
        },
    },
    plugins: [],
}

