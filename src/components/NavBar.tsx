import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, User } from 'lucide-react';

const Navbar: React.FC = () => {
    return (
        <nav className="shadow-md">
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <div className="space-x-4 flex items-center">
                    <Link to="/lobby" className="text-2xl font-bold tracking-tight w-[100px]">
                        <img src="img/logo-transparent.png" alt="" />
                    </Link>

                    <Link to="/lobby" className="bg-[#0FAC71] transition flex items-center py-2 px-6 shadow-lg rounded-lg">
                        <HomeIcon className="h-4 w-4 me-2" />
                        <span>Lobby</span>
                    </Link>
                </div>

                <div className="space-x-4">
                    <Link to="/login" className="bg-[#0FAC71] transition flex items-center py-2 px-6 shadow-lg rounded-lg">
                        <User className="h-4 w-4 me-2" />
                        <span>Username</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;