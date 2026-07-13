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
// import { showToast } from '@/components/CustomToast';

interface AddChipsDialogProps {
    open: boolean;
    currencyType: 'free' | 'real'; // 'free' pour argent fictif
    currentAmount: number;          // freeChipsAmount actuel
    maxTotal: number;               // 3000 pour les freeChips
    onConfirm: (amount: number) => void;
    onCancel: () => void;
}

const AddChipsDialog: React.FC<AddChipsDialogProps> = ({
    open,
    currencyType,
    currentAmount,
    maxTotal,
    onConfirm,
    onCancel,
}) => {
    const [amount, setAmount] = useState<string>('');
    const maxAdd = Math.max(0, maxTotal - currentAmount);
    const isAddDisabled = maxAdd <= 0 || currencyType != "free";

    // Réinitialiser l'input quand la modal s'ouvre
    useEffect(() => {
        if (open) {
            setAmount('');
        }
    }, [open]);

    const handleConfirm = () => {
        const numAmount = parseInt(amount, 10);
        if (!isNaN(numAmount) && numAmount > 0 && numAmount <= maxAdd) {
            onConfirm(numAmount);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
            <DialogContent className="max-w-sm border border-white text-white bg-[#2c5036]">
                <DialogHeader>
                    <DialogTitle>
                        {currencyType === 'free' ? 'Ajouter des points découverte' : 'Ajouter des points réel'}
                    </DialogTitle>
                    <DialogDescription>
                        {isAddDisabled
                            ? `Vous ne pouvez pas rajouter de points ${currencyType === "free" ? "découverte" : "réel"} pour le moment.`
                            : `Vous pouvez ajouter jusqu'à ${maxAdd} points découverte.`}
                    </DialogDescription>
                </DialogHeader>

                {!isAddDisabled && (
                    <div className="mt-2 text-black">
                        <input
                            type="number"
                            min={1}
                            max={maxAdd}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Montant à ajouter"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0FAC71]"
                        />
                    </div>
                )}

                <DialogFooter className="flex justify-end gap-2 mt-4">
                    <Button className="border border-white hover:bg-[#0FAC71] hover:border-[#0FAC71]" onClick={onCancel}>
                        Annuler
                    </Button>
                    {!isAddDisabled && (
                        <Button
                            variant="default"
                            onClick={handleConfirm}
                            disabled={!amount || parseInt(amount, 10) <= 0 || parseInt(amount, 10) > maxAdd}
                            className="border border-white hover:bg-[#0FAC71] hover:border-[#0FAC71]"
                        >
                            Ajouter
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddChipsDialog;