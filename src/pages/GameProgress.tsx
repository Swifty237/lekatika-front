/* eslint-disable react-hooks/exhaustive-deps */
import Seat from '@/components/Seat';
import type TatamiProps from '@/types/Tatami';
import { MessageCircle, Pause, SquareArrowRightExit } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const GameProgress: React.FC = () => {
    const [tatami, setTatami] = useState<TatamiProps>();
    const [isHeightAbove1200, setIsHeightAbove1200] = useState(false);
    const [isHeightAbove800, setIsHeightAbove800] = useState(false);
    const [isHeightAbove640, setIsHeightAbove640] = useState(false);
    const API_URL = import.meta.env.VITE_LEKATIKA_SERVER_URI;

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
        const tableId = localStorage.getItem('currentTableId');
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
            localStorage.removeItem('currentTableId');
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
        const handleBeforeUnload = () => {
            const token = localStorage.getItem('authToken');
            const tableId = localStorage.getItem('currentTableId');

            const isManualLeave = sessionStorage.getItem('manualLeave');
            if (isManualLeave) {
                sessionStorage.removeItem('manualLeave');
                if (!token || !tableId) return;
                fetch(`${API_URL}/api/tables/${tableId}/leave`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                    keepalive: true
                }).catch(console.error);
                return;
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    // Chargement initial de la table
    useEffect(() => {
        const fetchTable = async () => {
            const tableId = localStorage.getItem('currentTableId');
            const token = localStorage.getItem('authToken');
            if (!tableId || !token) {
                window.close();
                return;
            }
            try {
                const response = await fetch(`${API_URL}/api/tables/${tableId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setTatami(data.table);
                    localStorage.setItem('currentTatami', JSON.stringify(data.table));
                } else {
                    window.close();
                }
            } catch (err) {
                console.error(err);
                window.close();
            }
        };
        fetchTable();
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

    if (!tatami) {
        return <div className="text-center mt-20">Chargement...</div>;
    }

    return (
        <div className="min-h-screen grid grid-cols-1 bg-green-gradient font-suse overflow-y-auto justify-between">
            <div className="mb-14">
                <div className={`${getContainerHeightClass()}`}>
                    <div className={`flex items-center justify-center m-2 min-w-[55em] overflow-auto ${getContainerAnotherHeightClass()}`}>
                        {isHeightAbove1200 &&
                            // Version pour hauteur > 1200px
                            <div className="bg-green-gradient p-[2px] rounded-xl shadow-lg">
                                <div className="relative bg-green-gradient w-[35em] 2md:w-[37em] 2lg:w-[57em] h-[37em] 2sm:h-[33em] 2md:h-[37em] rounded-xl shadow-xl">
                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2"><Seat seatID="1" /></div>
                                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"><Seat seatID="3" /></div>
                                    <div className="absolute top-1/2 -left-6 transform -translate-y-1/2"><Seat seatID="4" /></div>
                                    <div className="absolute top-1/2 -right-6 transform -translate-y-1/2"><Seat seatID="2" /></div>
                                    <div className="flex flex-col items-center justify-center h-full text-white text-lg font-bold capitalize">
                                        <p className="text-sm pb-2">{tatami.name}</p>
                                        <p>Pot : 0 Chips</p>
                                    </div>
                                </div>
                            </div>

                        }

                        {isHeightAbove800 && !isHeightAbove1200 &&
                            // Version pour hauteur > 800px
                            <div className="bg-green-gradient p-[2px] rounded-xl shadow-lg">
                                <div className="relative bg-green-gradient w-[37em] 2lg:w-[57em] h-[28em] rounded-xl shadow-xl">
                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2"><Seat seatID="1" /></div>
                                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"><Seat seatID="3" /></div>
                                    <div className="absolute top-1/2 -left-6 transform -translate-y-1/2"><Seat seatID="4" /></div>
                                    <div className="absolute top-1/2 -right-6 transform -translate-y-1/2"><Seat seatID="2" /></div>
                                    <div className="flex flex-col items-center justify-center h-full text-white text-lg font-bold capitalize">
                                        <p className="text-sm pb-2">{tatami.name}</p>
                                        <p>Pot : 0 Chips</p>
                                    </div>
                                </div>
                            </div>
                        }

                        {isHeightAbove640 && !isHeightAbove800 &&
                            // Version pour hauteur  800px
                            <div className="bg-green-gradient p-[2px] rounded-xl shadow-xl">
                                <div className="relative bg-green-gradient w-[35em] 2md:w-[37em] 2lg:w-[57em] h-[26em] rounded-xl shadow-xl">
                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2"><Seat seatID="1" /></div>
                                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"><Seat seatID="3" /></div>
                                    <div className="absolute top-1/2 -left-6 transform -translate-y-1/2"><Seat seatID="4" /></div>
                                    <div className="absolute top-1/2 -right-6 transform -translate-y-1/2"><Seat seatID="2" /></div>
                                    <div className="flex flex-col items-center justify-center h-full text-white text-lg font-bold capitalize">
                                        <p className="text-sm pb-2">{tatami.name}</p>
                                        <p>Pot : 0 Chips</p>
                                    </div>
                                </div>
                            </div>

                        }

                        {!isHeightAbove640 &&
                            // Version pour hauteur  800px
                            <div className="bg-green-gradient p-[2px] rounded-xl shadow-lg">
                                <div className="relative bg-green-gradient w-[35em] 2md:w-[37em] 2lg:w-[57em] h-[25em] rounded-xl shadow-xl">
                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2"><Seat seatID="1" /></div>
                                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"><Seat seatID="3" /></div>
                                    <div className="absolute top-1/2 -left-6 transform -translate-y-1/2"><Seat seatID="4" /></div>
                                    <div className="absolute top-1/2 -right-6 transform -translate-y-1/2"><Seat seatID="2" /></div>
                                    <div className="flex flex-col items-center justify-center h-full text-white text-lg font-bold capitalize">
                                        <p className="text-sm pb-2">{tatami.name}</p>
                                        <p>Pot : 0 Chips</p>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>

            {/* Barre d'actions en bas */}
            <div className="flex min-w-[55em]">
                <div className="bg-green-gradient backdrop-blur-sm py-4 px-6 flex justify-center self-center gap-4 flex-wrap shadow-xl rounded-xl mb-8 mt-14 mx-auto">
                    <button className="hover:bg-[#0FAC71] text-white font-semibold py-2 px-6 rounded-full transition duration-200 shadow-lg">
                        <MessageCircle className="w-4 h-4" />
                    </button>
                    <button className="flex items-center hover:bg-[#0FAC71] text-white font-semibold py-2 px-6 rounded-lg transition duration-200 shadow-lg">
                        <Pause className="w-4 h-4 me-2" />
                        <span>Se mettre en pause</span>
                    </button>
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