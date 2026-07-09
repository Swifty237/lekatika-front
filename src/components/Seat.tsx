import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WifiOff } from 'lucide-react';
import cards from '@/components/Cards';
import Timer from './Timer';

interface SeatProps {
    seatID: string;
    isOccupied: boolean;
    username?: string;
    chips?: number;
    onSit?: () => void;
    onUnseat?: () => void;
    showCards?: boolean;
    handCards?: string[];        // ← nouvelle prop
    playedCards?: string[];      // ← nouvelle prop
    isConnected?: boolean;
    seatBet: number;
    onCardDoubleClick?: (index: number) => void;
    isDealer?: boolean;
    inBreak: boolean;
}


const Seat: React.FC<SeatProps> = ({
    seatID,
    isOccupied,
    username,
    chips,
    onSit,
    showCards = true,
    handCards = [],
    playedCards = [],
    isConnected,
    seatBet,
    onCardDoubleClick,
    isDealer = false,
    inBreak = false
}) => {

    const [isDragOver, setIsDragOver] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [timer, setTimer] = useState(0)

    const isSeatFour = seatID === '4';
    const isSeatThree = seatID === '3';
    // const isSeatTwo = seatID === '2';
    const isSeatOne = seatID === '1';

    // Début du drag sur une carte en main (uniquement pour le joueur local)
    const handleDragStart = (e: React.DragEvent, index: number) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ seatID, index }));
        e.dataTransfer.effectAllowed = 'move';
    };

    // Pour autoriser le drop sur la zone des cartes jouées
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsDragOver(true);
    };

    // Quand la souris quitte la zone de drop
    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    // Réception du drop
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            // Vérifier que le drop vient du même siège (sinon on ignore)
            if (data.seatID === seatID && onCardDoubleClick) {
                onCardDoubleClick(data.index);
            }
        } catch (err) {
            console.error('Drop error:', err);
        }
    };

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
            <div className="absolute -bottom-2 -left-2 rounded-full shadow-md z-20">
                <Timer timer={timer} />
            </div>
            {/* Badge de déconnexion */}
            {isConnected === false && (
                <div className="absolute -top-2 -right-2 bg-red-600 rounded-full p-0.5 shadow-md z-20">
                    <WifiOff className="w-5 h-5 text-white" />
                </div>
            )}

            {isDealer && isSeatOne && (
                <div className="absolute -bottom-[85%] -left-12 rounded-full p-0.5 shadow-md z-20">
                    <img src="img/dealer-button.svg" className="w-full h-full object-cover" alt="" />
                </div>
            )}

            {isDealer && isSeatFour && (
                <div className="absolute -top-7 -right-12 rounded-full p-0.5 shadow-md z-20">
                    <img src="img/dealer-button.svg" className="w-full h-full object-cover" alt="" />
                </div>
            )}

            {isDealer && !isSeatOne && !isSeatFour && (
                <div className="absolute -top-7 -left-12 rounded-full p-0.5 shadow-md z-20">
                    <img src="img/dealer-button.svg" className="w-full h-full object-cover" alt="" />
                </div>
            )}

            {/* Avatar */}
            <div className="w-full h-full bg-[#0FAC71] rounded-full shadow-xl flex items-center justify-center text-white font-bold overflow-hidden">
                <img src="img/user-avatar.png" className="w-full h-full object-cover" alt="" />
            </div>

            {/* Éléments superposés (hors flux) */}
            {/* Affichage cartes visibles par un seul joueur utilisateur local */}
            {handCards.length > 0 && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
                    {handCards.map((cardKey, idx) => {
                        const imgSrc = showCards
                            ? cards[cardKey as keyof typeof cards] || cards.hiddenCard
                            : cards.hiddenCard;

                        return showCards ? (
                            <button
                                key={idx}
                                draggable
                                onDragStart={(e) => handleDragStart(e, idx)}
                                className="w-14 h-12 p-0 border-none bg-transparent cursor-grab hover:scale-105 transition-transform"
                                onDoubleClick={() => onCardDoubleClick && onCardDoubleClick(idx)}
                            >
                                <img src={imgSrc} className="w-full h-full object-cover rounded-sm shadow-md" alt="card" />
                            </button>
                        ) : (
                            <div key={idx} className="w-14 h-12">
                                <img src={imgSrc} className="w-full h-full object-cover rounded-sm shadow-md" alt="card" />
                            </div>
                        );
                    })}
                </div>
            )}

            {inBreak && handCards.length === 0 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-1 z-10 font-bold">
                    <span className="bg-green-700  text-white p-1 w-24 text-center">
                        EN PAUSE
                    </span>
                </div>
            )}

            {/* Nom d'utilisateur et chips */}
            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white font-bold whitespace-nowrap capitalize underline shadow-sm">
                {username || `Joueur ${seatID}`}
                {chips !== undefined && ` (${chips} chips)`}
            </span>

            {/* Cartes jouées par le joueur local visibles par tout le monde et lui même */}
            {/* Zone de drop et d'affichage des cartes jouées (visible uniquement pour le joueur local) */}
            <div
                className={`${isSeatThree ? "relative bottom-[235%] flex flex-col-reverse" : "relative top-[35%]"} ${showCards && isDragOver ? 'bg-green-200 bg-opacity-20 rounded-lg' : ''
                    } ${showCards ? 'min-h-[80px]' : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                {...(showCards ? {
                    onDragOver: handleDragOver,
                    onDragLeave: handleDragLeave,
                    onDrop: handleDrop,
                } : {})}
            >
                {/* Étiquette "Mise" */}
                <p className="relative text-white text-center w-[150px]">
                    Mise: {seatBet ?? 0}
                </p>

                {/* Conteneur des cartes jouées */}
                <div className={`relative mt-7`}>
                    {playedCards.length === 0 && showCards && (
                        <div className={`text-white text-xs opacity-50 italic`}>Déposez ici</div>
                    )}

                    {playedCards.length > 0 && (
                        <div className={`flex justify-center items-center ${isSeatThree ? 'h-[55px]' : 'h-[1px]'}`}>
                            {playedCards.map((cardKey, idx) => {
                                const imgSrc = cards[cardKey as keyof typeof cards] || cards.hiddenCard;
                                if (isHovered) {
                                    // Mode déplié : toutes les cartes en ligne
                                    return (
                                        <img
                                            key={idx}
                                            src={imgSrc}
                                            className="w-14 h-12 object-cover rounded-sm shadow-md"
                                            alt="played card"
                                        />
                                    );
                                } else {
                                    // Mode pile : les cartes sont centrées et superposées
                                    return (
                                        <img
                                            key={idx}
                                            src={imgSrc}
                                            className="absolute w-14 h-12 object-cover rounded-sm shadow-md"
                                            style={{
                                                transform: `translateX(${idx * 7}px`,
                                                zIndex: idx,
                                            }}
                                            alt="played card"
                                        />
                                    );
                                }
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Seat;