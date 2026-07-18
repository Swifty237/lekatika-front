import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send } from 'lucide-react';
import type HandHistoryEntry from '@/types/Tatami';
import cards from '../Cards';

interface ChatMessage {
    id: string;
    username: string;
    content: string;
    timestamp: string; // format ISO
}

interface ChatDialogProps {
    open: boolean;
    messages: ChatMessage[];
    history: HandHistoryEntry[];
    onSendMessage: (content: string) => void;
    onCancel: () => void;
    usernamesBySeat: string[];
}

const ChatDialog: React.FC<ChatDialogProps> = ({
    open,
    messages,
    history,
    usernamesBySeat,
    onSendMessage,
    onCancel,
}) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Construire une timeline combinée triée par timestamp
    const timeline = useMemo(() => {
        const items: { type: 'message' | 'history', data: ChatMessage | HandHistoryEntry, timestamp: number }[] = [];

        messages.forEach(msg => {
            const ts = new Date(msg.timestamp).getTime();
            items.push({ type: 'message', data: msg, timestamp: ts });
        });

        history.forEach(hand => {
            // Le timestamp du serveur est en millisecondes (UnixMilli)
            const ts = hand.timestamp;
            items.push({ type: 'history', data: hand, timestamp: ts });
        });

        // Trier par ordre croissant (les plus anciens en premier)
        items.sort((a, b) => a.timestamp - b.timestamp);
        return items;
    }, [messages, history]);

    // Scroll en bas quand la timeline change
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [open, timeline]);

    const handleSend = () => {
        if (input.trim()) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
            <DialogContent className="max-w-[98vw] sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[50vw] bg-[#2c5036] text-white h-[75vh]">
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-auto p-2 border border-white rounded-lg">
                    {timeline.length === 0 && (
                        <div className="text-gray-400 text-center">Aucun message</div>
                    )}
                    {timeline.map((item, index) => {
                        if (item.type === 'message') {
                            const msg = item.data as ChatMessage;
                            return (
                                <div key={msg.id || index} className="mb-2 text-md">
                                    <span className="font-bold text-green-300 capitalize">{msg.username}</span>
                                    <span className="text-gray-300">: {msg.content}</span>
                                </div>
                            );
                        } else {
                            const hand = item.data as HandHistoryEntry;
                            return (
                                <div key={index} className="my-3 mx-8 text-md border-t border-gray-500 p-2 bg-[#2d3436]">
                                    <div className="text-gray-400 font-semibold">
                                        Manche {hand.handNumber}
                                    </div>
                                    {hand.turns.map((turn, turnIdx) => (
                                        <div key={turnIdx} className="mt-2 text-md text-gray-400 w-[98%]">
                                            <span className="me-2">Tour {turn.turnNumber} : </span>

                                            <div className="grid grid-cols-2">
                                                {turn.cardsPlayed.map((c, idx) => {
                                                    const cardKey = c.card;
                                                    const cardImage = cards[cardKey as keyof typeof cards] || null;
                                                    const username = usernamesBySeat[c.seatIndex] || `Joueur ${c.seatIndex + 1}`;

                                                    return (
                                                        <div className="flex items-center justify-center w-full">
                                                            <div key={idx} className="grid grid-cols-2 gap-1 border border-gray-600 flex items-center w-full p-1 m-1">
                                                                <span className="capitalize">{username}</span>
                                                                <img src={cardImage!} className="w-12 h-10" alt={c.card} />
                                                            </div>
                                                        </div>

                                                    );
                                                })}
                                            </div>

                                            {turn.notifications.length > 0 && (
                                                <div className="ml-4 text-gray-300">
                                                    {turn.notifications.map((notif, i) => (
                                                        <div key={i} className="text-xs">• {notif}</div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div className="text-gray-300">
                                        Vainqueur : {hand.winnerSeat !== -1 ? usernamesBySeat[hand.winnerSeat + 1] : `Joueur ${hand.winnerSeat + 1}`}
                                        {hand.isKorat && ' (Korat)'}
                                        {hand.isAbandon && ' (par abandon)'}
                                    </div>
                                </div>
                            );
                        }
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <DialogFooter className="border-transparent pt-2">
                    <div className="w-full flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Écrire un message..."
                            className="flex-1 px-3 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#0FAC71]"
                        />
                        <Button
                            className="border border-white hover:bg-[#0FAC71] hover:border-[#0FAC71]"
                            onClick={handleSend}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                        <Button
                            className="border border-white hover:bg-[#0FAC71] hover:border-[#0FAC71]"
                            onClick={onCancel}
                        >
                            Fermer
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ChatDialog;