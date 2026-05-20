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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-green-gradient font-suse">
            <div className="w-full flex h-[90vh] items-center justify-around">
                <div className="max-w-md w-full min-h-[70vh] space-y-8 bg-red-gradient px-8 rounded-md">
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
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 mb-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Se connecter
                            </button>
                        </div>

                        <div className="text-sm text-center">
                            <Link
                                to="/register"
                                className="font-medium text-yellow-300 hover:text-yellow-500"
                            >
                                Pas encore de compte ? S'inscrire
                            </Link>
                        </div>
                    </form>
                </div>

                <div className="w-[50%] h-[90%]">
                    <div className="flex flex-col items-center h-full shadow-xl border border-green-800">
                        <div className="p-8 mt-8">
                            <h1 className="text-center text-8xl font-extrabold text-white">
                                Le katika.com
                            </h1>
                        </div>
                        <div className="">
                            <img className="flex" src="img/main-illustration-desktop@2x.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;