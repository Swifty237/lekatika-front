import { MessageCircle, Pause, SquareArrowRightExit } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const GameProgress: React.FC = () => {
    const [tatami, setTatami] = useState<unknown>(null);
    const API_URL = import.meta.env.VITE_LEKATIKA_SERVER_URI;

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
        await performLeave();
        window.close(); // ferme l'onglet après la requête
    };

    // Gérer la fermeture non contrôlée (croix de l'onglet, rafraîchissement)
    useEffect(() => {
        const handleBeforeUnload = () => {
            const token = localStorage.getItem('authToken');
            const tableId = localStorage.getItem('currentTableId');
            if (!token || !tableId) return;
            // Requête asynchrone avec keepalive pour qu'elle soit envoyée même si l'onglet se ferme
            fetch(`${API_URL}/api/tables/${tableId}/leave`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
                keepalive: true
            }).catch(console.error);
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

    if (!tatami) {
        return <div className="text-center mt-20">Chargement...</div>;
    }

    return (
        // Conteneur principal : fond dégradé vertical, occupation totale, colonne flex
        <div className="min-h-screen flex flex-col bg-green-gradient font-suse">

            {/* Zone centrale qui pousse la barre d'actions vers le bas */}
            <div className="flex-1 flex items-center justify-center p-4">

                {/* Carré (table de jeu) : carré parfait (w-96 h-96 sur desktop, responsive) */}
                <div className="relative w-96 h-96 md:w-[37em] md:h-[37em] rounded-xl shadow-2xl">

                    {/* Cercle du haut (siège joueur 1) : centré horizontalement, en haut du carré */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <div className="w-20 h-20 bg-[#0FAC71] rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold">
                            1
                        </div>
                    </div>

                    {/* Cercle du bas (siège joueur 3) */}
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                        <div className="w-20 h-20 bg-[#0FAC71] rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold">
                            3
                        </div>
                    </div>

                    {/* Cercle de gauche (siège joueur 4) */}
                    <div className="absolute top-1/2 -left-6 transform -translate-y-1/2">
                        <div className="w-20 h-20 bg-[#0FAC71] rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold">
                            4
                        </div>
                    </div>

                    {/* Cercle de droite (siège joueur 2) */}
                    <div className="absolute top-1/2 -right-6 transform -translate-y-1/2">
                        <div className="w-20 h-20 bg-[#0FAC71] rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold">
                            2
                        </div>
                    </div>

                    {/* Optionnel : un motif ou texte au centre de la table */}
                    <div className="flex items-center justify-center h-full text-white text-lg font-bold">
                        Tatami-KD2026
                    </div>
                </div>
            </div>

            {/* Barre d'actions en bas (fixée en bas, mais dans le flux flex grâce à mt-auto) */}
            <div className="backdrop-blur-sm py-4 px-6 flex justify-center gap-4 flex-wrap shadow-2xl rounded-xl self-center mb-8">
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
    );
};

export default GameProgress;