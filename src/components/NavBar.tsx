import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp, HomeIcon, UserCog, Bell, Search, SquareArrowRightExit, CirclePlus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { formatNumber } from '@/lib/formatNumber';
import AddChipsDialog from '@/components/dialog/AddChipsDialog';
import { useUser } from '@/hooks/useUser';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser()

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [username, setUsername] = useState<string>('');
    const [selectedCurrency, setSelectedCurrency] = useState<string>('0'); // '0' = fictif, '1' = réel
    const [freeChipsAmount, setFreeChipsAmount] = useState<string>('');
    // const [confirmOpen, setConfirmOpen] = useState(false);
    const [addChipsOpen, setAddChipsOpen] = useState(false);
    //   const [maxBuyIn, setMaxBuyIn] = useState<string>('');
    // const minBuyIn = 1000;

    const handleCurrencyChange = (value: string) => {
        setSelectedCurrency(value);
        // Ici, tu pourras plus tard :
        // - mettre à jour un contexte global (ex: devise courante)
        // - recharger les soldes correspondants depuis l'API
        // - stocker la préférence dans localStorage
        console.log("Devise sélectionnée :", value === '0' ? 'Argent fictif' : 'Argent réel');
    };

    const handleAddChips = (amount: number) => {
        // Mettre à jour le montant des freeChips
        const newAmount = Number(freeChipsAmount) + amount;
        setFreeChipsAmount(newAmount.toString());
        localStorage.setItem('freeChipsAmountBankroll', newAmount.toString());
        // Ici plus tard tu pourras appeler une API pour synchroniser avec le backend
        console.log(`Ajout de ${amount} jetons. Nouveau solde : ${newAmount}`);
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
                    <Select onValueChange={handleCurrencyChange} value={selectedCurrency}>
                        <SelectTrigger className="w-[125px] shadow-lg">
                            <SelectValue placeholder="Argent fictif" />
                        </SelectTrigger>
                        <SelectContent className="text-white bg-[#0FAC71] shadow-lg">
                            <SelectItem value="0">Argent fictif</SelectItem>
                            <SelectItem value="1">Argent réel</SelectItem>
                        </SelectContent>
                    </Select>

                    <button
                        type="button"
                        onClick={() => setAddChipsOpen(true)}
                        className="ms-4 hover:bg-[#0FAC71] transition flex items-center py-1 px-2 sm:px-4 shadow-xl rounded-lg"
                    >
                        <p>{selectedCurrency === '0' ? formatNumber(user?.free_chips_amount_bankroll ?? 0) : '0'}</p>
                        <CirclePlus className="h-4 w-4 ms-4" />
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
                                <span className="hidden md:flex">{username || 'Invité'} </span>
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
                            <span className="hidden md:flex">{username || 'Invité'} </span>
                        </div>
                        {isUserMenuOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            <AddChipsDialog
                open={addChipsOpen}
                currencyType="free"
                currentAmount={Number(freeChipsAmount)}
                maxTotal={3000}
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