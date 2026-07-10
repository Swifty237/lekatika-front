import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Link, useParams } from 'react-router-dom';
import { showToast } from '@/components/CustomToast';
import { useUser } from '@/hooks/useUser';

interface UserProfileData {
    id: number;
    username: string;
    profile_picture_link?: string | null;
    // Ajoutez d'autres champs si nécessaire (bio, etc.)
}

const ProfileVisitor: React.FC = () => {
    // Récupérer l'ID depuis l'URL (ex: /profile-visitor/:userId)
    const { userId } = useParams<{ userId: string }>();
    // Ou bien via une prop
    // const { userId } = props;

    const [profileData, setProfileData] = useState<UserProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { user } = useUser();

    useEffect(() => {
        if (!userId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setError("Aucun utilisateur spécifié");
            setLoading(false);
            return;
        }

        // Dans fetchUserProfile
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(
                    `${import.meta.env.VITE_LEKATIKA_SERVER_URI}/api/users/${userId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    if (response.status === 404) throw new Error("Utilisateur non trouvé");
                    throw new Error("Erreur lors du chargement du profil");
                }

                const data = await response.json();
                console.log("Réponse API brute :", data); // <-- Log pour inspecter

                // Extraire l'utilisateur
                const userData = data.user || data;
                // Trouver l'ID
                const userIdValue = userData.id || userData.user_id || userData.ID || userData.userId;
                if (!userIdValue) {
                    throw new Error("Impossible de trouver l'identifiant de l'utilisateur");
                }

                setProfileData({
                    id: userIdValue,
                    username: userData.username,
                    profile_picture_link: userData.profile_picture_link,
                });
                setLoading(false);
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Erreur inconnue";
                setError(msg);
                showToast(msg, "error");
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="loader">Chargement...</div>
                </div>
            </MainLayout>
        );
    }

    if (error || !profileData) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-64 text-red-500">
                    {error || "Profil non disponible"}
                </div>
            </MainLayout>
        );
    }

    console.log("user connecté :", user);
    console.log("profileData reçu :", profileData);
    console.log("ID user connecté :", user?.user_id);
    console.log("ID profil visité :", profileData?.id);
    console.log("Comparaison :", user?.user_id === profileData?.id);

    return (
        <MainLayout>
            <div className="flex flex-col items-center">
                <div className="grid grid-cols-2 lg:w-[55vw]">
                    <h1 className="text-4xl font-bold my-4">
                        Profil
                    </h1>

                    {user && Number(user.user_id) === Number(profileData.id) && (
                        <Link to={`/profile`} className="flex justify-end items-center pe-4">
                            <span className="text-lg underline">Gestion du profil</span>
                        </Link>
                    )}
                </div>

                <div className="px-2 lg:px-8 pb-3 pt-8 lg:w-[55vw]">
                    <div className="grid grid-cols-1 xl:grid-cols-2 border shadow-md rounded-md gap-3 lg:gap-4 mb-8">
                        <div className="p-4">
                            <div className="flex justify-around">
                                <div className="w-[150px] h-[150px] shadow-xl rounded-full mb-4 overflow-hidden">
                                    <img
                                        src={profileData.profile_picture_link || "img/user-avatar.png"}
                                        className="w-full h-full object-cover"
                                        alt="Photo de profil"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 w-full">
                            <h1 className="text-3xl font-bold my-4 capitalize">
                                {profileData.username}
                            </h1>
                            {/* stats du joueur, etc ... */}
                        </div>
                    </div>

                    <h2 className="font-bold mb-2">Description</h2>
                    <div className="text-sm grid grid-col-1 border rounded-md shadow-md mb-8">
                        <div className="flex flex-col p-4">
                            <span>
                                {/* Ici vous pouvez afficher une bio si vous en avez une */}
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                                Aspernatur, eos sunt inventore similique assumenda quis culpa soluta, saepe eius cupiditate consequatur, earum omnis nesciunt fuga iste quibusdam incidunt quod laborum dolore!
                                Repellendus esse, nemo cumque deleniti odit quasi distinctio, dolorem dolore ad labore voluptatum alias. Dolor eos eum rerum. Blanditiis?
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ProfileVisitor;