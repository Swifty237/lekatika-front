/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { ChevronLeft, ChevronRight, SquareArrowOutUpRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import NewTatamiDialog from '@/components/NewTatamiDialog';
import { showToast } from '@/components/CustomToast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface Tatami {
    name: string;
    type: boolean;
    bet: string
}

const Lobby: React.FC = () => {

    const [username, setUsername] = useState<string>('');
    const [newTatamiOpen, setNewTatamiOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [userData, setUserData] = useState<any>(null); // stocker toutes les infos
    const [tables, setTables] = useState([]); // État pour stocker les tatamis
    const [activeColumn, setActiveColumn] = useState(0);

    const location = useLocation();
    const navigate = useNavigate();

    const tableHeads = ["Nom", "Type", "Mise"];

    const generateTatamiName = () => {
        return "tatami-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    };

    const API_URL = import.meta.env.VITE_LEKATIKA_SERVER_URI;
    // const ITEMS_PER_PAGE = 10;
    // const totalPagesNonTraites = Math.ceil(tables.length / ITEMS_PER_PAGE);
    // const startIndexNonTraites = (currentPageNonTraites - 1) * ITEMS_PER_PAGE;
    // const paginatedNonArchives = devisNonArchives.slice(startIndexNonTraites, startIndexNonTraites + ITEMS_PER_PAGE);

    const fetchTables = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/api/tables`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setTables(data.tables);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des tatamis:", error);
        }
    };

    const handleJoinTable = async (tableId: string) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            // Stocker l'URL pour rediriger après connexion
            localStorage.setItem('redirectAfterLogin', `/join/${tableId}`);
            navigate('/login');
            return;
        }

        // Ouvrir un nouvel onglet vide immédiatement
        const newTab = window.open('about:blank', '_blank');
        if (!newTab) {
            showToast("Impossible d'ouvrir un nouvel onglet, vérifiez votre bloqueur de popups", "error");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/join/${tableId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('currentTableId', result.table.id);
                fetchTables(); // rafraîchir la liste des tables

                newTab.location.href = '/game-progress';
            } else {
                showToast(result.error || "Impossible de rejoindre le tatami", "error");
                newTab.close(); // fermer l'onglet vide
            }
        } catch (err) {
            console.error(err);
            showToast("Erreur réseau", "error");
            newTab.close();
        }
    };

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'tablesUpdate') {
                fetchTables(); // Rafraîchir la liste des tatamis
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTables();
    }, []);


    // Charger les données utilisateur depuis le backend
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await fetch(`${API_URL}/api/user/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const result = await response.json();
                    console.log(result.user);
                    setUserData(result.user);
                    setUsername(result.user.username);
                    // Mettre à jour localStorage si besoin (freeChipsAmount, etc.)
                    localStorage.setItem('username', result.user.username);
                    localStorage.setItem('freeChipsAmount', result.user.freeChipsAmount?.toString() || '0');
                } else {
                    // Token invalide → rediriger vers login
                    localStorage.removeItem('authToken');
                    navigate('/login');
                }
            } catch (err) {
                console.error(err);
                navigate('/login');
            }
        };

        fetchUserData();
    }, [location, navigate]);


    const handleNewTatami = async (privateTatami: boolean, realMoney: boolean, bet: string) => {
        const tatamiName = generateTatamiName();
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        const newTab = window.open('about:blank', '_blank');
        if (!newTab) {
            showToast("Impossible d'ouvrir un nouvel onglet", "error");
            return;
        }

        setNewTatamiOpen(false)

        try {
            const response = await fetch(`${API_URL}/api/tables`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    name: tatamiName,
                    is_private: privateTatami,
                    is_real_money: realMoney,
                    bet: parseInt(bet, 10)
                })
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('currentTableId', result.table.id);
                // Rafraîchir la liste des tables dans le lobby
                await fetchTables(); // attendre la mise à jour
                newTab.location.href = '/game-progress';
            } else {
                showToast(result.error || "Erreur lors de la création du tatami", "error");
                newTab.close();
            }
        } catch (err) {
            console.error(err);
            showToast("Erreur réseau", "error");
            newTab.close();
        }
    };

    const switchAttribut = (table: Tatami) => {
        switch (activeColumn) {
            case 0:
                return table.name;
            case 1:
                return table.type ?
                    <span className="bg-red-100 text-red-800 font-medium px-2.5 py-0.5 rounded">Privé</span> :
                    <span className="bg-green-100 text-green-800 font-medium px-2.5 py-0.5 rounded">-- Ouvert au publique --</span>;
            case 2:
                return table.bet + " chips";
            case 3:
                return "";
            default:
                return "";
        }
    };

    useEffect(() => {
        // 1. Créer la connexion WebSocket
        const ws = new WebSocket('ws://localhost:8080/ws');

        // 2. Écouter les messages du serveur
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'RELOAD_TABLES') {
                // 3. Mettre à jour la liste des tatamis
                fetchTables();
            }
        };

        // 4. Nettoyer la connexion à la fermeture du composant
        return () => {
            ws.close();
        };
    }, []); // Dépendances vides pour initialisation unique


    return (
        <MainLayout>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold mt-4 my-4">
                    Salut <span className="capitalize">{username}</span> !
                </h1>

                <p className="text-3xl font-bold mb-4">
                    Bienvenue dans ton Lobby <span className="shadow-xl rounded-full">😄</span>
                </p>


                <p className="text-lg">
                    Tu peux rejoindre un tatami en cliquant sur un des liens si dessous ou bien en créer un nouveau pour t'amuser avec des amis.
                </p>

                <div className="lg:w-[55vw] pt-8 flex w-full justify-around items-center">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-[40%]">
                        <label className="flex items-center gap-2 mb-4 lg:mb-0">
                            <input type="checkbox" checked disabled className="w-4 h-4 rounded focus:ring-[#0FAC71]" />
                            <span>Argent fictif</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" disabled className="w-4 h-4 rounded focus:ring-[#0FAC71]" />
                            <span>Argent réel</span>
                        </label>
                    </div>

                    <button type="button" onClick={() => setNewTatamiOpen(true)} className="ms-4 hover:bg-[#0FAC71] transition flex items-center py-2 px-8 shadow-xl rounded-lg">
                        <SquareArrowOutUpRight className="h-4 w-4 me-2" />
                        <p>Nouveau tatami</p>
                    </button>
                </div>

                {/* <div className="w-full flex flex-col justify-center items-center lg:w-[55vw] min-h-[30vh] bg-white mt-8 rounded-md text-black">
                    <span>Oops ! il n'y a pas de tatami ouvert actuellement...</span>
                    <span>N'hésite pas à ouvrir un nouveau tatami, ça fait venir les joueurs <span className="shadow-xl rounded-full text-lg">😉</span></span>
                </div> */}


                <div className="w-full flex flex-col justify-center items-center lg:w-[55vw] min-h-[30vh] bg-white mt-8 rounded-md text-black">
                    <div className="p-8 w-full overflow-x-auto">
                        {tables.length === 0 ? (
                            <div className="flex flex-col items-center">
                                <span>Oops ! il n'y a pas de tatami ouvert actuellement...</span>
                                <span>N'hésite pas à ouvrir un nouveau tatami, ça fait venir les joueurs <span className="shadow-xl rounded-full text-lg">😉</span></span>
                            </div>
                        ) : (
                            <div className="shadow-xl">
                                {/* <Table className="hidden lg:table w-full border border-gray-300 shadow-xl"> */}
                                <Table className="hidden lg:table border border-gray-300">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead scope="col" className="border px-6 py-3">Nom</TableHead>
                                            <TableHead scope="col" className="border px-6 py-3">Type</TableHead>
                                            <TableHead scope="col" className="border px-6 py-3">Mise</TableHead>
                                            <TableHead scope="col" className="border px-6 py-3">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tables.map((table) => (
                                            <TableRow key={table.id} className={`border-b ${table.isPrivate ? "bg-red-100" : "bg-green-100"}`}>
                                                <TableCell className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{table.name}</TableCell>
                                                <TableCell className="px-6 py-4">
                                                    {table.isPrivate ?
                                                        <span className="bg-red-100 text-red-800 font-medium px-2.5 py-0.5 rounded">-- Privé --</span> :
                                                        <span className="text-green-800 font-medium px-2.5 py-0.5 rounded">-- Ouvert au publique --</span>
                                                    }
                                                </TableCell>
                                                <TableCell className="px-6 py-4">{table.bet} chips</TableCell>
                                                <TableCell className="px-6 py-4">
                                                    {table.players && table.players.includes(userData?.id) ? (
                                                        <button disabled className="text-gray-400 font-medium cursor-not-allowed">
                                                            Rejoint
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleJoinTable(table.id)}
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            Rejoindre
                                                        </button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <div className="lg:hidden">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center justify-center gap-4 my-4">
                                            <Button
                                                className="py-2 px-3 border rounded-full bg-[#2c5036] text-white hover:bg-[#0FAC71]"
                                                onClick={() => setActiveColumn(prev => Math.max(0, prev - 1))}
                                            >
                                                <ChevronLeft />
                                            </Button>
                                            <span className="font-semibold">{tableHeads[activeColumn]}</span>
                                            <Button
                                                className="py-2 px-3 border rounded-full bg-[#2c5036] text-white hover:bg-[#0FAC71]"
                                                onClick={() => setActiveColumn(prev => Math.min(tableHeads.length - 1, prev + 1))}
                                            >
                                                <ChevronRight />
                                            </Button>
                                        </div>

                                    </div>

                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-100">
                                                <TableHead className="border">{tableHeads[activeColumn]}</TableHead>
                                                <TableHead className="border">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <label className="text-xs my-2">
                                                            Action
                                                        </label>
                                                    </div>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>

                                            {tables.map((row) => (
                                                <TableRow key={row._id} className={`border-b ${row.isPrivate ? "bg-red-100" : "bg-green-100"}`}>
                                                    <TableCell>
                                                        {switchAttribut(row) || "-"}
                                                    </TableCell>

                                                    <TableCell className="text-center">
                                                        {row.players && row.players.includes(userData?.id) ? (
                                                            <button disabled className="text-gray-400 font-medium cursor-not-allowed">
                                                                Rejoint
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleJoinTable(row.id)}
                                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                                            >
                                                                Rejoindre
                                                            </button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>



            </div>

            <NewTatamiDialog
                open={newTatamiOpen}
                onConfirm={handleNewTatami}  // ← on passe la fonction complète
                onCancel={() => setNewTatamiOpen(false)}
            />

        </MainLayout>
    );
};

export default Lobby;