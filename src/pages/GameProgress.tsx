/* eslint-disable react-hooks/exhaustive-deps */
import Seat from '@/components/Seat';
import type TatamiProps from '@/types/Tatami';
import { Dice3, LogOut, MessageCircleMore, Pause, SquareArrowRightExit, Gift } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { showToast } from '@/components/CustomToast';
import SitOnTableDialog from '@/components/dialog/SitOnTableDialog';
import { useUser } from '@/hooks/useUser';
import ChatDialog from '@/components/dialog/ChatDialog';
// import { allCardKeys } from '@/components/Cards';

const GameProgress: React.FC = () => {

    const { user: currentUser, refreshUser } = useUser();
    const API_URL = import.meta.env.VITE_LEKATIKA_SERVER_URI;

    const [tatami, setTatami] = useState<TatamiProps>();
    const [isHeightAbove1200, setIsHeightAbove1200] = useState(false);
    const [isHeightAbove800, setIsHeightAbove800] = useState(false);
    const [isHeightAbove640, setIsHeightAbove640] = useState(false);
    const [seatBet, setSeatBet] = useState(0);
    const [sitOnTableDialogOpen, setSitOnTableDialogOpen] = useState(false)
    const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
    const [maxAmountAtStake, setAmountAtStake] = useState<number>(0);
    const [newChatMessages, setNewChatMessages] = useState(0);
    const [openChatDialog, setOpenChatDialog] = useState(false);
    const [chatMessages, setChatMessages] = useState<{ id: string; username: string; content: string; timestamp: string }[]>([]);

    const previousMessagesLength = useRef(0);
    const wsRef = useRef<WebSocket | null>(null);
    const readMessages = useRef<Set<string>>(new Set());
    const chatOpenRef = useRef(false);
    const currentUserIdRef = useRef(0);

    const [seatCards, setSeatCards] = useState<{ hand: string[], played: string[] }[]>([
        { hand: [], played: [] },
        { hand: [], played: [] },
        { hand: [], played: [] },
        { hand: [], played: [] },
    ]);

    useEffect(() => {
        if (currentUser) {
            currentUserIdRef.current = currentUser.user_id;
        }
    }, [currentUser]);

    const [searchParams] = useSearchParams();

    const sendChatMessage = (content: string) => {
        const tableId = sessionStorage.getItem('currentTableID');
        if (!tableId) return;
        sendWSMessage('CHAT_MESSAGE', {
            tableId: tableId,
            content: content,
        });
    };

    // Détection de la hauteur de l'écran
    useEffect(() => {
        const checkHeight = () => {
            const height = window.innerHeight;
            setIsHeightAbove800(height > 800);
            setIsHeightAbove640(height > 640);
            setIsHeightAbove1200(height > 1200);
        };
        checkHeight();
        window.addEventListener('resize', checkHeight);
        return () => window.removeEventListener('resize', checkHeight);
    }, []);

    // Fonction centrale pour quitter la table
    const performLeave = async () => {
        const token = localStorage.getItem('authToken');
        const tableId = sessionStorage.getItem('currentTableID');
        if (!token || !tableId) return;

        try {
            await fetch(`${API_URL}/api/tables/${tableId}/leave`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Erreur réseau lors du départ:", err);
        } finally {
            localStorage.removeItem('currentTatami');
            sessionStorage.removeItem('currentTableID');
            localStorage.setItem('tablesUpdate', Date.now().toString());
        }
    };

    // Appelée par le bouton "Quitter"
    const handleLeaveTatami = async () => {
        // Marqueur pour indiquer une sortie volontaire
        sessionStorage.setItem('manualLeave', 'true');
        await performLeave();
        window.close();
    };

    // Gérer la fermeture non contrôlée (croix de l'onglet, rafraîchissement)
    useEffect(() => {
        const handleBeforeUnload = async () => {
            const isManualLeave = sessionStorage.getItem('manualLeave');
            if (isManualLeave) {
                sessionStorage.removeItem('manualLeave');
                return;
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    // Fonction pour déterminer la classe de hauteur du conteneur
    const getContainerHeightClass = () => {
        if (isHeightAbove1200) return 'h-[65em]';
        if (isHeightAbove800) return 'h-[45em]';
        if (isHeightAbove640) return 'h-[30em]';
        return 'h-[25em]';
    };

    const getContainerAnotherHeightClass = () => {
        if (isHeightAbove1200) return 'h-[65em]';
        if (isHeightAbove800) return 'h-[45em]';
        if (isHeightAbove640) return 'h-[38em]';
        return 'h-[28em]';
    };

    useEffect(() => {
        // Si un tableId est fourni dans l'URL, on le stocke
        const tableIdFromUrl = searchParams.get('tableId');
        if (tableIdFromUrl) {
            sessionStorage.setItem('currentTableID', tableIdFromUrl);
            // Optionnel : nettoyer l'URL
            window.history.replaceState({}, '', '/game-progress');
        }
    }, [searchParams]);

    const handleSitWithAmount = async (amount: number) => {
        const token = localStorage.getItem('authToken');
        const tableId = sessionStorage.getItem('currentTableID');
        if (!token || !tableId || selectedSeat === null) return;
        try {
            const response = await fetch(`${API_URL}/api/tables/${tableId}/sit/${selectedSeat}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount })
            });
            const data = await response.json();
            if (response.ok) {
                // Ne pas modifier localement seatCards, le serveur va générer les cartes
                setTatami(data.table);
                localStorage.setItem('currentTatami', JSON.stringify(data.table));
                setSitOnTableDialogOpen(false);
                setSelectedSeat(null);
                showToast("Vous êtes assis avec une mise de " + amount + " chips", "success");
                await refreshUser();

            } else {
                showToast(data.error || "Impossible de s'asseoir", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Erreur réseau", "error");
        }
    };

    useEffect(() => {
        const fetchTable = async () => {
            const tableId = sessionStorage.getItem('currentTableID');
            const token = localStorage.getItem('authToken');
            console.log("fetchTable - tableId:", tableId, "token:", token ? "présent" : "absent");
            if (!tableId || !token) {
                console.log("Pas de tableId ou token, fermeture de l'onglet");
                window.close();
                return;
            }
            try {
                const response = await fetch(`${API_URL}/api/tables/${tableId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log("Réponse GET table:", response.status);

                if (response.ok) {
                    const data = await response.json();
                    setTatami(data.table);

                    if (data.table.chat_messages) {
                        setChatMessages(data.table.chat_messages);
                        // Marquer tous les messages comme lus si le chat est ouvert, sinon aucun
                        if (openChatDialog) {
                            data.table.chat_messages.forEach((msg: { id: string; username: string; content: string; timestamp: string }) => readMessages.current.add(msg.id));
                        } else {
                            // Sinon, on garde le Set vide
                        }
                        previousMessagesLength.current = data.table.chat_messages.length;
                    }

                    if (data.table.seatCards) {
                        setSeatCards(data.table.seatCards);
                    }
                    localStorage.setItem('currentTatami', JSON.stringify(data.table));
                } else {
                    // setSeatCardCounts(prev => prev.map(() => ({ hand: 0, played: 0 })));
                    console.log("Erreur chargement table, fermeture");
                    window.close();
                }

            } catch (err) {
                console.error(err);
                window.close();
            }
        };
        fetchTable();
    }, []);

    // WebSocket pour les mises à jour en temps réel
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        const ws = new WebSocket(`ws://localhost:8080/ws?token=${encodeURIComponent(token)}`);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'TABLE_UPDATED' && data.tableId === sessionStorage.getItem('currentTableID')) {
                const fetchTable = async () => {
                    const tableId = sessionStorage.getItem('currentTableID');
                    const token = localStorage.getItem('authToken');
                    if (!tableId || !token) return;
                    const response = await fetch(`${API_URL}/api/tables/${tableId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setTatami(data.table);
                        if (data.table.chat_messages) {
                            const newMessages = data.table.chat_messages;
                            setChatMessages(newMessages);
                            const newLength = newMessages.length;

                            if (chatOpenRef.current) {
                                // Chat ouvert : marquer tous les nouveaux messages comme lus
                                for (let i = previousMessagesLength.current; i < newLength; i++) {
                                    readMessages.current.add(newMessages[i].id);
                                }
                                setNewChatMessages(0);
                                previousMessagesLength.current = newLength;
                            } else {
                                // Chat fermé : compter les messages non lus (expéditeur différent)
                                if (newLength > previousMessagesLength.current) {
                                    let count = 0;
                                    for (let i = previousMessagesLength.current; i < newLength; i++) {
                                        const msg = newMessages[i];
                                        if (!readMessages.current.has(msg.id) && msg.user_id !== currentUserIdRef.current) {
                                            count++;
                                            // On ne les marque pas encore comme lus, car ils ne sont pas encore vus
                                        }
                                    }
                                    if (count > 0) {
                                        setNewChatMessages(prev => prev + count);
                                    }
                                    // Mettre à jour previousMessagesLength pour éviter de recompter
                                    previousMessagesLength.current = newLength;
                                }
                            }
                        }

                        if (data.table.seatCards) {
                            setSeatCards(data.table.seatCards);
                        }
                        localStorage.setItem('currentTatami', JSON.stringify(data.table));
                    }
                };
                fetchTable();
            }

            if (data.type === 'GAME_STARTING' && data.tableId === sessionStorage.getItem('currentTableID')) {
                setTimeout(() => {
                    showToast('Début de partie !', 'success');
                }, 3000);
            }

            if (data.type === 'DEAL' && data.tableId === sessionStorage.getItem('currentTableID')) {
                const { seatIndex, cards } = data;
                setSeatCards(prev => {
                    const newSeatCards = [...prev];
                    if (newSeatCards[seatIndex]) {
                        newSeatCards[seatIndex] = {
                            ...newSeatCards[seatIndex],
                            hand: [...newSeatCards[seatIndex].hand, ...cards],
                        };
                    }
                    return newSeatCards;
                });
            }

            if (data.type === 'GAME_EVENT') {
                // Si c'est un message privé, il n'a pas de tableId, on l'affiche directement
                // Si c'est un message public, il a tableId et on vérifie
                if (!data.tableId || data.tableId === sessionStorage.getItem('currentTableID')) {
                    showToast(data.message, data.isError ? 'error' : 'success');
                }
            }

            if (data.type === 'SEAT_BET_UPDATE' && data.tableId === sessionStorage.getItem('currentTableID')) {
                const { seatIndex, newAmountAtStake, seatBet } = data;
                // Mettre à jour le seatBet global
                setSeatBet(seatBet);
                // Mettre à jour le montant du siège (pour l'affichage)
                setTatami(prev => {
                    if (!prev) return prev;
                    const newSeats = [...prev.seats];
                    if (newSeats[seatIndex]) {
                        newSeats[seatIndex] = {
                            ...newSeats[seatIndex],
                            amount_at_stake: newAmountAtStake,
                        };
                    }
                    return { ...prev, seats: newSeats };
                });
            }

            if (data.type === 'POT_UPDATE' && data.tableId === sessionStorage.getItem('currentTableID')) {
                const { pot, seatBet } = data;
                setSeatBet(seatBet);
                setTatami(prev => prev ? { ...prev, pot } : prev);
            }
        };

        return () => ws.close();
    }, []);

    const handleOpenChat = () => {
        setOpenChatDialog(true);
        chatOpenRef.current = true;
        // Marquer tous les messages comme lus
        chatMessages.forEach(msg => readMessages.current.add(msg.id));
        setNewChatMessages(0);
        previousMessagesLength.current = chatMessages.length;
    };

    const handleCloseChat = () => {
        setOpenChatDialog(false);
        chatOpenRef.current = false;
    };

    const sendWSMessage = (type: string, payload: { tableId: string, seatIndex?: number, cardIndex?: number, content?: string }) => {
        const ws = wsRef.current;
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type, ...payload }));
        } else {
            // Option 1 : attendre l'ouverture (promesse)
            // Option 2 : recréer la connexion WebSocket
            console.warn("WebSocket non prête, tentative de reconnexion...");
            // Vous pouvez ici réinitialiser la WebSocket
            // Pour l'instant, on affiche un toast d'erreur
            showToast("Connexion WebSocket perdue, réessayez", "error");
        }
    };


    const handleCardDoubleClick = (seatNumber: number, index: number) => {
        const tableId = sessionStorage.getItem('currentTableID');
        if (!tableId) return;
        // Envoyer le message WebSocket pour jouer la carte
        sendWSMessage('PLAY_CARD', {
            tableId: tableId,
            seatIndex: seatNumber - 1,
            cardIndex: index,
        });
    };

    // 1. Définir les positions avec un type Record<number, string> pour éviter l’erreur d’index
    const seatPositions: Record<number, string> = {
        1: "absolute -top-6 left-1/2 transform -translate-x-1/2",
        2: "absolute top-1/2 -right-6 transform -translate-y-1/2",
        3: "absolute -bottom-6 left-1/2 transform -translate-x-1/2",
        4: "absolute top-1/2 -left-6 transform -translate-y-1/2",
    };

    const handleUnseat = async () => {
        const token = localStorage.getItem('authToken');
        const tableId = sessionStorage.getItem('currentTableID');
        if (!token || !tableId) return;
        try {
            const response = await fetch(`${API_URL}/api/tables/${tableId}/unseat`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setTatami(data.table);
                localStorage.setItem('currentTatami', JSON.stringify(data.table));
                showToast("Vous vous êtes levé du siège", "success");

                await refreshUser();
            } else {
                const error = await response.json();
                showToast(error.error || "Impossible de se lever", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Erreur réseau", "error");
        }
    };

    const handleThreeSeven = () => {
        const tableId = sessionStorage.getItem('currentTableID');
        if (!tableId) return;
        const seatIndex = tatami?.seats?.findIndex(seat => seat.user_id === currentUser?.user_id);
        if (seatIndex === undefined || seatIndex === -1) {
            showToast("Vous n'êtes pas assis", "error");
            return;
        }
        if (!tatami || tatami.current_round === 0) {
            showToast("Aucune manche en cours", "error");
            return;
        }
        console.log("Envoi de CHECK_THREE_SEVEN pour table:", tableId, "seatIndex:", seatIndex);
        sendWSMessage('CHECK_THREE_SEVEN', {
            tableId: tableId,
            seatIndex: seatIndex,
        });
    };

    if (!tatami || !currentUser) {
        return <div className="text-center mt-20">Chargement...</div>;
    }
    const renderSeats = () => {
        const isCurrentUserSeated = tatami.seats?.some(seat => seat.user_id === currentUser?.user_id);
        return (
            <>
                {tatami.seats?.map((seat: { user_id: number; amount_at_stake: number }, idx: number) => {
                    const isConnected = tatami.seatsConnected && tatami.seatsConnected[idx] === true;
                    const seatNumber = idx + 1;
                    const userIdValue = seat.user_id;
                    const isOccupied = userIdValue !== 0;
                    const isCurrentUser = isOccupied && currentUser?.user_id === userIdValue;
                    const playerIndex = tatami.players?.indexOf(userIdValue);
                    const playerUsername = playerIndex !== -1 ? tatami.player_usernames?.[playerIndex] : null;
                    const occupantName = isOccupied
                        ? (isCurrentUser ? currentUser.username : playerUsername || `Joueur ${userIdValue}`)
                        : undefined;
                    const showSitButton = !isOccupied && !isCurrentUserSeated;
                    const chipsAmount = seat.amount_at_stake;
                    const isDealer = tatami?.dealer_seat_index === idx;

                    return (
                        <div key={seatNumber} className={seatPositions[seatNumber]}>
                            <Seat
                                seatID={seatNumber.toString()}
                                isOccupied={isOccupied}
                                username={occupantName}
                                chips={chipsAmount}
                                onSit={showSitButton ? () => {
                                    setSelectedSeat(seatNumber);
                                    setAmountAtStake(currentUser?.free_chips_amount_bankroll || 0);
                                    setSitOnTableDialogOpen(true);
                                } : undefined}
                                showCards={!!isCurrentUser}
                                handCards={isOccupied ? seatCards[idx]?.hand || [] : []}
                                playedCards={isOccupied ? seatCards[idx]?.played || [] : []}
                                isConnected={isConnected}
                                seatBet={seatBet}
                                onCardDoubleClick={isCurrentUser ? (index: number) => handleCardDoubleClick(seatNumber, index) : undefined}
                                isDealer={isDealer}
                            />
                        </div>
                    );
                })}
            </>
        );
    };

    return (
        <div className="min-h-screen grid grid-cols-1 bg-green-gradient font-suse overflow-y-auto justify-between w-full">
            <div className="mb-14">
                <div className={`${getContainerHeightClass()}`}>
                    <div className={`flex items-center justify-center m-2 min-w-[55em] overflow-auto ${getContainerAnotherHeightClass()}`}>
                        {isHeightAbove1200 &&
                            // Version pour hauteur > 1200px
                            <div className="bg-green-gradient p-[2px] rounded-xl shadow-lg">
                                <div className="relative bg-green-gradient w-[35em] 2md:w-[37em] 2lg:w-[57em] h-[37em] 2sm:h-[33em] 2md:h-[37em] rounded-xl shadow-xl">
                                    {renderSeats()}
                                    <div className="flex flex-col items-center justify-center h-full text-white text-lg font-bold capitalize">
                                        <p className="text-sm pb-2">{tatami.name}</p>
                                        <p>Pot : {tatami.pot} Chips</p>
                                    </div>
                                </div>
                            </div>

                        }

                        {isHeightAbove800 && !isHeightAbove1200 &&
                            // Version pour hauteur > 800px
                            <div className="bg-green-gradient p-[2px] rounded-xl shadow-lg">
                                <div className="relative bg-green-gradient w-[37em] 2lg:w-[57em] h-[28em] rounded-xl shadow-xl">
                                    {renderSeats()}
                                    <div className="flex flex-col items-center justify-center h-full text-white text-lg font-bold capitalize">
                                        <p className="text-sm pb-2">{tatami.name}</p>
                                        <p>Pot : {tatami.pot} Chips</p>
                                    </div>
                                </div>
                            </div>
                        }

                        {isHeightAbove640 && !isHeightAbove800 &&
                            // Version pour hauteur  800px
                            <div className="bg-green-gradient p-[2px] rounded-xl shadow-xl">
                                <div className="relative bg-green-gradient w-[35em] 2md:w-[37em] 2lg:w-[57em] h-[26em] rounded-xl shadow-xl">
                                    {renderSeats()}
                                    <div className="flex flex-col items-center justify-center h-full text-white text-lg font-bold capitalize">
                                        <p className="text-sm pb-2">{tatami.name}</p>
                                        <p>Pot : {tatami.pot} Chips</p>
                                    </div>
                                </div>
                            </div>

                        }

                        {!isHeightAbove640 &&
                            // Version pour hauteur  800px
                            <div className="bg-green-gradient p-[2px] rounded-xl shadow-lg">
                                <div className="relative bg-green-gradient w-[35em] 2md:w-[37em] 2lg:w-[57em] h-[25em] rounded-xl shadow-xl">
                                    {renderSeats()}
                                    <div className="flex flex-col items-center justify-center h-full text-white text-lg font-bold capitalize">
                                        <p className="text-sm pb-2">{tatami.name}</p>
                                        <p>Pot : {tatami.pot} Chips</p>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>

            <SitOnTableDialog
                open={sitOnTableDialogOpen}
                onConfirm={handleSitWithAmount} // ← on passe la fonction complète
                onCancel={() => setSitOnTableDialogOpen(false)}
                maxAmount={maxAmountAtStake}
            />

            <ChatDialog
                open={openChatDialog}
                messages={chatMessages}
                onSendMessage={sendChatMessage}
                onCancel={handleCloseChat}
            />

            {/* Barre d'actions en bas */}
            <div className="flex min-w-[55em]">
                <div className="bg-green-gradient backdrop-blur-sm py-4 px-6 flex justify-center self-center gap-4 flex-wrap shadow-xl rounded-xl mb-8 mt-14 mx-auto">
                    <button
                        onClick={handleOpenChat}
                        className="relative hover:bg-[#0FAC71] text-white font-semibold py-2 px-4 rounded-full transition duration-200 shadow-lg"
                    >
                        {newChatMessages > 0 && (
                            <div className="absolute -top-1 -right-1 bg-red-600 rounded-full px-2.5 py-0.5 shadow-md z-20 text-xs">
                                {newChatMessages}
                            </div>
                        )}
                        <MessageCircleMore className="w-5 h-5" />
                    </button>

                    <button
                        onClick={handleThreeSeven}
                        className="flex items-center hover:bg-[#0FAC71] text-white font-semibold py-2 px-6 rounded-lg transition duration-200 shadow-lg"
                    >
                        <Dice3 className="w-4 h-4 me-2" />
                        <span>3 sept</span>
                    </button>

                    <button className="flex items-center hover:bg-[#0FAC71] text-white font-semibold py-2 px-6 rounded-lg transition duration-200 shadow-lg">
                        <Gift className="w-4 h-4 me-2" />
                        <span>Tia</span>
                    </button>

                    <button className="flex items-center hover:bg-[#0FAC71] text-white font-semibold py-2 px-6 rounded-lg transition duration-200 shadow-lg">
                        <Pause className="w-4 h-4 me-2" />
                        <span>Pause</span>
                    </button>

                    {/* Bouton Se lever (conditionnel) */}
                    {tatami.seats?.some(seat => seat.user_id === currentUser?.user_id) && (
                        <button onClick={handleUnseat} className="flex items-center hover:bg-[#0FAC71] text-white font-semibold py-2 px-6 rounded-lg transition duration-200 shadow-lg">
                            <LogOut className="w-4 h-4 me-2" />
                            <span>Se lever</span>
                        </button>
                    )}

                    <button onClick={handleLeaveTatami} className="flex items-center hover:bg-[#0FAC71] text-white font-semibold py-2 px-6 rounded-lg transition duration-200 shadow-lg">
                        <SquareArrowRightExit className="w-4 h-4 me-2" />
                        <span>Quitter</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
export default GameProgress; 