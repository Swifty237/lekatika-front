import React, { useState, useEffect, useCallback } from 'react';
import type UserProps from '@/types/User';

export interface UserContextType {
    user: UserProps | null;
    setUser: (user: UserProps | null) => void;
    refreshUser: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = React.createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProps | null>(null);
    const API_URL = import.meta.env.VITE_LEKATIKA_SERVER_URI;

    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setUser(null);
            return;
        }
        try {
            const response = await fetch(`${API_URL}/api/user/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const result = await response.json();
                if (result.user) {
                    const userData: UserProps = {
                        user_id: result.user.user_id || result.user.id || result.user.ID,
                        username: result.user.username,
                        email: result.user.email,
                        free_chips_amount_bankroll: result.user.free_chips_amount_bankroll,
                        real_chips_amount_bankroll: result.user.real_chips_amount_bankroll,
                        profile_picture_link: result.user.profile_picture_link,
                    };
                    setUser(userData);
                    localStorage.setItem('userID', userData.user_id.toString());
                    localStorage.setItem('username', userData.username);
                    localStorage.setItem('freeChipsAmountBankroll', userData.free_chips_amount_bankroll?.toString() || '0');
                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("Error fetching user:", err);
            setUser(null);
        }
    }, [API_URL]);

    const refreshUser = useCallback(async () => {
        await fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchUser();
        } else {
            setUser(null);
        }
    }, [fetchUser]);

    return (
        <UserContext.Provider value={{ user, setUser, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
};