import React from 'react';
import MainLayout from '../layouts/MainLayout';

const Profile: React.FC = () => {
    return (
        <MainLayout>
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">
                    Bienvenue sur la page de profil
                </h1>
                <p className="text-lg">
                    Tout fonctionne correctement ! Cette page est protégée par le layout avec navbar et footer.
                </p>

            </div>
        </MainLayout>
    );
};

export default Profile;