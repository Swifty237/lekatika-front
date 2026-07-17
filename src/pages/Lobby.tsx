/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Beer, ChevronLeft, ChevronRight, CircleDollarSign, DoorClosedLocked, DoorOpen, Play, Search, SquareArrowOutUpRight, TriangleAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NewTatamiDialog from '@/components/dialog/NewTatamiDialog';
import { showToast } from '@/components/CustomToast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type TatamiProps from '@/types/Tatami';
import { useUser } from '@/hooks/useUser';
import debounce from 'debounce';


const Lobby: React.FC = () => {
    const [newTatamiOpen, setNewTatamiOpen] = useState(false);
    const [tables, setTables] = useState<TatamiProps[]>([]); // État pour stocker les tatamis
    const [activeColumn, setActiveColumn] = useState(0);
    // États pour la recherche
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTables, setFilteredTables] = useState<TatamiProps[]>([]);

    const navigate = useNavigate();
    const { user } = useUser();

    const tableHeads = ["Nom", "Privé / Publique", "Avec la 33", "Mise"];

    const generateTatamiName = () => {
        return "tatami-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    };

    const API_URL = import.meta.env.VITE_LEKATIKA_SERVER_URI;
    // const ITEMS_PER_PAGE = 10;
    // const totalPagesNonTraites = Math.ceil(tables.length / ITEMS_PER_PAGE);
    // const startIndexNonTraites = (currentPageNonTraites - 1) * ITEMS_PER_PAGE;
    // const paginatedNonArchives = devisNonArchives.slice(startIndexNonTraites, startIndexNonTraites + ITEMS_PER_PAGE);

    // Fonction de filtrage
    const filterTables = useCallback((query: string) => {
        if (!query.trim()) {
            setFilteredTables(tables);
            return;
        }
        const lowerQuery = query.toLowerCase();
        const filtered = tables.filter(table =>
            table.name.toLowerCase().includes(lowerQuery)
        );
        setFilteredTables(filtered);
    }, [tables]);

    // Debounce pour éviter de filtrer à chaque frappe
    const debouncedFilter = useMemo(() => debounce(filterTables, 300), [filterTables]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedFilter(value);
    };

    // Nettoyer le debounce au démontage
    useEffect(() => {
        return () => {
            debouncedFilter.clear();
        };
    }, [debouncedFilter]);

    // Initialiser filteredTables quand les tables sont chargées
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFilteredTables(tables);
    }, [tables]);


    const fetchTables = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/api/tables`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Transformer chaque table pour utiliser les noms frontend
                const normalizedTables = data.tables.map((table: TatamiProps) => ({
                    id: table.id,
                    name: table.name,
                    type: table.is_private,        // alias
                    realMoney: table.is_real_money, // alias
                    paid33: table.paid_33,          // alias
                    bet: table.bet,
                    players: table.players,
                }));
                setTables(normalizedTables);

            }
        } catch (error) {
            console.error("Erreur lors du chargement des tatamis:", error);
        }
    };

    const handleJoinTable = async (tableId: string) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            localStorage.setItem('redirectAfterLogin', `/join/${tableId}`);
            navigate('/login');
            return;
        }

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
                sessionStorage.setItem('currentTableID', result.table.id);
                fetchTables(); // rafraîchir la liste
                if (result.alreadyIn) {
                    showToast("Vous êtes déjà dans cette table");
                } else {
                    showToast("Vous avez rejoint la table", "success");
                }
                newTab.location.href = `/game-progress?tableId=${result.table.id}`;
            } else {
                showToast(result.error || "Impossible de rejoindre le tatami", "error");
                newTab.close();
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


    const handleNewTatami = async (privateTatami: boolean, realMoney: boolean, bet: string, paid33: boolean) => {
        const tatamiName = generateTatamiName();
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }
        console.log("Creating new tatami, opening tab...");
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
                    bet: parseInt(bet, 10),
                    paid_33: paid33,
                })
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Table créée, ID:", result.table.id);
                sessionStorage.setItem('currentTableID', result.table.id);
                await fetchTables();
                console.log("Ouverture de l'onglet vers /game-progress");
                newTab.location.href = `/game-progress?tableId=${result.table.id}`;
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

    const switchAttribut = (table: TatamiProps) => {
        switch (activeColumn) {
            case 0: return <span className="flex justify-center">{table.name}</span>;
            case 1: return table.type ?
                <span className="bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded flex justify-center">Privé</span> :
                <span className="bg-green-200 text-green-800 px-2.5 py-0.5 rounded flex justify-center">Publique</span>;
            case 2: return table.paid33 ?
                <span className="px-2.5 py-0.5 rounded flex justify-center">Oui</span> :
                <span className="px-2.5 py-0.5 rounded flex justify-center">Non</span>;
            case 3: return <span className="flex justify-center">{table.bet + " chips"}</span>;
            case 4: return table.realMoney ?
                <span className="bg-red-100 text-red-800 font-medium px-2.5 py-0.5 rounded flex justify-center">Oui</span> :
                <span className="bg-green-200 text-green-800 font-medium px-2.5 py-0.5 rounded flex justify-center">Non</span>;
            default:
                return "";
        }
    };

    const anotherSwitchAttribut = () => {
        switch (activeColumn) {
            case 0: return <div className="flex justify-center">{tableHeads[activeColumn]}</div>;
            case 1: return <div className="flex justify-center">
                <span className="flex items-center"><DoorClosedLocked className="h-4 w-4 me-1" /> Privé /</span>
                <span className="flex items-center"><DoorOpen className="h-4 w-4 mx-1" /> Publique</span>
            </div>;
            case 2: return <div className="flex justify-center items-center"><Beer className="h-4 w-4 me-1" />{tableHeads[activeColumn]}</div>;
            case 3: return <div className="flex justify-center items-center"><CircleDollarSign className="h-4 w-4 me-1" />{tableHeads[activeColumn]}</div>;
            case 4: return <div className="flex justify-center items-center"><TriangleAlert className="h-4 w-4 me-1" />{tableHeads[activeColumn]}</div>
            default:
                return "";
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        const ws = new WebSocket(`ws://localhost:8080/ws?token=${token}`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'RELOAD_TABLES') {
                fetchTables();
            }
        };

        return () => ws.close();
    }, []);



    return (
        <MainLayout>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold mt-4 my-4">
                    Salut <span className="capitalize">{user?.username}</span> !
                </h1>

                <p className="text-3xl font-bold mb-4">
                    Bienvenue dans ton Lobby <span className="shadow-xl rounded-full">😄</span>
                </p>


                <p className="text-lg">
                    Tu peux rejoindre un tatami en cliquant sur un des liens si dessous ou bien en créer un nouveau pour t'amuser avec des amis.
                </p>

                <div className="2lg:w-[55vw] lg:w-[75vw] pt-8 flex w-full justify-around items-center">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-[40%]">
                        <label className="flex items-center gap-2 mb-4 lg:mb-0">
                            <input type="checkbox" checked disabled className="w-4 h-4 rounded focus:ring-[#0FAC71]" />
                            <span>Poins découverte</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" disabled className="w-4 h-4 rounded focus:ring-[#0FAC71]" />
                            <span>Points réels</span>
                        </label>
                    </div>

                    <button type="button" onClick={() => setNewTatamiOpen(true)} className="ms-4 hover:bg-[#0FAC71] transition flex items-center py-2 px-8 shadow-xl rounded-lg">
                        <SquareArrowOutUpRight className="h-4 w-4 me-2" />
                        <p>Nouveau tatami</p>
                    </button>
                </div>

                <div className="relative mx-8 mt-8 w-[85vw] lg:w-[50vw]">
                    <input
                        type="text"
                        placeholder="Trouver un tatami"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full px-3 py-2 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71] text-black"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 p-2 me-[-10px] rounded-sm"
                        tabIndex={-1}
                    >
                        <Search className="h-5 w-5" />
                    </button>
                </div>

                <div className="w-full flex flex-col justify-center items-center 2lg:w-[80vw] lg:w-[90vw] min-h-[50vh] bg-white mt-8 rounded-md text-black opacity-80">
                    <div className="p-8 w-full overflow-x-auto">
                        {filteredTables.length === 0 ? (
                            <div className="flex flex-col items-center">

                                {searchQuery.trim() ? "Aucun tatami trouvé" :
                                    <>
                                        <span>Oops ! il n'y a pas de tatami ouvert actuellement...</span>
                                        <span>N'hésite pas à ouvrir un nouveau tatami, ça fait venir les joueurs <span className="shadow-xl rounded-full text-lg">😉</span></span>
                                    </>
                                }
                            </div>
                        ) : (
                            <div className="shadow-xl">
                                {/* <Table className="hidden lg:table w-full border border-gray-300 shadow-xl"> */}
                                <Table className="hidden lg:table">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead scope="col" className="border">
                                                <p className="text-center">Nom</p>
                                            </TableHead>
                                            <TableHead scope="col" className="border">
                                                <div className="flex justify-center">
                                                    <span className="flex items-center"><DoorClosedLocked className="h-4 w-4 me-1" /> Privé /</span>
                                                    <span className="flex items-center"><DoorOpen className="h-4 w-4 mx-1" /> Publique</span>
                                                </div>
                                            </TableHead>
                                            <TableHead scope="col" className="border">
                                                <div className="flex justify-center items-center">
                                                    <Beer className="h-4 w-4 me-1" />Avec la 33
                                                </div>
                                            </TableHead>
                                            <TableHead scope="col" className="border">
                                                <div className="flex justify-center items-center">
                                                    <CircleDollarSign className="h-4 w-4 me-1" />Mise
                                                </div>
                                            </TableHead>
                                            <TableHead scope="col" className="border">
                                                <div className="flex justify-center items-center">
                                                    <TriangleAlert className="h-4 w-4 me-1" />Argent réel
                                                </div>
                                            </TableHead>
                                            <TableHead scope="col" className="border">
                                                <div className="flex justify-center items-center">
                                                    <Play className="h-4 w-4 me-1" />Rejoindre
                                                </div>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredTables.map((table) => (
                                            <TableRow key={table.id} className="bg-green-100 border-gray-300">
                                                <TableCell className="px-6 py-4  text-gray-900 whitespace-nowrap flex justify-center">
                                                    {table.name}
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    {table.type ?
                                                        <span className="bg-yellow-100 text-yellow-800  px-2.5 py-0.5 rounded flex justify-center">Privé</span> :
                                                        <span className="bg-green-200 text-green-800  px-2.5 py-0.5 rounded flex justify-center">Publique</span>
                                                    }
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    {table.paid33 ?
                                                        <span className="px-2.5 py-0.5 rounded flex justify-center"> Oui</span> :
                                                        <span className="px-2.5 py-0.5 rounded flex justify-center"> Non</span>
                                                    }
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <span className="flex justify-center">{table.bet} chips</span>
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    {table.realMoney ?
                                                        <span className="bg-red-100 text-red-800  px-2.5 py-0.5 rounded flex justify-center">Oui</span> :
                                                        <span className="bg-green-200 text-green-800  px-2.5 py-0.5 rounded flex justify-center">Non</span>
                                                    }
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <div className="flex justify-center">
                                                        <button
                                                            onClick={() => handleJoinTable(table.id)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            Rejoindre
                                                        </button>
                                                    </div>
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
                                                <TableHead className="border">
                                                    {anotherSwitchAttribut()}
                                                </TableHead>
                                                <TableHead className="border">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <label className="my-2 flex items-center">
                                                            <Play className="h-4 w-4 me-1" />Rejoindre
                                                        </label>
                                                    </div>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>

                                            {filteredTables.map((row) => (
                                                <TableRow key={row.id} className="bg-green-100 border-gray-300">
                                                    <TableCell>
                                                        {switchAttribut(row) || "-"}
                                                    </TableCell>

                                                    <TableCell className="text-center">
                                                        {row.players && row.players.includes(user!.user_id) ? (
                                                            <button disabled className="text-gray-400 cursor-not-allowed">
                                                                Rejoint
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleJoinTable(row.id)}
                                                                className="text-blue-600 hover:text-blue-800"
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