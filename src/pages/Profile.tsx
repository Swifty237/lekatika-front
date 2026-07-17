import React, { useRef, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader, Send } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { showToast } from '@/components/CustomToast';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {

    const { user, refreshUser } = useUser();

    const photoInputRef = useRef<HTMLInputElement>(null);
    const [photos, setPhotos] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
    const [bio, setBio] = useState<string>(user?.bio || '');
    const [isBioUpdating, setIsBioUpdating] = useState(false);


    const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Vérifier la taille (ex: 5MB max)
            if (file.size > 5 * 1024 * 1024) {
                showToast("L'image ne doit pas dépasser 5 Mo", "error");
                e.target.value = '';
                return;
            }
            setProfilePhotoFile(file);
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (photos.length + files.length > 20) {
            // toast({
            //     title: "Attention !",
            //     description: "Vous ne pouvez ajouter que 20 photos maximum.",
            //     variant: "destructive"
            // });
            return;
        }
        setPhotos(prev => [...prev, ...files]);
    };

    const handleSubmit = async () => { }


    const handleBioSubmit = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        setIsBioUpdating(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_LEKATIKA_SERVER_URI}/api/user/bio`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ bio })
            });
            if (response.ok) {
                showToast("Biographie mise à jour", "success");
                setBio("");
                await refreshUser(); // recharge l'utilisateur
            } else {
                const err = await response.json();
                showToast(err.error || "Erreur", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Erreur réseau", "error");
        } finally {
            setIsBioUpdating(false);
        }
    };

    const handleProfilePhotoSubmit = async () => {
        if (!profilePhotoFile) {
            showToast("Veuillez sélectionner une photo", "error");
            return;
        }
        setUploading(true);
        try {
            const token = localStorage.getItem('authToken');
            const formData = new FormData();
            formData.append('profilePicture', profilePhotoFile);

            const response = await fetch(`${import.meta.env.VITE_LEKATIKA_SERVER_URI}/api/user/profile-picture`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                showToast("Photo de profil mise à jour avec succès", "success");
                setProfilePhotoFile(null);
                // Réinitialiser l'input
                const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                if (input) input.value = '';
                await refreshUser();
            } else {
                const error = await response.json();
                showToast(error.error || "Erreur lors de l'upload", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Erreur réseau", "error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <MainLayout>
            <div className="flex flex-col items-center">
                <div className="grid grid-cols-2 lg:w-[55vw]">
                    <h1 className="text-4xl font-bold my-4">
                        Gestion du profil
                    </h1>

                    <Link to={`/profile-visitor/${user?.user_id}`} className="flex justify-end items-center pe-4">
                        <span className="text-lg underline">Vue visiteurs</span>
                    </Link>

                </div>

                <div className="px-2 lg:px-8 pb-3 pt-8 lg:w-[55vw]">

                    <h2 className="font-bold mb-2">
                        Modifiez votre photo de profil
                    </h2>

                    <div className="grid grid-cols-1 xl:grid-cols-2 border shadow-md rounded-md gap-3 lg:gap-4 mb-8">

                        <div className="p-4 hover:bg-[#0FAC71]">
                            <div className="">
                                <div className="flex justify-around">
                                    <h2 className="font-semibold mb-2">Photo de profil : </h2>
                                    <div className="w-[150px] h-[150px] shadow-xl rounded-full mb-4 overflow-hidden">
                                        <img
                                            src={user?.profile_picture_link || "/img/user-avatar.png"}
                                            className="w-full h-full object-cover"
                                            alt="Photo de profil"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 w-full hover:bg-[#0FAC71]">
                            <h1 className="text-xl font-bold mb-2">Choisissez une photo</h1>

                            <div className="mb-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfilePhotoChange}
                                    className="hover:cursor-pointer hover:border transition-colors rounded-sm"
                                />
                                {photos.length > 0 && <p className="text-sm mt-1">{photos.length} photo(s) sélectionnée(s)</p>}
                            </div>

                            <button
                                className="text-sm flex items-center justify-self-end hover:border shadow-xl px-8 py-2 rounded-lg"
                                onClick={handleProfilePhotoSubmit}
                                disabled={uploading || !profilePhotoFile}
                            >
                                {uploading ? (
                                    <Loader className="animate-spin" />
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 me-2" />
                                        <span>Valider</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <h2 className="font-bold mb-2">
                        Quelques mots sur vous ?
                    </h2>

                    <div className="text-sm grid grid-col-1 border hover:bg-[#0FAC71] rounded-md shadow-md mb-8">
                        <div className="flex flex-col p-4">
                            <label htmlFor="message" className="font-bold mb-2"></label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Parle-nous un peu de toi..."
                                rows={3}
                                className="w-full px-3 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71] text-black"
                            />
                        </div>
                        <button
                            className="text-sm flex justify-self-end m-4 items-center hover:border shadow-xl px-8 py-2 rounded-lg"
                            onClick={handleBioSubmit}
                            disabled={isBioUpdating}
                        >
                            {isBioUpdating ? <Loader className="animate-spin" /> : <><Send className="w-4 h-4 me-2" /><span>Valider</span></>}
                        </button>
                    </div>

                    <h2 className="font-bold mb-2">
                        Informations personnelles
                    </h2>

                    <div className="text-sm grid grid-cols-1 xl:grid-cols-2 border shadow-md rounded-md gap-3 lg:gap-4 mb-8">
                        <div className="grid grid-cols-3 gap-3 lg:gap-4 p-4 hover:bg-[#0FAC71]">
                            <label htmlFor="name" className="font-bold">Nom : </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                disabled
                                value=""
                                onChange={() => { }}
                                placeholder="Dupont"
                                className="col-span-2 w-full h-7 px-3 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3 lg:gap-4 p-4 hover:bg-[#0FAC71]">
                            <label htmlFor="firstname" className="font-bold">
                                Prénom :
                            </label>
                            <input
                                id="firstname"
                                name="firstname"
                                disabled
                                value=""
                                onChange={() => { }}
                                placeholder="Jean"
                                className="col-span-2 w-full h-7 px-3 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3 lg:gap-4 p-4 hover:bg-[#0FAC71]">
                            <label htmlFor="telephone" className="font-bold">Téléphone : </label>
                            <input
                                id="telephone"
                                name="telephone"
                                disabled
                                type="tel"
                                value=""
                                onChange={() => { }}
                                onBlur={() => { }}
                                placeholder="+33 1 23 45 67 89"
                                className="col-span-2 w-full h-7 px-3 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3 lg:gap-4 p-4 hover:bg-[#0FAC71] w-[100%]">
                            <label htmlFor="idCard" className="font-bold">Justificatif d'identité : </label>

                            <div className="col-span-2">
                                <input
                                    ref={photoInputRef}
                                    type="file"
                                    disabled
                                    accept="image/*"
                                    multiple
                                    onChange={handlePhotoUpload}
                                    className="w-full p-1 hover:cursor-pointer hover:border transition-colors rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                                />
                                <div className="flex mb-2">
                                    <span className="ps-2 me-2">Recto : </span>
                                    {photos.length > 0 && <p className="text-sm mt-1">{photos.length} photo(s) sélectionnée(s)</p>}
                                </div>

                                <input
                                    ref={photoInputRef}
                                    type="file"
                                    disabled
                                    accept="image/*"
                                    multiple
                                    onChange={handlePhotoUpload}
                                    className="col-span-2 w-full p-1 hover:cursor-pointer hover:border transition-colors rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                                />
                                <div className="flex">
                                    <span className="ps-2 me-2">Verso : </span>
                                    {photos.length > 0 && <p className="text-sm mt-1">{photos.length} photo(s) sélectionnée(s)</p>}
                                </div>

                                {/* <button className="text-sm flex items-center justify-self-end hover:border shadow-xl px-8 py-2 rounded-lg" onClick={handleSubmit} disabled={uploading}> */}
                                <button className="text-sm flex items-center justify-self-end hover:border shadow-xl px-8 py-2 rounded-lg" onClick={handleSubmit} disabled>
                                    {uploading ? (
                                        <>
                                            <Loader className="animate-spin" />
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 me-2" />
                                            <span>Valider</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <h2 className="font-bold mb-2">
                        Informations d'adresse
                    </h2>

                    <div className="text-sm grid grid-cols-1 xl:grid-cols-2 border shadow-md rounded-md gap-3 lg:gap-4 mb-8">
                        <div className="grid grid-cols-3 gap-3 lg:gap-4 p-4 hover:bg-[#0FAC71]">
                            <label htmlFor="street-number" className="font-bold me-4">N° : </label>
                            <input
                                id="street-number"
                                name="street-number"
                                type="text"
                                disabled
                                value=""
                                onChange={() => { }}
                                placeholder="1"
                                className="col-span-2 w-full h-7 px-3 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3 lg:gap-4 p-4 hover:bg-[#0FAC71]">
                            <label htmlFor="street-name" className="font-bold">Nom de rue :</label>
                            <input
                                id="street-name"
                                name="street-name"
                                disabled
                                value=""
                                onChange={() => { }}
                                placeholder="Rue de la Prairie"
                                className="col-span-2 w-full h-7 px-3 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3 lg:gap-4 p-4 hover:bg-[#0FAC71]">
                            <label htmlFor="postal-code" className="font-bold">Code Postal : </label>
                            <input
                                id="postal-code"
                                name="postal-code"
                                type="text"
                                disabled
                                value=""
                                onChange={() => { }}
                                onBlur={() => { }}
                                placeholder="75 010"
                                className="col-span-2 w-full h-7 px-3 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3 lg:gap-4 p-4 hover:bg-[#0FAC71]">
                            <label htmlFor="city" className="font-bold">Ville : </label>
                            <input
                                id="city"
                                name="city"
                                type="text"
                                disabled
                                value=""
                                onChange={() => { }}
                                onBlur={() => { }}
                                placeholder="Paris"
                                className="col-span-2 w-full h-7 px-3 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3 lg:gap-4 p-4 hover:bg-[#0FAC71]">
                            <label htmlFor="service" className="font-bold">Pays : </label>
                            <div className="col-span-2 text-sm flex justify-center">
                                <Select onValueChange={() => { }} disabled value="">
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Sélectionnez un pays" />
                                    </SelectTrigger>
                                    <SelectContent className="text-white mt-8 pb-1 bg-[#0FAC71] shadow-lg">
                                        <SelectItem value="France">France</SelectItem>
                                        <SelectItem value="Cameroun">Cameroun</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 lg:gap-4 p-4 hover:bg-[#0FAC71]">
                            <label htmlFor="idCard" className="font-bold">Justificatif de domicile : </label>
                            <input
                                ref={photoInputRef}
                                type="file"
                                disabled
                                accept="image/*"
                                multiple
                                onChange={handlePhotoUpload}
                                className="col-span-2 w-full p-1 hover:cursor-pointer hover:border transition-colors rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                            {photos.length > 0 && <p className="text-sm mt-1">{photos.length} photo(s) sélectionnée(s)</p>}
                        </div>

                        {/* La div vide permet de remplir la première case de la grille */}
                        <div></div>
                        {/* <button className="text-sm flex items-center justify-self-end hover:border shadow-xl px-8 py-2 mb-4 me-4 rounded-lg" onClick={handleSubmit} disabled={uploading}> */}
                        <button className="text-sm flex items-center justify-self-end hover:border shadow-xl px-8 py-2 mb-4 me-4 rounded-lg" onClick={handleSubmit} disabled>
                            {uploading ? (
                                <>
                                    <Loader className="animate-spin" />
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 me-2" />
                                    <span>Valider</span>
                                </>
                            )}
                        </button>
                    </div>

                    <h2 className="font-bold mb-2">
                        Informations de paiement
                    </h2>

                    <div className="text-sm grid grid-cols-1 xl:grid-cols-2 border shadow-md rounded-md gap-3 lg:gap-4 mb-8">
                        <div className="space-y-2 grid grid-cols-3 gap-3 lg:gap-4 p-4 hover:bg-[#0FAC71]">
                            <label htmlFor="bank-card" className="font-bold me-4">Carte bancaire : </label>
                            <input
                                id="bank-card"
                                name="bank-card"
                                type="text"
                                disabled
                                value=""
                                onChange={() => { }}
                                placeholder=""
                                className="col-span-2 w-full h-7 px-3 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3 lg:gap-4 p-4 hover:bg-[#0FAC71]">
                            <label htmlFor="paypal" className="font-bold">
                                Paypal :
                            </label>
                            <input
                                id="paypal"
                                name="paypal"
                                disabled
                                value=""
                                onChange={() => { }}
                                placeholder=""
                                className="col-span-2 w-full h-7 px-3 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3 lg:gap-4 p-4 hover:bg-[#0FAC71]">
                            <label htmlFor="mobile-money" className="font-bold">Mobile money : </label>
                            <input
                                id="mobile-money"
                                name="mobile-money"
                                type="tel"
                                disabled
                                value=""
                                onChange={() => { }}
                                onBlur={() => { }}
                                placeholder="+33 7 23 45 67 89"
                                className="col-span-2 w-full h-7 px-3 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                        </div>

                        {/* <button className="text-sm flex items-center justify-self-end hover:border shadow-xl px-8 py-2 mb-4 me-4 rounded-lg" onClick={handleSubmit} disabled={uploading}> */}
                        <button className="text-sm flex items-center justify-self-end hover:border shadow-xl px-8 py-2 mb-4 me-4 rounded-lg" onClick={handleSubmit} disabled>
                            {uploading ? (
                                <>
                                    <Loader className="animate-spin" />
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 me-2" />
                                    <span>Valider</span>
                                </>
                            )}
                        </button>
                    </div>


                    <h2 className="font-bold mb-2">
                        Informations bancaire
                    </h2>

                    <div className="text-sm grid grid-cols-1 xl:grid-cols-2 border shadow-md rounded-md gap-3 lg:gap-4 hover:bg-[#0FAC71]">

                        <div className="grid grid-cols-3 gap-3 lg:gap-4 p-4 hover:bg-[#0FAC71]">
                            <label htmlFor="rib" className="font-bold me-4">RIB : </label>
                            <input
                                id="rib"
                                name="rib"
                                type="text"
                                disabled
                                value=""
                                onChange={() => { }}
                                placeholder="FR74 **** **** **** ****"
                                className="col-span-2 w-full h-7 px-3 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3 lg:gap-4 p-4 hover:bg-[#0FAC71]">
                            <label htmlFor="idCard" className="font-bold">Document: </label>
                            <input
                                ref={photoInputRef}
                                type="file"
                                disabled
                                accept="image/*"
                                multiple
                                onChange={handlePhotoUpload}
                                className="col-span-2 w-full p-1 hover:cursor-pointer hover:border transition-colors rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                            {photos.length > 0 && <p className="text-sm mt-1">{photos.length} photo(s) sélectionnée(s)</p>}
                        </div>

                        <div></div>
                        {/* <button className="text-sm flex items-center justify-self-end hover:border shadow-xl px-8 py-2 mb-4 me-4 rounded-lg" onClick={handleSubmit} disabled={uploading}> */}
                        <button className="text-sm flex items-center justify-self-end hover:border shadow-xl px-8 py-2 mb-4 me-4 rounded-lg" onClick={handleSubmit} disabled>
                            {uploading ? (
                                <>
                                    <Loader className="animate-spin" />
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 me-2" />
                                    <span>Valider</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Profile;