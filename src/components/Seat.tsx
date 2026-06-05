import React from 'react';
import { Button } from '@/components/ui/button';

interface SeatProps {
    seatID: string;
    isOccupied: boolean;
    username?: string;
    chips?: number;
    onSit?: () => void;
    onUnseat?: () => void;   // nouvelle prop
    showCards?: boolean;
}

const Seat: React.FC<SeatProps> = ({
    seatID,
    isOccupied,
    username,
    chips,
    onSit,
    showCards = true
}) => {
    const isSeatThree = seatID === '3';

    // Cas 1 : siège vide avec bouton "S'asseoir" (si onSit est fourni)
    if (!isOccupied && onSit) {
        return (
            <div
                id={seatID}
                className="w-20 h-20 bg-green-gradient rounded-full shadow-xl flex items-center justify-center text-white font-bold"
            >
                <Button
                    onClick={onSit}
                    className="bg-white text-[#0FAC71] hover:text-white hover:bg-[#0FAC71] rounded-xl p-4 shadow-xl"
                >
                    S'asseoir
                </Button>
            </div>
        );
    }

    // Cas 2 : siège vide (sans bouton, par exemple si la table est pleine ou en cours)
    if (!isOccupied) {
        return (
            <div
                id={seatID}
                className="w-20 h-20 bg-[#0FAC71] rounded-full shadow-xl flex items-center justify-center text-white font-bold"
            >
                <div className="bg-white text-[#0FAC71] text-center p-4 rounded-full shadow-xl">
                    Siège vide
                </div>
            </div>
        );
    }

    // Cas 3 : siège occupé
    return (
        <div id={seatID} className="relative w-20 h-20">
            {/* Avatar */}
            <div className="w-full h-full bg-[#0FAC71] rounded-full shadow-xl flex items-center justify-center text-white font-bold overflow-hidden">
                <img src="img/user-avatar.png" className="w-full h-full object-cover" alt="" />
            </div>

            {/* Éléments superposés (hors flux) - cartes cachées pour les autres joueurs */}
            {showCards && (
                <div className="absolute inset-0 pointer-events-none">
                    {isSeatThree ? (
                        // cartes non visibles pour le siège 3
                        <div className="absolute bottom-0 flex transform shadow-xl -translate-x-[110%] rounded-md z-10">
                            {[...Array(5)].map((_, i) => (
                                <img key={i} src="img/cards/hidden-card.png" className="w-[51px] h-[28px] relative shadow-xl px-[1px]" alt="" />
                            ))}
                        </div>
                    ) : (
                        // cartes non visibles pour les sièges 1, 2, 4
                        <div className="absolute bottom-0 flex transform shadow-xl -translate-x-[110%] rounded-md z-10">
                            {[...Array(5)].map((_, i) => (
                                <img key={i} src="img/cards/hidden-card.png" className="w-[51px] h-[28px] relative shadow-xl px-[1px]" alt="" />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Nom d'utilisateur et chips */}
            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white font-bold whitespace-nowrap capitalize underline shadow-sm">
                {username || `Joueur ${seatID}`}
                {chips !== undefined && ` (${chips} chips)`}
            </span>

            {/* Cartes visibles et mise (pour le joueur local ou si showCards) */}
            {showCards && (
                <div className={isSeatThree ? "relative bottom-[182%]" : "relative top-[35%]"}>
                    <p className="relative transform -translate-y-[20%] text-white text-center py-2 w-[150px] bg-[#0FAC71] shadow-md rounded-full">
                        Mise: {chips ?? 0} chips
                    </p>
                    <div className={`flex transform shadow-md ${isSeatThree ? '-translate-x-[128%] -translate-y-[40%]' : '-translate-x-[128%]'}`}>
                        {[...Array(5)].map((_, i) => (
                            <img key={i} src="img/cards/s10.png" className="w-[58px] h-[28px] relative object-cover shadow-xl px-[1px] border border-transparent border-b-white" alt="" />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Seat;