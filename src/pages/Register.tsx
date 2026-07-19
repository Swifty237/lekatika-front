"use client"
import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { showToast } from '@/components/CustomToast';

const Register: React.FC = () => {
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (credentials.password !== credentials.confirmPassword) {
            setError("Les mots de passe ne correspondent pas !");
            showToast("Les mots de passe ne correspondent pas !", "error");
            return;
        }

        // setLoading(true);
        const API_URL = import.meta.env.VITE_LEKATIKA_SERVER_URI;

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: credentials.username,
                    email: credentials.email,
                    password: credentials.password,
                    free_chips_amount_bankroll: 10000.00
                }),
            });

            const result = await response.json();

            if (response.ok) {

                showToast("Compte utilisateur créé avec succès !", "success");

                setTimeout(() => {
                    showToast("Utilisez vos identifiants pour vous connectez !", "success");
                }, 3000)

                // Réinitialise les champs
                setCredentials({ username: '', email: '', password: '', confirmPassword: '' });

                // Redirige vers la page de login
                navigate('/login');
            } else {
                showToast('Erreur : ' + (result.error || 'Impossible de créer le compte'), "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Erreur réseau lors de la création du compte !", "error");
        } finally {
            // setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-green-gradient font-suse flex flex-col p-4 lg:p-8">
            <div className="flex flex-col mb-8 rounded-xl shadow-xl">
                <div className="flex justify-center">
                    <img className="" src="img/main-illustration-desktop@2x.png" alt="" />
                </div>

                <h1 className="text-5xl xl:text-7xl font-extrabold text-center text-white py-4 px-8">
                    Le katika.com
                </h1>
            </div>

            <div className="flex flex-col-reverse lg:flex-row w-[100vw] lg:w-[70vw] self-center justify-self-center bg-red-gradient rounded-xl shadow-xl">
                <div
                    className="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-contain opacity-10 blur-sm bg-[#e74c3c] pointer-events-none"
                    style={{
                        backgroundImage: "url('/img/logo-transparent.png')",
                        backgroundSize: 'cover',
                        zIndex: 0,
                    }}
                />

                <div className="flex items-center justify-center">
                    <div className="bg-red-gradient w-[100vw] lg:w-[45vw] p-4 m-8">
                        <h2 className="text-center text-xl font-extrabold text-white">
                            Inscription
                        </h2>
                        <form className="mt-8 space-y-6 w-full" onSubmit={handleSubmit}>
                            {error && (
                                <div className="text-red-500 text-sm text-center">{error}</div>
                            )}
                            <div className="space-y-4">
                                <div>
                                    {/* <label htmlFor="username" className="sr-only">
                                    Nom d'utilisateur
                                </label> */}
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        autoComplete="username"
                                        required
                                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                                        placeholder="Nom d'utilisateur"
                                        value={credentials.username}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    {/* <label htmlFor="email" className="sr-only">
                                    Email
                                </label> */}
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                                        placeholder="Adresse email"
                                        value={credentials.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="relative">
                                    {/* <label htmlFor="password" className="sr-only">
                                    Mot de passe
                                </label> */}
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                                        placeholder="Mot de passe"
                                        value={credentials.password}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/4  text-gray-600 hover:text-gray-800"
                                        tabIndex={-1} // ne gêne pas la navigation clavier
                                    >
                                        {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
                                    </button>
                                </div>

                                <div className="relative">
                                    {/* <label htmlFor="password" className="sr-only">
                                    Confirmer le mot de passe
                                </label> */}
                                    <input
                                        id="confirm-password"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                                        placeholder="Confirmer le mot de passe"
                                        value={credentials.confirmPassword}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/4  text-gray-600 hover:text-gray-800"
                                        tabIndex={-1} // ne gêne pas la navigation clavier
                                    >
                                        {showConfirmPassword ? <Eye size={22} /> : <EyeOff size={22} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 shadow-xl text-sm font-medium rounded-lg text-white border border-transparent hover:bg-[#ea2020] hover:border-[#ea2020] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ea2020]"
                                >
                                    S'inscrire
                                </button>
                            </div>

                            <div className="text-sm text-center">
                                <Link
                                    to="/login"
                                    className="font-medium text-yellow-200 hover:text-yellow-400"
                                >
                                    Déjà un compte ? Se connecter
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="rounded-full flex items-center justify-center">
                    <img className="" src="img/logo-transparent.png" alt="" />
                </div>
            </div>
        </div>
    );
};

export default Register;