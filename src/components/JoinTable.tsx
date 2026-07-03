// components/JoinTable.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showToast } from '@/components/CustomToast';

const JoinTable: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_LEKATIKA_SERVER_URI;

    useEffect(() => {
        const joinTable = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                // Stockez l'URL de destination pour rediriger après connexion
                localStorage.setItem('redirectAfterLogin', `/join/${id}`);
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/join/${id}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    sessionStorage.setItem('currentTableID', data.table.id);
                    navigate('/game-progress');
                } else {
                    const error = await response.json();
                    showToast(error.error || "Erreur lors de l'ajout à la table", "error");
                    navigate('/lobby');
                }
            } catch (error) {
                console.error(error);
                showToast("Erreur réseau", "error");
                navigate('/lobby');
            }
        };

        joinTable();
    }, [id, navigate]);

    return <div>Rejoindre la table...</div>;
};

export default JoinTable;