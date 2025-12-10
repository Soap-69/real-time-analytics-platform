/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // keep your dark theme vibes
                "rtap-bg": "#020617",        // slate-950-ish
                "rtap-panel": "#020617",
                "rtap-border": "#1f2937",
                "rtap-accent": "#6366f1",
            },
        },
    },
    plugins: [],
};
