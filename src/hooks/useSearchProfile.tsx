import type UserProps from "@/types/User";

const searchUsers = async (query: string): Promise<UserProps[]> => {
    if (!query || query.length < 2) return [];

    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(
            `${import.meta.env.VITE_LEKATIKA_SERVER_URI}/api/users/search?q=${encodeURIComponent(query)}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors de la recherche');
        }

        const data = await response.json();
        return data.users.map((u: UserProps) => ({
            user_id: u.user_id,
            username: u.username,
            profile_picture_link: u.profile_picture_link || null,
        }));
    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
};

export default searchUsers;