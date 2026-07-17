import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send } from 'lucide-react';
// import type { HandHistoryEntry } from '@/types/HandHistory';

interface ChatMessage {
    id: string;
    username: string;
    content: string;
    timestamp: string;
}

interface ChatDialogProps {
    open: boolean;
    messages: ChatMessage[];
    history: HandHistoryEntry[];
    onSendMessage: (content: string) => void;
    onCancel: () => void;
}

interface TurnCard {
    seatIndex: number;
    card: string;
}

interface TurnHistory {
    turnNumber: number;
    cardsPlayed: TurnCard[];
    notifications: string[];
}

interface HandHistoryEntry {
    handNumber: number;
    turns: TurnHistory[];
    winnerSeat: number;
    winnerUserID: number;
    isKorat: boolean;
    isAbandon: boolean;
}

const ChatDialog: React.FC<ChatDialogProps> = ({
    open,
    messages,
    history,
    onSendMessage,
    onCancel,
}) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open) {
            // Scroll en bas quand le dialogue s'ouvre
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [open, messages, history]);

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
            <DialogContent className="max-w-[90vw] 2md:max-w-[50vw] bg-[#2c5036] text-white h-[70vh] flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 border border-white rounded-lg">
                    {/* Section Historique des manches */}
                    {history.length > 0 && (
                        <div className="mb-4 border-b border-gray-400 pb-2">
                            <div className="text-xs text-gray-300 font-bold mb-2">📜 Historique des manches</div>
                            {history.map((hand, handIdx) => (
                                <div key={handIdx} className="mb-3 text-sm">
                                    <div className="text-xs text-gray-400 font-semibold">
                                        Manche {hand.handNumber}
                                    </div>
                                    {hand.turns.map((turn, turnIdx) => (
                                        <div key={turnIdx} className="ml-2 text-xs text-gray-400 italic">
                                            Tour {turn.turnNumber} :&nbsp;
                                            {turn.cardsPlayed.map((c, idx) => (
                                                <span key={idx}>
                                                    Joueur {c.seatIndex + 1} a joué {c.card}
                                                    {idx < turn.cardsPlayed.length - 1 && ', '}
                                                </span>
                                            ))}
                                            {turn.notifications.length > 0 && (
                                                <div className="ml-4 text-gray-300">
                                                    {turn.notifications.map((notif, i) => (
                                                        <div key={i} className="text-xs">• {notif}</div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div className="text-xs text-gray-300 mt-1">
                                        Vainqueur : {hand.winnerSeat !== -1 ? `Joueur ${hand.winnerSeat + 1}` : '—'}
                                        {hand.isKorat && ' (Korat)'}
                                        {hand.isAbandon && ' (par abandon)'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Messages de chat */}
                    {messages.length === 0 && history.length === 0 && (
                        <div className="text-gray-400 text-center">Aucun message</div>
                    )}
                    {messages.map((msg) => (
                        <div key={msg.id} className="mb-2 text-sm">
                            <span className="font-bold text-green-300">{msg.username}</span>
                            <span className="text-gray-300">: {msg.content}</span>
                        </div>
                    ))}
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