/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "rtap-bg":     "#f8fafc",   // page background (slate-50)
                "rtap-panel":  "#ffffff",   // card / panel
                "rtap-border": "#e2e8f0",   // border (slate-200)
                "rtap-accent": "#4f46e5",   // indigo-600
            },
            boxShadow: {
                card: "0 1px 3px 0 rgb(0 0 0 / .06), 0 1px 2px -1px rgb(0 0 0 / .06)",
            },
        },
    },
    plugins: [],
};
