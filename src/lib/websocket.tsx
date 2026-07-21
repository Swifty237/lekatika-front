// src/utils/websocket.ts
export const getWebSocketUrl = (token: string): string => {
    const apiUrl = import.meta.env.VITE_LEKATIKA_SERVER_URI;
    if (!apiUrl) {
        throw new Error('VITE_LEKATIKA_SERVER_URI is not defined');
    }
    const url = new URL(apiUrl);
    const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws';
    return `${wsProtocol}://${url.host}/ws?token=${encodeURIComponent(token)}`;
};