import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface NewTatamiDialogProps {
    open: boolean;
    onConfirm: (privateTatami: boolean, realMoney: boolean, bet: string, paid33: boolean) => void;
    onCancel: () => void;
}

const NewTatamiDialog: React.FC<NewTatamiDialogProps> = ({
    open,
    onConfirm,
    onCancel,
}) => {

    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [isRealMoney, setIsRealMoney] = useState(false);
    const [is33Paid, setIs33Paid] = useState(false);
    const [selectedBet, setSelectedBet] = useState<string>("25");

    const handleBetChange = (value: string) => {
        setSelectedBet(value);
    };

    const handleConfirm = (privateTatami: boolean, realMoney: boolean, bet: string, paid33: boolean) => {
        onConfirm(privateTatami, realMoney, bet, paid33)
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
            <DialogContent className="max-w-sm border border-white text-white bg-[#2c5036]">
                <DialogHeader>
                    <DialogTitle>
                        Nouveau Tatami
                    </DialogTitle>
                    <DialogDescription>
                        {/* {isAddDisabled
                            ? "Vous ne pouvez pas rajouter de chips pour le moment."
                            : `Vous pouvez ajouter jusqu'à ${maxAdd} jetons.`} */}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-2 p-2">

                    <label htmlFor="private" className="text-white">
                        Partie privée ?
                    </label>
                    <div className="flex items-center border rounded-xl py-1 px-2 w-[67%]">
                        {/* Oui s'affiche uniquement si isRealMoney est vrai */}
                        {isPrivate && <span className="ms-2">Oui</span>}
                        <Switch
                            id="private"
                            checked={isPrivate}
                            onCheckedChange={setIsPrivate}
                            className="data-[state=checked]:bg-[#0FAC71] bg-white mx-3"
                        />
                        {/* Non s'affiche uniquement si isRealMoney est faux */}
                        {!isPrivate && <span>Non</span>}
                    </div>

                    <label htmlFor="tatami-type" className="text-white">
                        Points réels ?
                    </label>
                    <div className="flex items-center border rounded-xl py-1 px-2 w-[67%]">
                        {/* Oui s'affiche uniquement si isRealMoney est vrai */}
                        {isRealMoney && <span className="ms-2">Oui</span>}
                        <Switch
                            id="tatami-type"
                            checked={isRealMoney}
                            disabled
                            onCheckedChange={setIsRealMoney}
                            className="data-[state=checked]:bg-[#0FAC71] bg-white mx-3"
                        />
                        {/* Non s'affiche uniquement si isRealMoney est faux */}
                        {!isRealMoney && <span>Non</span>}
                    </div>

                    <span className="text-[12px] italic col-span-2 mb-2">( Le jeu en argent réel est désactivé pour le moment )</span>

                    <label htmlFor="paid-33" className="text-white">
                        33 Payée ?
                    </label>
                    <div className="flex items-center border rounded-xl py-1 px-2 w-[67%]">
                        {/* Oui s'affiche uniquement si isRealMoney est vrai */}
                        {is33Paid && <span className="ms-2">Oui</span>}
                        <Switch
                            id="paid-33"
                            checked={is33Paid}
                            onCheckedChange={setIs33Paid}
                            className="data-[state=checked]:bg-[#0FAC71] bg-white mx-3"
                        />
                        {/* Non s'affiche uniquement si isRealMoney est faux */}
                        {!is33Paid && <span>Non</span>}
                    </div>


                    <label htmlFor="tatami-type" className="text-white">
                        Coût combien ?
                    </label>

                    <Select onValueChange={handleBetChange} value={selectedBet}>
                        <SelectTrigger className="w-[67%] shadow-lg text-white">
                            <SelectValue placeholder="25 Points" />
                        </SelectTrigger>
                        <SelectContent className="text-white bg-[#0FAC71] shadow-lg">
                            <SelectItem value="25">25 Points</SelectItem>
                            <SelectItem value="50">50 Points</SelectItem>
                            <SelectItem value="100">100 Points</SelectItem>
                            <SelectItem value="200">200 Points</SelectItem>
                        </SelectContent>
                    </Select>
                </div>


                <DialogFooter className="flex justify-end gap-2 mt-4">
                    <Button className="border bg-white text-[#0FAC71] hover:text-white hover:bg-[#0FAC71] hover:border-[#0FAC71] shadow-xl" onClick={onCancel}>
                        Annuler
                    </Button>

                    <Button
                        onClick={() => handleConfirm(isPrivate, isRealMoney, selectedBet, is33Paid)}
                        // disabled={!amount || parseInt(amount, 10) <= 0 || parseInt(amount, 10) > maxAdd}
                        className="border border-white hover:bg-[#0FAC71] hover:border-[#0FAC71] shadow-xl"
                    >
                        Créer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default NewTatamiDialog;