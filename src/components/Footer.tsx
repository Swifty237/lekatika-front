import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="text-white py-4 mt-auto">
            <div className="container mx-auto px-4 text-center text-sm">
                © {new Date().getFullYear()} Le katika.com - Tous droits réservés
            </div>
        </footer>
    );
};

export default Footer;