import React from 'react';
import { Button } from '@/components/ui/button';

interface SeatProps {
    seatID: string;
}

const Seat: React.FC<SeatProps> = ({ seatID }) => {
    const isPlayerSeated = false; // À remplacer par la vraie condition
    const isEmptySeat = false
    const isEmptySeatWithButton = true

    // const isCardsVisible = false
    const isSeatThree = seatID === '3';

    // Version siège vide
    if (isEmptySeatWithButton) {
        return (
            <div
                id={seatID}
                className="w-20 h-20 bg-green-gradient rounded-full shadow-xl flex items-center justify-center text-white font-bold"
            >
                <Button className="bg-white text-[#0FAC71] hover:text-white hover:bg-[#0FAC71] rounded-xl p-4 shadow-xl">
                    S'asseoir
                </Button>
            </div>
        );
    }


    if (isEmptySeat) {
        return (
            <div
                id={seatID}
                className="w-20 h-20 bg-[#0FAC71] rounded-full shadow-xl flex items-center justify-center text-white font-bold"
            >
                <div className="bg-white text-[#0FAC71] hover:text-white text-center hover:bg-[#0FAC71] p-4 rounded-full shadow-xl">
                    Siège vide
                </div>
            </div>
        );
    }

    if (isPlayerSeated) {
        return (
            <div id={seatID} className="relative w-20 h-20">
                {/* Avatar (cercle) */}
                <div className="w-full h-full bg-[#0FAC71] rounded-full shadow-xl flex items-center justify-center text-white font-bold overflow-hidden">
                    <img src="img/user-avatar.png" className="w-full h-full object-cover" alt="" />
                </div>

                {isSeatThree &&
                    <div className="relative bottom-[182%]">
                        {/* cartes visibles siège 3*/}
                        <div className="flex transform -translate-x-[128%] -translate-y-[40%] shadow-xl">
                            <img src="img/cards/s10.png" className="w-[58px] h-[28px] relative object-cover shadow-xl px-[1px] border border-transparent border-b-white" alt="" />
                            <img src="img/cards/s9.png" className="w-[58px] h-[28px] relative object-cover shadow-xl px-[1px] border border-transparent border-b-white" alt="" />
                            <img src="img/cards/s3.png" className="w-[58px] h-[28px] relative object-cover shadow-xl px-[1px] border border-transparent border-b-white" alt="" />
                            <img src="img/cards/h10.png" className="w-[58px] h-[28px] relative object-cover shadow-xl px-[1px] border border-transparent border-b-white" alt="" />
                            <img src="img/cards/h9.png" className="w-[58px] h-[28px] relative object-cover shadow-xl px-[1px] border border-transparent border-b-white" alt="" />
                        </div>
                        <p className="relative transform -translate-y-[20%] text-white text-center py-2 w-[150px] bg-[#0FAC71] shadow-md rounded-full">Mise: 100 chips</p>
                    </div>
                }

                {/* Éléments superposés (hors flux) */}
                <div className="absolute inset-0 pointer-events-none">

                    {isSeatThree ? (
                        // cartes non visibles siège 3
                        <div className="absolute bottom-0 flex transform  shadow-xl -translate-x-[110%] rounded-md z-10">
                            <img src="img/cards/hidden-card.png" className="w-[51px] h-[28px] relative object- shadow-xl px-[1px]" alt="" />
                            <img src="img/cards/hidden-card.png" className="w-[51px] h-[28px] relative object- shadow-xl px-[1px]" alt="" />
                            <img src="img/cards/hidden-card.png" className="w-[51px] h-[28px] relative object- shadow-xl px-[1px]" alt="" />
                            <img src="img/cards/hidden-card.png" className="w-[51px] h-[28px] relative object- shadow-xl px-[1px]" alt="" />
                            <img src="img/cards/hidden-card.png" className="w-[51px] h-[28px] relative object- shadow-xl px-[1px]" alt="" />
                        </div>
                    ) : (
                        // cartes non visibles sièges 1, 2, 4
                        <div className="absolute bottom-0 flex transform  shadow-xl -translate-x-[110%] rounded-md z-10">
                            <img src="img/cards/hidden-card.png" className="w-[51px] h-[28px] relative object- shadow-xl px-[1px]" alt="" />
                            <img src="img/cards/hidden-card.png" className="w-[51px] h-[28px] relative object- shadow-xl px-[1px]" alt="" />
                            <img src="img/cards/hidden-card.png" className="w-[51px] h-[28px] relative object- shadow-xl px-[1px]" alt="" />
                            <img src="img/cards/hidden-card.png" className="w-[51px] h-[28px] relative object- shadow-xl px-[1px]" alt="" />
                            <img src="img/cards/hidden-card.png" className="w-[51px] h-[28px] relative object- shadow-xl px-[1px]" alt="" />
                        </div>
                    )}
                </div>

                {/* Nom d'utilisateur sous l'avatar */}
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white font-bold whitespace-nowrap capitalize underline shadow-sm">
                    username (1000 chips)
                </span>

                {!isSeatThree &&
                    <div className="relative top-[35%]">
                        {/* cartes visibles 1, 2, 4 */}
                        <p className="relative transform -translate-y-[20%] text-white text-center py-2 w-[150px] bg-[#0FAC71] shadow-md rounded-full">Mise: 100 chips</p>
                        <div className="flex transform  shadow-md -translate-x-[128%]">
                            <img src="img/cards/s10.png" className="w-[58px] h-[28px] relative object-cover shadow-xl px-[1px] border border-transparent border-b-white" alt="" />
                            <img src="img/cards/s9.png" className="w-[58px] h-[28px] relative object-cover shadow-xl px-[1px] border border-transparent border-b-white" alt="" />
                            <img src="img/cards/s3.png" className="w-[58px] h-[28px] relative object-cover shadow-xl px-[1px] border border-transparent border-b-white" alt="" />
                            <img src="img/cards/h10.png" className="w-[58px] h-[28px] relative object-cover shadow-xl px-[1px] border border-transparent border-b-white" alt="" />
                            <img src="img/cards/h9.png" className="w-[58px] h-[28px] relative object-cover shadow-xl px-[1px] border border-transparent border-b-white" alt="" />
                        </div>
                    </div>
                }
            </div>
        );
    }
};

export default Seat;