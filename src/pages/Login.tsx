import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simuler une authentification (à remplacer par une vraie API)
        if (email === 'test@test.com' && password === 'password') {
            alert('Connexion réussie');
            // Rediriger vers le tableau de bord ou la page d'accueil plus tard
        } else {
            setError('Email ou mot de passe incorrect');
        }
    };

    return (
        <div className="min-h-screen py-12 px-2 sm:px-6 lg:px-8 bg-green-gradient font-suse">
            <div className="flex flex-col-reverse xl:flex-row justify-around items-center w-full min-h-[85vh]">
                <div className="xl:w-[25vw] bg-red-gradient px-8 mx-8 rounded-lg shadow-xl pb-4">
                    <div>
                        <img src="img/logo-transparent.png" alt="" />
                    </div>

                    <h2 className="text-center text-xl font-extrabold text-white">
                        Connexion
                    </h2>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="text-red-500 text-sm text-center">{error}</div>
                        )}
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email" className="sr-only">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 mb-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                                    placeholder="Adresse email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Mot de passe
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                                    placeholder="Mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 shadow-xl text-sm font-medium rounded-lg text-white border border-transparent hover:bg-[#ea2020] hover:border-[#ea2020] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ea2020]"
                            >
                                Se connecter
                            </button>
                        </div>

                        <div className="text-sm text-center">
                            <Link
                                to="/register"
                                className="font-medium text-yellow-200 hover:text-yellow-400"
                            >
                                Pas encore de compte ? S'inscrire
                            </Link>
                        </div>
                    </form>
                </div>

                <div className="flex flex-col items-center xl:w-[50vw] rounded-sm">
                    <div className="p-8">
                        <h1 className="text-center text-5xl md:text-7xl font-extrabold text-white">
                            Le katika.com
                        </h1>
                    </div>
                    <div className="mb-8 pb-8">
                        <img className="flex" src="img/main-illustration-desktop@2x.png" alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;