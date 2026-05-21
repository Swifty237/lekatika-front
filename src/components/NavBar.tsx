import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, HomeIcon, LogOut, User, UserCog, Bell, Search } from 'lucide-react';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <nav className="shadow-md">
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center">
                    <Link to="/lobby" className="w-[100px]">
                        <img src="img/logo-transparent.png" alt="" />
                    </Link>

                    <Link to="/lobby" className="hover:bg-[#0FAC71] transition flex items-center py-1 px-8 shadow-xl rounded-lg">
                        <HomeIcon className="h-4 w-4 me-2" />
                        <span>Lobby</span>
                    </Link>
                </div>

                <div className="flex">
                    <div className="flex items-center justify-center me-4">
                        <div className="relative w-full md:w-[15vw]">
                            <input
                                type="text"
                                placeholder="Trouver un joueur ou un tatami"
                                value={""}
                                onChange={() => { }}
                                className="w-full px-3 py-1 rounded-sm shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                            {/* Icône dans le champ */}
                            <button
                                type="button"
                                onClick={() => { }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 p-2 me-[-10px] rounded-sm"
                                tabIndex={-1} // ne gêne pas la navigation clavier
                            >
                                <Search className="h-4 w-4 mx-1" />
                            </button>
                        </div>
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
            </div>

            {isUserMenuOpen && (
                <div className="backdrop-blur-sm px-4 shadow-xl flex justify-center">
                    <div className="px-8 pb-3 md:w-[50vw]">
                        <Link
                            to="/profile"
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
                                Gestion du profil
                            </button>
                        </Link>

                        <Link
                            to="/notifications"
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
                                <Bell className="h-4 w-4 me-2" />
                                Notifications
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