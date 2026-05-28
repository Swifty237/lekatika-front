import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, HomeIcon, UserCog, Bell, Search, SquareArrowRightExit, CirclePlus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <nav id="main-nav" className="shadow-md text-sm fixed top-0 left-0 w-full z-50 backdrop-blur-2xl transition-shadow duration-300">
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center">
                    <Link to="/lobby" className="w-[100px]">
                        <img src="img/logo-transparent.png" alt="" />
                    </Link>

                    <Link to="/lobby" className="flex hover:bg-[#0FAC71] transition items-center py-1 px-4 shadow-xl rounded-lg">
                        <HomeIcon className="h-4 w-4 me-2" />
                        <span className="hidden lg:flex">Lobby</span>
                    </Link>
                </div>

                <div className="flex items-center">
                    <Select onValueChange={() => { }} value={""}>
                        <SelectTrigger className="w-[90px] shadow-lg">
                            <SelectValue placeholder="0" />
                        </SelectTrigger>
                        <SelectContent className="text-white mt-8 pb-1 bg-[#0FAC71] shadow-lg">
                            <SelectItem value="0">Argent réel : 0</SelectItem>
                            <SelectItem value="0">Argent fictif : 0</SelectItem>
                        </SelectContent>
                    </Select>

                    <button type="button" onClick={() => { }} className="ms-4 hover:bg-[#0FAC71] transition flex items-center py-1 px-2 sm:px-4 shadow-xl rounded-lg">
                        <p>Argent réel</p>
                        <CirclePlus className="h-4 w-4 ms-2" />
                    </button>
                </div>



                <div className="flex">
                    <div className="hidden lg:flex items-center justify-center me-4">
                        <div className="relative w-full md:w-[20vw]">
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

                    <div className="hidden lg:block rounded-lg hover:bg-[#0FAC71] shadow-xl">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="lg:w-[17em] px-2 lg:px-8 py-1 rounded-md text-white flex items-center justify-between"
                        >
                            <div className="flex items-center">
                                <div className="rounded-full border h-8 w-8 my-1 me-4">
                                    <img src="img/user-avatar.png" className="w-full rounded-full" alt="" />
                                </div>
                                <span className="hidden md:flex">Username</span>
                            </div>
                            {isUserMenuOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full p-2 flex lg:hidden items-center justify-center me-4">
                <div className="relative mx-8 w-full lg:w-[15vw]">
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

                <div className="rounded-lg hover:bg-[#0FAC71] shadow-xl">
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="lg:w-[17em] px-2 lg:px-8 py-1 rounded-md text-white flex items-center justify-between"
                    >
                        <div className="flex items-center">
                            <div className="rounded-full border h-8 w-8 my-1 me-4">
                                <img src="img/user-avatar.png" className="w-full rounded-full" alt="" />
                            </div>
                            <span className="hidden md:flex">Username</span>
                        </div>
                        {isUserMenuOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
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
                                <SquareArrowRightExit className="w-4 h-4 me-2" />
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