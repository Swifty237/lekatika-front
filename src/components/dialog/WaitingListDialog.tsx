import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WaitingListProps {
    open: boolean;
    usernames: string[];
    onCancel: () => void;
}



const WaitingListDialog: React.FC<WaitingListProps> = ({
    open = false,
    usernames,
    onCancel
}) => {

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
            <DialogContent className="max-w-[90vw] 2md:max-w-[50vw] bg-[#2c5036] text-white h-[70vh] flex flex-col">

                <DialogHeader>
                    <DialogTitle>
                    </DialogTitle>
                    <DialogDescription>

                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-4 border border-white rounded-lg">
                    {usernames.length === 0 ? (
                        <div className="text-gray-400 text-center">Il n'y a personne en liste d'attente</div>
                    ) : (
                        usernames.map((username, i) => (
                            <div key={i} className="mb-2">
                                <span className="font-bold text-gray-400 capitalize">{username}</span>
                            </div>
                        ))
                    )}
                </div>
                <DialogFooter className="border-transparent pt-2">
                    <div className="w-full">
                        <div className="flex justify-end me-2">
                            <Button className="border border-white hover:bg-[#0FAC71] hover:border-[#0FAC71]" onClick={onCancel}>Fermer</Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default WaitingListDialog;