/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#19e66f",
                "background-light": "#f6f8f7",
                "background-dark": "#112118",
                "dark-green": "#0a1a12",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
}
