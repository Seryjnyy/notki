/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./components/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
        "../../packages/ui/src/components/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },

        extend: {
            fontFamily: {
                robotoMono: "Roboto Mono",
                jetbrains: "JetBrains Mono",
                plexMono: "IBM Plex Mono",
                reddit: "Reddit Sans",
                poppins: "Poppins",
            },
            colors: {
                background: "hsl(var(--sub-alt-color))",
                main: "hsl(var(--main-color))",
                sub: "hsl(var(--sub-color))",
                subAlt: "hsl(var(--sub-alt-color))",
                text: "hsl(var(--text-color))",
                error: "hsl(var(--error-color))",

                border: "hsl(var(--sub-color)/0.4)",
                input: "hsl(var(--sub-alt-color))",
                ring: "hsl(var(--text-color))",
                foreground: "hsl(var(--text-color))",
                primary: {
                    DEFAULT: "hsl(var(--main-color))",
                    foreground: "hsl(var(--bg-color))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--sub-color) /0.2)",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--error-color))",
                    foreground: "hsl(var(--bg-color))",
                },
                muted: {
                    DEFAULT: "hsl(var(--bg-color))",
                    foreground: "hsl(var(--text-color)/0.6)",
                },
                accent: {
                    DEFAULT: "hsl(var(--bg-color))",
                    foreground: "hsl(var(--text-color))",
                },
                popover: {
                    DEFAULT: "hsl(var(--sub-alt-color))",
                    foreground: "hsl(var(--text-color))",
                },
                card: {
                    DEFAULT: "hsl(var(--sub-alt-color))",
                    foreground: "hsl(var(--text-color))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
