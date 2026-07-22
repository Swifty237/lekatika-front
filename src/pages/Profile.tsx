import React, { useRef, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader, Send } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { showToast } from '@/components/CustomToast';
import { Link } from 'react-router-dom';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';

const Profile: React.FC = () => {

    const { user, refreshUser } = useUser();

    const photoInputRef = useRef<HTMLInputElement>(null);
    const [photos, setPhotos] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
    const [bio, setBio] = useState<string>(user?.bio || '');
    const [isBioUpdating, setIsBioUpdating] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // États pour le recadrage
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 80,
        height: 80,
        x: 10,
        y: 10,
    });
    const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);


    const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showToast("L'image ne doit pas dépasser 5 Mo", "error");
                e.target.value = '';
                return;
            }
            // Créer une URL pour l'image et ouvrir le modal de recadrage
            const imageUrl = URL.createObjectURL(file);
            setImageToCrop(imageUrl);
            setCropModalOpen(true);
            // Stocker le fichier original pour l'envoyer après recadrage
            setProfilePhotoFile(file);
        }
    };

    // Fonction pour obtenir l'image recadrée en tant que fichier
    const getCroppedImage = async (): Promise<File | null> => {
        if (!imgRef.current || !completedCrop) return null;

        const canvas = document.createElement('canvas');
        const image = imgRef.current;
        const crop = completedCrop;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = crop.width! * scaleX;
        canvas.height = crop.height! * scaleY;

        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.drawImage(
            image,
            crop.x! * scaleX,
            crop.y! * scaleY,
            crop.width! * scaleX,
            crop.height! * scaleY,
            0,
            0,
            crop.width! * scaleX,
            crop.height! * scaleY
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    resolve(null);
                    return;
                }
                const file = new File([blob], 'profile-picture.jpg', { type: 'image/jpeg' });
                resolve(file);
            }, 'image/jpeg', 0.9);
        });
    };

    const handleCropConfirm = async () => {
        if (!profilePhotoFile) return;
        setUploading(true);
        try {
            const croppedFile = await getCroppedImage();
            if (!croppedFile) {
                showToast("Erreur lors du recadrage", "error");
                setUploading(false);
                return;
            }
            // Envoyer l'image recadrée au serveur
            const token = localStorage.getItem('authToken');
            const formData = new FormData();
            formData.append('profilePicture', croppedFile);

            const response = await fetch(`${import.meta.env.VITE_LEKATIKA_SERVER_URI}/api/user/profile-picture`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                showToast("Photo de profil mise à jour avec succès", "success");
                setProfilePhotoFile(null);
                setImageToCrop(null);
                setCropModalOpen(false);
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

    const handleCropCancel = () => {
        setCropModalOpen(false);
        setImageToCrop(null);
        setProfilePhotoFile(null);
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (input) input.value = '';
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (photos.length + files.length > 20) {
            return;
        }
        setPhotos(prev => [...prev, ...files]);
    };

    const handleSubmit = async () => { }

    const handleConfirmeDelete = () => {
        // Vérifier que le solde réel est à 0
        if (user?.real_chips_amount_bankroll && user.real_chips_amount_bankroll !== 0) {
            showToast("Vous ne pouvez pas supprimer votre compte car vous avez des points réels", "error");
            return;
        }
        setConfirmDeleteOpen(true);
    };

    const handleDeleteAccount = async () => {
        setDeleting(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${import.meta.env.VITE_LEKATIKA_SERVER_URI}/api/user/account`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                showToast("Votre compte a été supprimé avec succès", "success");
                // Déconnecter l'utilisateur
                localStorage.removeItem('authToken');
                localStorage.removeItem('userID');
                localStorage.removeItem('username');
                localStorage.removeItem('freeChipsAmountBankroll');
                // Rediriger vers la page de connexion
                window.location.href = '/login';
            } else {
                showToast(data.error || "Erreur lors de la suppression", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Erreur réseau", "error");
        } finally {
            setDeleting(false);
            setConfirmDeleteOpen(false);
        }
    };


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
                                    className="hover:cursor-pointer border border-transparent hover:border-white transition-colors rounded-sm"
                                />
                                {photos.length > 0 && <p className="text-sm mt-1">{photos.length} photo(s) sélectionnée(s)</p>}
                            </div>
                        </div>

                        {/* Modal de recadrage */}
                        {cropModalOpen && imageToCrop && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
                                    <h2 className="text-xl font-bold mb-4 text-black">Recadrer l'image</h2>
                                    <ReactCrop
                                        crop={crop}
                                        onChange={(c) => setCrop(c)}
                                        onComplete={(c) => setCompletedCrop(c)}
                                        aspect={1}
                                        circularCrop
                                        className="max-h-[60vh]"
                                    >
                                        <img
                                            ref={imgRef}
                                            src={imageToCrop}
                                            alt="À recadrer"
                                            className="max-h-[60vh] object-contain"
                                        />
                                    </ReactCrop>
                                    <div className="flex justify-end gap-3 mt-4">
                                        <button
                                            onClick={handleCropCancel}
                                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={handleCropConfirm}
                                            disabled={uploading}
                                            className="px-4 py-2 bg-[#0FAC71] text-white rounded hover:bg-[#0D8A5A] disabled:opacity-50"
                                        >
                                            {uploading ? <Loader className="animate-spin" /> : "Valider"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

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
                            className="text-sm flex justify-self-end m-4 items-center border border-transparent hover:border-white shadow-xl px-8 py-2 rounded-lg"
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
                                    className="w-full p-1 hover:cursor-pointer border border-transparent hover:border-white transition-colors rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
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
                                    className="col-span-2 w-full p-1 hover:cursor-pointer border border-transparent hover:border-white transition-colors rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                                />
                                <div className="flex">
                                    <span className="ps-2 me-2">Verso : </span>
                                    {photos.length > 0 && <p className="text-sm mt-1">{photos.length} photo(s) sélectionnée(s)</p>}
                                </div>

                                {/* <button className="text-sm flex items-center justify-self-end hover:border shadow-xl px-8 py-2 rounded-lg" onClick={handleSubmit} disabled={uploading}> */}
                                <button className="text-sm flex items-center justify-self-end border border-transparent hover:border-white shadow-xl px-8 py-2 rounded-lg" onClick={handleSubmit} disabled>
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
                        <button className="text-sm flex items-center justify-self-end border border-transparent hover:border-white shadow-xl px-8 py-2 mb-4 me-4 rounded-lg" onClick={handleSubmit} disabled>
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
                        <button className="text-sm flex items-center justify-self-end border border-transparent hover:border-white shadow-xl px-8 py-2 mb-4 me-4 rounded-lg" onClick={handleSubmit} disabled>
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

                    <div className="text-sm grid grid-cols-1 xl:grid-cols-2 border shadow-md rounded-md gap-3 lg:gap-4 mb-8">

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
                                className="col-span-2 w-full p-1 hover:cursor-pointer border border-transparent hover:border-white transition-colors rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                            {photos.length > 0 && <p className="text-sm mt-1">{photos.length} photo(s) sélectionnée(s)</p>}
                        </div>

                        <div></div>
                        {/* <button className="text-sm flex items-center justify-self-end hover:border shadow-xl px-8 py-2 mb-4 me-4 rounded-lg" onClick={handleSubmit} disabled={uploading}> */}
                        <button className="text-sm flex items-center justify-self-end border border-transparent hover:border-white shadow-xl px-8 py-2 mb-4 me-4 rounded-lg" onClick={handleSubmit} disabled>
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

                    <h2 className="font-bold mb-2 text-red-700">
                        Suppression du compte
                    </h2>

                    <div className="text-sm grid grid-cols-1 xl:grid-cols-2 border border-red-700 shadow-md rounded-md gap-3 lg:gap-4 mb-8 text-red-700">

                        <div className="p-4 flex rounded-md">
                            <span className="text-justify text-white">Une fois que vous aurez confirmez la suppression votre compte utilisateur et vos données personnelles seront définitvement supprimés</span>
                        </div>

                        {/* <button className="text-sm flex items-center justify-self-end hover:border shadow-xl px-8 py-2 mb-4 me-4 rounded-lg" onClick={handleSubmit} disabled={uploading}> */}
                        <button
                            className="text-sm flex items-center justify-self-end text-white hover:bg-red-700 shadow-xl px-8 py-2 my-4 me-4 rounded-lg"
                            onClick={handleConfirmeDelete}
                            disabled={deleting}
                        >
                            {deleting ? <Loader className="animate-spin" /> : <><Send className="w-4 h-4 me-2" /><span>Valider</span></>}
                        </button>
                    </div>
                </div>

                <ConfirmDialog
                    open={confirmDeleteOpen}
                    onConfirm={handleDeleteAccount}
                    onCancel={() => setConfirmDeleteOpen(false)}
                />
            </div>
        </MainLayout>
    );
};

export default Profile;