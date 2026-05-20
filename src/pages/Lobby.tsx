import React from 'react';
import MainLayout from '../layouts/MainLayout';

const Lobby: React.FC = () => {
    return (
        <MainLayout>
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">
                    Bienvenue dans le Lobby
                </h1>
                <p className="text-lg">
                    Tout fonctionne correctement ! Cette page est protégée par le layout avec navbar et footer.
                </p>

                <div className="w-full min-h-[30vh] bg-white mt-8 rounded-md">

                </div>
            </div>
        </MainLayout>
    );
};

export default Lobby;