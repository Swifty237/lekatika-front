/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { showToast } from '../CustomToast';
import { formatNumber } from '@/lib/formatNumber';

// SitOnTableDialog.tsx
interface SitOnTableDialogProps {
    open: boolean;
    maxAmount: number;
    onConfirm: (amount: number) => void;
    onCancel: () => void;
}

const SitOnTableDialog: React.FC<SitOnTableDialogProps> = ({
    open,
    maxAmount,
    onConfirm,
    onCancel,
}) => {
    const [amount, setAmount] = useState<string>('');

    useEffect(() => {
        if (open) setAmount('');
    }, [open]);

    const handleConfirm = () => {
        const num = parseInt(amount, 10);
        if (!isNaN(num) && num > 0 && num <= maxAmount) {
            onConfirm(num);
        } else {
            showToast(`Montant invalide (max ${formatNumber(maxAmount)})`, "error");
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
            <DialogContent className="max-w-sm bg-[#2c5036] text-white">
                <DialogHeader>
                    <DialogTitle>Choisissez votre stack de départ</DialogTitle>
                    <DialogDescription>
                        Vous pouvez prendre jusqu'à {formatNumber(maxAmount)} chips.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-2">
                    <input
                        type="number"
                        min={1}
                        max={maxAmount}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Montant à miser"
                        className="w-full px-3 py-2 border rounded-md text-black"
                    />
                </div>
                <DialogFooter className="flex justify-end gap-2 mt-4">
                    <Button className="border border-white hover:bg-[#0FAC71] hover:border-[#0FAC71]" onClick={onCancel}>Annuler</Button>
                    <Button className="border border-white hover:bg-[#0FAC71] hover:border-[#0FAC71]" onClick={handleConfirm}>S'asseoir</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SitOnTableDialog;