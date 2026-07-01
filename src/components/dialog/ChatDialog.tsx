import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ChatMessage {
    username: string;
    content: string;
    timestamp: string;
}

interface ChatDialogProps {
    open: boolean;
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
    onCancel: () => void;
}

const ChatDialog: React.FC<ChatDialogProps> = ({
    open,
    messages,
    onSendMessage,
    onCancel,
}) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (input.trim()) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
            <DialogContent className="max-w-[90vw] 2md:max-w-[50vw] bg-[#2c5036] text-white h-[70vh] flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 border border-white rounded-lg">
                    {messages.length === 0 ? (
                        <div className="text-gray-400 text-center">Aucun message pour l'instant</div>
                    ) : (
                        messages.map((msg, i) => (
                            <div key={i} className="mb-2">
                                <span className="font-bold text-green-400">{msg.username}</span>
                                <span className="text-sm text-gray-400 ml-2">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                                <div className="pl-4">{msg.content}</div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <DialogFooter className="border-transparent pt-2">
                    <div className="w-full">
                        <div className="flex flex-col px-2 pb-2">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Écrivez votre message..."
                                rows={3}
                                className="w-full px-3 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71] text-black"
                            />
                        </div>
                        <div className="flex justify-end gap-2 me-2">
                            <Button className="border border-white hover:bg-[#0FAC71] hover:border-[#0FAC71]" onClick={onCancel}>Fermer</Button>
                            <Button className="border border-white hover:bg-[#0FAC71] hover:border-[#0FAC71]" onClick={handleSend}>Envoyer</Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ChatDialog;