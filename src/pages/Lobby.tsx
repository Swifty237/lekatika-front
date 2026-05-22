import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { SquareArrowOutUpRight } from 'lucide-react';

const Lobby: React.FC = () => {
    return (
        <MainLayout>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold my-4">
                    Bienvenue dans le Lobby
                </h1>
                <p className="text-lg">
                    Tout fonctionne correctement ! Cette page est protégée par le layout avec navbar et footer.
                </p>

                <div className="lg:w-[55vw] pt-8 flex w-full justify-around items-center">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-[40%]">
                        <label className="flex items-center gap-2 mb-4 lg:mb-0">
                            <input type="checkbox" checked className="w-4 h-4 rounded focus:ring-[#0FAC71]" />
                            <span>Argent fictif</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked className="w-4 h-4 rounded focus:ring-[#0FAC71]" />
                            <span>Argent réel</span>
                        </label>
                    </div>

                    <button type="button" onClick={() => { }} className="ms-4 hover:bg-[#0FAC71] transition flex items-center py-2 px-8 shadow-xl rounded-lg">
                        <SquareArrowOutUpRight className="h-4 w-4 me-2" />
                        <p>Nouveau tatami</p>
                    </button>
                </div>

                <div className="w-full lg:w-[55vw] min-h-[30vh] bg-white mt-8 rounded-md">

                </div>
            </div>
        </MainLayout>
    );
};

export default Lobby;