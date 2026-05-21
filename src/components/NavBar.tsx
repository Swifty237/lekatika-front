import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, HomeIcon, LogOut, User, UserCog } from 'lucide-react';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const handleLogout = () => {
        navigate('/');
    };

    return (
        <nav className="shadow-md">
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <div className="space-x-4 flex items-center">
                    <Link to="/lobby" className="text-2xl font-bold tracking-tight w-[100px]">
                        <img src="img/logo-transparent.png" alt="" />
                    </Link>

                    <Link to="/lobby" className="hover:bg-[#0FAC71] transition flex items-center py-1 px-8 shadow-lg rounded-lg">
                        <HomeIcon className="h-4 w-4 me-2" />
                        <span>Lobby</span>
                    </Link>
                </div>

                <div className="rounded-md shadow-xl hover:bg-[#0FAC71]">
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="w-[17em] px-8 py-1 rounded-md text-white flex items-center justify-between"
                    >
                        <div className="flex items-center">
                            <User className="h-4 w-4 me-2" />
                            <span className="text-lg">Username</span>
                        </div>
                        {isUserMenuOpen ? <ChevronUp /> : <ChevronDown />}
                    </button>
                </div>
            </div>

            {isUserMenuOpen && (
                <div className="backdrop-blur-sm px-4 shadow-xl flex justify-center">
                    <div className="px-8 pt-2 pb-3 md:w-[50vw]">
                        <Link
                            to="/passwordModif"
                            className={`flex items-center transition-colors duration-200 hover:bg-[#0FAC71] p-2 ${location.pathname === "/passwordModif"
                                ? 'text-[#001964]'
                                : 'text-muted-foreground'
                                }`}
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setIsUserMenuOpen(false);
                                }}
                                className="flex items-center"
                            >
                                <UserCog className="h-4 w-4 me-2" />
                                Modifier le mot de passe
                            </button>
                        </Link>

                        <button
                            type="button"
                            onClick={() => {
                                setIsUserMenuOpen(false);
                                handleLogout();
                            }}
                            className="flex items-center hover:bg-[#0FAC71] w-full p-2"
                        >
                            <span className="flex items-center">
                                <LogOut className="h-4 w-4 me-2" />
                                Déconnexion
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;