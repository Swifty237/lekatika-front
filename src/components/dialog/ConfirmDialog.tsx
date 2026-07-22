import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { showToast } from '@/components/CustomToast';

interface ConfirmDialogProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    onConfirm,
    onCancel,
}) => {

    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
            <DialogContent className="max-w-sm border border-white text-white bg-[#2c5036]">
                <DialogHeader>
                    <DialogTitle>
                        Voulez vous supprimez votre compte ?
                    </DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex justify-end gap-2 mt-4">
                    <Button className="border border-white hover:bg-[#0FAC71] hover:border-[#0FAC71]" onClick={onCancel}>
                        Annuler
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleConfirm}
                        disabled={false}
                        className="border border-white hover:bg-red-700 hover:border-red-700"
                    >
                        Supprimer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDialog;