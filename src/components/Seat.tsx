import React from 'react';
import { Button } from '@/components/ui/button';
import { WifiOff } from 'lucide-react';

interface SeatProps {
    seatID: string;
    isOccupied: boolean;
    username?: string;
    chips?: number;
    onSit?: () => void;
    onUnseat?: () => void;   // nouvelle prop
    showCards?: boolean;
    handCardCount?: number;   // cartes cachées (posées face cachée)
    playedCardCount?: number;  // cartes visibles (main du joueur)
    isConnected?: boolean;
    seatBet: number;
}

const Seat: React.FC<SeatProps> = ({
    seatID,
    isOccupied,
    username,
    chips,
    onSit,
    showCards = true,
    handCardCount = 0,
    playedCardCount = 0,
    isConnected,
    seatBet
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

    const getTranslateX = (cardCount: number): string => {
        // Valeurs à ajuster expérimentalement
        const map: Record<number, string> = {
            1: '-translate-x-[-10%]',   // 50%
            2: '-translate-x-[20%]',
            3: '-translate-x-[60%]',
            4: '-translate-x-[90%]',
            5: '-translate-x-[110%]',
        };
        return map[cardCount] || '-translate-x-1/2';
    };

    // Cas 3 : siège occupé
    return (
        <div id={seatID} className="relative w-20 h-20">
            {/* Badge de déconnexion */}
            {isConnected === false && (
                <div className="absolute -top-2 -right-2 bg-red-600 rounded-full p-0.5 shadow-md z-20">
                    <WifiOff className="w-5 h-5 text-white" />
                </div>
            )}
            {/* Avatar */}
            <div className="w-full h-full bg-[#0FAC71] rounded-full shadow-xl flex items-center justify-center text-white font-bold overflow-hidden">
                <img src="img/user-avatar.png" className="w-full h-full object-cover" alt="" />
            </div>

            {/* Éléments superposés (hors flux) */}
            {/* Affichage cartes visibles par un seul joueur utilisateur local */}
            {handCardCount > 0 && showCards && (
                <div className="absolute inset-0 pointer-events-none">
                    {isSeatThree ? (
                        <div className={`absolute bottom-0 flex transform shadow-xl rounded-md z-10 w-[47px] xl:w-[57px] ${getTranslateX(handCardCount)}`}>
                            {[...Array(handCardCount)].map((_, i) => (
                                <img key={i} src="img/cards/c3.png" className="relative shadow-xl border border-transparent border-b-white rounded-sm" alt="" />
                            ))}
                        </div>
                    ) : (
                        // cartes non visibles pour les sièges 1, 2, 4
                        <div className={`absolute bottom-0 flex transform shadow-xl rounded-md z-10 w-[47px] xl:w-[57px] ${getTranslateX(handCardCount)}`}>
                            {[...Array(handCardCount)].map((_, i) => (
                                <img key={i} src="img/cards/c3.png" className="relative shadow-xl border border-transparent border-b-white rounded-sm" alt="" />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Affichage cartes faces cachées pour les joueurs autre que le joueur utilisateur local */}
            {handCardCount > 0 && !showCards && (
                <div className="absolute inset-0 pointer-events-none">
                    {isSeatThree ? (
                        // cartes non visibles pour le siège 3
                        <div className={`absolute bottom-0 flex transform shadow-xl rounded-md z-10 w-[47px] xl:w-[57px] ${getTranslateX(handCardCount)}`}>
                            {[...Array(handCardCount)].map((_, i) => (
                                <img key={i} src="img/cards/hidden-card.png" className="w-[47px] xl:w-[57px] relative shadow-xl border border-transparent border-b-white rounded-sm" alt="" />
                            ))}
                        </div>
                    ) : (
                        // cartes non visibles pour les sièges 1, 2, 4
                        <div className={`absolute bottom-0 flex transform shadow-xl rounded-md z-10 w-[47px] xl:w-[57px] ${getTranslateX(handCardCount)}`}>
                            {[...Array(handCardCount)].map((_, i) => (
                                <img key={i} src="img/cards/hidden-card.png" className="relative shadow-xl border border-transparent border-b-white rounded-sm" alt="" />
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

            {/* Cartes jouées par le joueur local visibles par tout le monde et lui même */}
            {playedCardCount > 0 && (
                <div className={isSeatThree ? "relative bottom-[175%]" : "relative top-[35%]"}>
                    <p className="relative transform -translate-y-[20%] text-white text-center py-2 w-[150px] bg-[#0FAC71] shadow-md rounded-full">
                        Mise: {seatBet ?? 0} chips
                    </p>
                    <div className={`flex transform shadow-md w-[47px] xl:w-[57px] ${getTranslateX(playedCardCount)} ${isSeatThree ? ' -translate-y-[40%]' : '-translate-y-[30%]'}`}>
                        {[...Array(playedCardCount)].map((_, i) => (
                            <img key={i} src="img/cards/c4.png" className="relative object-cover shadow-xl border border-transparent border-b-white rounded-sm" alt="" />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Seat;