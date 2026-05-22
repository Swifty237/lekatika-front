import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [navHeight, setNavHeight] = useState(0);

    useEffect(() => {
        const nav = document.getElementById('main-nav');
        if (!nav) return;

        const updateHeight = () => setNavHeight(nav.offsetHeight);
        updateHeight();

        const observer = new ResizeObserver(updateHeight);
        observer.observe(nav);

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-green-gradient font-suse text-white">
            <Navbar />
            <main
                className="flex-grow container mx-auto px-4 pb-8"
                style={{ paddingTop: `${navHeight}px` }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;