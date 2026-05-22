import React, { useRef, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader, Send } from 'lucide-react';

const Profile: React.FC = () => {

    const photoInputRef = useRef<HTMLInputElement>(null);
    const [photos, setPhotos] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

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

    return (
        <MainLayout>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold my-4">
                    Bienvenue sur la page de profil
                </h1>
                <p className="text-lg">
                    Tout fonctionne correctement ! Cette page est protégée par le layout avec navbar et footer.
                </p>

                <div className="px-2 lg:px-8 pb-3 pt-8 lg:w-[55vw]">

                    <h2 className="font-bold mb-2">
                        Modifiez votre photo de profil
                    </h2>

                    <div className="grid grid-cols-1 xl:grid-cols-2 border shadow-md rounded-md gap-3 lg:gap-4 mb-8">

                        <div className="p-4 hover:bg-[#0FAC71]">
                            <div className="">
                                <div className="flex justify-around">
                                    <h2 className="font-semibold mb-2">Photo de profil : </h2>
                                    <div className="w-[150px] h-[150px] shadow-xl rounded-full mb-4">

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 w-full hover:bg-[#0FAC71]">
                            <h1 className="text-xl font-bold mb-2">Choisissez une photo</h1>

                            <div className="mb-4">
                                <input
                                    ref={photoInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handlePhotoUpload}
                                    className="hover:cursor-pointer hover:border transition-colors rounded-sm"
                                />
                                {photos.length > 0 && <p className="text-sm mt-1">{photos.length} photo(s) sélectionnée(s)</p>}
                            </div>

                            <button className="text-sm flex items-center justify-self-end hover:border shadow-xl px-8 py-2 rounded-lg" onClick={handleSubmit} disabled={uploading}>
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
                                    accept="image/*"
                                    multiple
                                    onChange={handlePhotoUpload}
                                    className="col-span-2 w-full p-1 hover:cursor-pointer hover:border transition-colors rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                                />
                                <div className="flex">
                                    <span className="ps-2 me-2">Verso : </span>
                                    {photos.length > 0 && <p className="text-sm mt-1">{photos.length} photo(s) sélectionnée(s)</p>}
                                </div>

                                <button className="text-sm flex items-center justify-self-end hover:border shadow-xl px-8 py-2 rounded-lg" onClick={handleSubmit} disabled={uploading}>
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
                            <label htmlFor="name" className="font-bold me-4">N° : </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value=""
                                onChange={() => { }}
                                placeholder="1"
                                className="col-span-2 w-full h-7 px-3 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3 lg:gap-4 p-4 hover:bg-[#0FAC71]">
                            <label htmlFor="firstname" className="font-bold">Nom de rue :</label>
                            <input
                                id="firstname"
                                name="firstname"
                                value=""
                                onChange={() => { }}
                                placeholder="Rue de la Prairie"
                                className="col-span-2 w-full h-7 px-3 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3 lg:gap-4 p-4 hover:bg-[#0FAC71]">
                            <label htmlFor="telephone" className="font-bold">Code Postal : </label>
                            <input
                                id="telephone"
                                name="telephone"
                                type="tel"
                                value=""
                                onChange={() => { }}
                                onBlur={() => { }}
                                placeholder="75 010"
                                className="col-span-2 w-full h-7 px-3 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3 lg:gap-4 p-4 hover:bg-[#0FAC71]">
                            <label htmlFor="telephone" className="font-bold">Ville : </label>
                            <input
                                id="telephone"
                                name="telephone"
                                type="tel"
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
                                <Select onValueChange={() => { }} value="">
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
                                accept="image/*"
                                multiple
                                onChange={handlePhotoUpload}
                                className="col-span-2 w-full p-1 hover:cursor-pointer hover:border transition-colors rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                            {photos.length > 0 && <p className="text-sm mt-1">{photos.length} photo(s) sélectionnée(s)</p>}
                        </div>

                        {/* La div vide permet de remplir la première case de la grille */}
                        <div></div>
                        <button className="text-sm flex items-center justify-self-end hover:border shadow-xl px-8 py-2 mb-4 me-4 rounded-lg" onClick={handleSubmit} disabled={uploading}>
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
                            <label htmlFor="name" className="font-bold me-4">Carte bancaire : </label>
                            <input
                                id="bankCard"
                                name="bankCard"
                                type="text"
                                value=""
                                onChange={() => { }}
                                placeholder=""
                                className="col-span-2 w-full h-7 px-3 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3 lg:gap-4 p-4 hover:bg-[#0FAC71]">
                            <label htmlFor="firstname" className="font-bold">
                                Paypal :
                            </label>
                            <input
                                id="paypal"
                                name="paypal"
                                value=""
                                onChange={() => { }}
                                placeholder=""
                                className="col-span-2 w-full h-7 px-3 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3 lg:gap-4 p-4 hover:bg-[#0FAC71]">
                            <label htmlFor="telephone" className="font-bold">Mobile money : </label>
                            <input
                                id="mobileMoney"
                                name="mobileMoney"
                                type="tel"
                                value=""
                                onChange={() => { }}
                                onBlur={() => { }}
                                placeholder="+33 7 23 45 67 89"
                                className="col-span-2 w-full h-7 px-3 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                        </div>

                        <button className="text-sm flex items-center justify-self-end hover:border shadow-xl px-8 py-2 mb-4 me-4 rounded-lg" onClick={handleSubmit} disabled={uploading}>
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

                    <div className="text-sm grid grid-cols-1 xl:grid-cols-2 border shadow-md rounded-md gap-3 lg:gap-4 mb-8 hover:bg-[#0FAC71]">

                        <label htmlFor="idCard" className="font-bold p-4">RIB : </label>

                        <div className="p-4">
                            <input
                                ref={photoInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handlePhotoUpload}
                                className="col-span-2 w-full p-1 hover:cursor-pointer hover:border transition-colors rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                            {photos.length > 0 && <p className="text-sm mt-1">{photos.length} photo(s) sélectionnée(s)</p>}
                        </div>

                        <div></div>
                        <button className="text-sm flex items-center justify-self-end hover:border shadow-xl px-8 py-2 mb-4 me-4 rounded-lg" onClick={handleSubmit} disabled={uploading}>
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
                        Quelques mots sur vous ?
                    </h2>
                    <div className="text-sm grid grid-col-1 border hover:bg-[#0FAC71] rounded-md shadow-md">
                        <div className="flex flex-col p-4">
                            <label htmlFor="message" className="font-bold mb-2"></label>
                            <textarea
                                id="message"
                                name="message"
                                value=""
                                onChange={() => { }}
                                placeholder=""
                                rows={3}
                                className="w-full px-3 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0FAC71] focus:border-[#0FAC71]"
                            />
                        </div>
                        <button className="text-sm flex justify-self-end m-4 items-center hover:border shadow-xl px-8 py-2 rounded-lg" onClick={handleSubmit} disabled={uploading}>
                            {uploading ? (
                                <>
                                    <Loader className="animate-spin" />
                                </>
                            ) : (
                                <>
                                    <>
                                        <Send className="w-4 h-4 me-2" />
                                        <span>Valider</span>
                                    </></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Profile;