export default function SkipToNavLink() {
    return (
        <a
            href="#main-nav"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:p-2 focus:bg-background focus:z-50 focus:border"
        >
            Skip to navigation
        </a>
    );
}
