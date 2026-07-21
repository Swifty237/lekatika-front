import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp, HomeIcon, UserCog, Bell, Search, SquareArrowRightExit, CirclePlus, UsersRound, Scale } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { formatNumber } from '@/lib/formatNumber';
import AddChipsDialog from '@/components/dialog/AddChipsDialog';
import { useUser } from '@/hooks/useUser';
import type UserProps from '@/types/User';
import debounce from "debounce";
import searchUsers from '@/hooks/useSearchProfile';
import { getWebSocketUrl } from '@/lib/websocket';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, refreshUser } = useUser()

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [username, setUsername] = useState<string>('');
    const [selectedCurrency, setSelectedCurrency] = useState<string>('0'); // '0' = fictif, '1' = réel
    const [freeChipsAmount, setFreeChipsAmount] = useState<string>('');
    const [onlineUsersList, setOnlineUsersList] = useState<UserProps[]>([]);
    const [addChipsOpen, setAddChipsOpen] = useState(false);
    //   const [maxBuyIn, setMaxBuyIn] = useState<string>('');
    // const minBuyIn = 1000;

    // État pour stocker les résultats de recherche des profils
    const [searchProfiles, setSearchProfiles] = useState<UserProps[]>([]);
    const [searching, setSearching] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    const wsRef = useRef<WebSocket | null>(null);

    // Gestion de la recherche avec debounce (attente de 500ms avant d'exécuter la requête)
    const handleSearchName = debounce(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (!value || value.length < 2) {
            setSearchProfiles([]);
            setSearching(false);
            return;
        }

        setSearching(true);
        try {
            const results = await searchUsers(value);
            setSearchProfiles(results);
        } catch (error) {
            console.error(error);
            setSearchProfiles([]);
        } finally {
            setSearching(false);
        }
    }, 500);

    // Fermer la liste de résultats en cliquant en dehors
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setSearchProfiles([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCurrencyChange = (value: string) => {
        setSelectedCurrency(value);
        // Ici, tu pourras plus tard :
        // - mettre à jour un contexte global (ex: devise courante)
        // - recharger les soldes correspondants depuis l'API
        // - stocker la préférence dans localStorage
        console.log("Devise sélectionnée :", value === '0' ? 'Argent fictif' : 'Argent réel');
    };

    const handleAddChips = async (amount: number) => {
        try {
            const token = localStorage.getItem('authToken');
            const currencyType = selectedCurrency === '0' ? 'free' : 'real';
            const response = await fetch(`${import.meta.env.VITE_LEKATIKA_SERVER_URI}/api/user/add-chips`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount, currencyType }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Erreur lors de l'ajout");
            }

            // Mettre à jour les données utilisateur
            await refreshUser();
            // Le toast de succès peut être ajouté ici
            console.log(`${amount} chips ajoutés avec succès`);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Erreur inconnue";
            console.error(msg);
            // Afficher un toast d'erreur
            // showToast(msg, "error");
        }
    };

    const handleLogout = async () => {
        const token = localStorage.getItem('authToken');
        const API_URL = import.meta.env.VITE_LEKATIKA_SERVER_URI;

        if (token) {
            try {
                await fetch(`${API_URL}/api/logout`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (err) {
                console.error("Erreur lors de la déconnexion côté serveur", err);
            }
        }

        // Nettoyage local
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        localStorage.removeItem('freeChipsAmountBankroll');
        localStorage.removeItem('currentTatami');
        localStorage.removeItem('currentTableId');
        navigate('/login');
    };

    // Récupérer le username depuis localStorage au chargement et à chaque changement de route
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedfreeChipsAmount = localStorage.getItem('freeChipsAmountBankroll');

        if (storedUsername) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUsername(storedUsername);
        } else {
            setUsername('');
        }

        if (storedfreeChipsAmount) {
            setFreeChipsAmount(storedfreeChipsAmount);
        } else {
            setFreeChipsAmount('');
        }
    }, []);


    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        const ws = new WebSocket(getWebSocketUrl(token));
        wsRef.current = ws;

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'ONLINE_USERS_UPDATE') {
                setOnlineUsersList(data.users || []);
            }
        };

        return () => ws.close();
    }, []);

    return (
        <nav id="main-nav" className="shadow-md text-sm fixed top-0 left-0 w-full z-50 backdrop-blur-2xl transition-shadow duration-300 bg-green-gradient">
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center">
                    <Link to="/lobby" className="w-[100px] bg-red-gradient m-2 rounded-sm">
                        <img src="/img/logo-transparent.png" alt="" />
                    </Link>

                    <Link to="/lobby" className="flex hover:bg-[#0FAC71] transition items-center py-1 px-4 shadow-xl rounded-lg">
                        <HomeIcon className="h-5 w-5 me-2" />
                        <span className="hidden lg:flex">Lobby</span>
                    </Link>
                </div>

                <div className="flex items-center">
                    <Select onValueChange={handleCurrencyChange} value={selectedCurrency}>
                        <SelectTrigger className="shadow-lg">
                            <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent className="text-white bg-[#0FAC71] shadow-lg">
                            <SelectItem value="0">Points découverte</SelectItem>
                            <SelectItem value="1">Points réels</SelectItem>
                        </SelectContent>
                    </Select>

                    <button
                        type="button"
                        onClick={() => setAddChipsOpen(true)}
                        className="ms-4 hover:bg-[#0FAC71] transition flex items-center py-1 px-2 sm:px-4 shadow-xl rounded-lg"
                    >
                        <p>{selectedCurrency === '0' ? formatNumber(user?.free_chips_amount_bankroll ?? 0) : formatNumber(user?.real_chips_amount_bankroll ?? 0)}</p>
                        <CirclePlus className="h-5 w-5 ms-4" />
                    </button>
                </div>



                <div className="flex">
                    <div className="hidden lg:flex items-center justify-center me-4">
                        <div className="flex items-center justify-center me-4 py-1 px-2 rounded-lg shadow-lg">
                            <span>{<span>{onlineUsersList.length}</span>}</span>
                            <UsersRound className="h-5 w-5 ms-2" />
                        </div>

                        <div ref={searchContainerRef} className="relative w-full text-black">
                            <input
                                type="text"
                                placeholder="Trouver un joueur"
                                onChange={handleSearchName}
                                className="w-full px-3 py-2 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                            {/* Icône de recherche */}
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 p-2 me-[-10px] rounded-sm"
                                tabIndex={-1}
                            >
                                <Search className="h-5 w-5" />
                            </button>

                            {/* Résultats */}
                            {searching && (
                                <div className="absolute bg-white w-full z-20 left-0 top-12 border p-1 text-center">
                                    Recherche...
                                </div>
                            )}
                            {!searching && searchProfiles.length > 0 && (
                                <div className="absolute bg-white w-full z-20 left-0 top-12 border p-1 max-h-60 overflow-y-auto shadow-lg rounded-md">
                                    {searchProfiles.map((profile, index) => (
                                        <div className="p-1" key={index}>
                                            <Link
                                                to={`/profile-visitor/${profile.user_id}`}
                                                className="flex items-center justify-between w-full cursor-pointer hover:bg-[#d3f8df] p-1 px-2 rounded"
                                                onClick={() => setSearchProfiles([])} // ferme la liste après clic
                                            >
                                                <div className="flex items-center">
                                                    <img
                                                        className="rounded-md w-8 h-8 object-cover"
                                                        src={profile.profile_picture_link || "img/user-avatar.png"}
                                                        alt="profile"
                                                    />
                                                    <div className="truncate ml-2">{profile.username}</div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="hidden lg:block rounded-lg hover:bg-[#0FAC71] shadow-xl">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="lg:w-[17em] px-2 lg:px-8 py-1 rounded-md text-white flex items-center justify-between"
                        >
                            <div className="flex items-center">
                                <div className="rounded-full border h-8 w-8 my-1 me-4">
                                    <img
                                        src={user?.profile_picture_link || "/img/user-avatar.png"}
                                        className="w-full h-full object-cover rounded-full"
                                        alt="Photo de profil"
                                    />
                                </div>
                                <span className="hidden capitalize md:flex">{username || 'Invité'} </span>
                            </div>
                            {isUserMenuOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full p-2 flex lg:hidden items-center justify-center me-4">
                <div className="flex items-center justify-center me-4 py-1 px-2 rounded-lg shadow-lg">
                    <span>{<span>{onlineUsersList.length}</span>}</span>
                    <UsersRound className="h-4 w-4 ms-2" />
                </div>

                <div ref={searchContainerRef} className="relative w-full text-black">
                    <input
                        type="text"
                        placeholder="Trouver un joueur"
                        onChange={handleSearchName}
                        className="w-full px-3 py-2 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                    />
                    {/* Icône de recherche */}
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 p-2 me-[-10px] rounded-sm"
                        tabIndex={-1}
                    >
                        <Search className="h-5 w-5" />
                    </button>

                    {/* Résultats */}
                    {searching && (
                        <div className="absolute bg-white w-full z-20 left-0 top-12 border p-1 text-center">
                            Recherche...
                        </div>
                    )}
                    {!searching && searchProfiles.length > 0 && (
                        <div className="absolute bg-white w-full z-20 left-0 top-12 border p-1 max-h-60 overflow-y-auto shadow-lg rounded-md">
                            {searchProfiles.map((profile, index) => (
                                <div className="p-1" key={index}>
                                    <Link
                                        to={`/profile-visitor/${profile.user_id}`}
                                        className="flex items-center justify-between w-full cursor-pointer hover:bg-[#d3f8df] p-1 px-2 rounded"
                                        onClick={() => setSearchProfiles([])} // ferme la liste après clic
                                    >
                                        <div className="flex items-center">
                                            <img
                                                className="rounded-md w-8 h-8 object-cover"
                                                src={profile.profile_picture_link || "img/user-avatar.png"}
                                                alt="profile"
                                            />
                                            <div className="truncate ml-2">{profile.username}</div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-lg hover:bg-[#0FAC71] shadow-xl">
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="lg:w-[17em] px-2 lg:px-8 py-1 rounded-md text-white flex items-center justify-between"
                    >
                        <div className="flex items-center">
                            <div className="rounded-full border h-8 w-8 my-1 me-4">
                                <img
                                    src={user?.profile_picture_link || "img/user-avatar.png"}
                                    className="w-full h-full object-cover rounded-full"
                                    alt="Photo de profil"
                                />
                            </div>
                            <span className="hidden md:flex">{username || 'Invité'} </span>
                        </div>
                        {isUserMenuOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            <AddChipsDialog
                open={addChipsOpen}
                currencyType={selectedCurrency == "0" ? "free" : "real"}
                currentAmount={Number(freeChipsAmount)}
                maxTotal={10000}
                onConfirm={(amount) => {
                    handleAddChips(amount);
                    setAddChipsOpen(false);
                }}
                onCancel={() => setAddChipsOpen(false)}
            />

            {isUserMenuOpen && (
                <div className="backdrop-blur-sm px-4 shadow-xl flex justify-center" onClick={() => { setIsUserMenuOpen(false) }}>
                    <div className="px-8 pb-3 md:w-[50vw]">
                        <Link
                            to="/profile"
                            className={`flex items-center transition-colors duration-200 hover:bg-[#0FAC71] p-2`}
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setIsUserMenuOpen(false);
                                }}
                                className="flex items-center"
                            >
                                <UserCog className="h-5 w-5 me-2" />
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
                                <Bell className="h-5 w-5 me-2" />
                                Notifications
                            </button>
                        </Link>

                        <Link
                            to="/rules"
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
                                <Scale className="h-5 w-5 me-2" />
                                Règles du jeu
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
                                <SquareArrowRightExit className="w-5 h-5 me-2" />
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