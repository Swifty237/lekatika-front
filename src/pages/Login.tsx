import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { showToast } from '@/components/CustomToast';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);


    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    //   const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // setLoading(true);

        const API_URL = import.meta.env.VITE_LEKATIKA_SERVER_URI;

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            const result = await response.json();

            if (response.ok) {
                if (result.token) {
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('username', result.user.username);
                    localStorage.setItem('freeChipsAmount', result.user.freeChipsAmount);
                }

                setCredentials({ username: '', password: '' });

                //   setLoading(false);
                navigate("/lobby");

                showToast("Connexion reussie !", "success");

            } else {

                showToast("Erreur :" + result.error, "error");
                // setLoading(false);
                // alert('Erreur : ' + (result.error || 'Identifiants incorrects'));
            }
        } catch (err) {
            console.error(err);

            showToast("Erreur réseau : Erreur lors de la connexion !", "error");

            // alert("Erreur réseau lors de la connexion.");
        } finally {
            //   setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-2 sm:px-6 lg:px-8 bg-green-gradient font-suse">
            <div className="flex flex-col-reverse xl:flex-row justify-around items-center w-full min-h-[85vh]">
                <div className="xl:w-[30vw] bg-red-gradient px-8 mx-8 rounded-lg shadow-xl pb-4">
                    <div>
                        <img src="img/logo-transparent.png" alt="" />
                    </div>

                    <h2 className="text-center text-xl font-extrabold text-white">
                        Connexion
                    </h2>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {/* {error && (
                            <div className="text-red-500 text-sm text-center">{error}</div>
                        )} */}
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email" className="sr-only">
                                    Email
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 mb-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                                    placeholder="Nom d'utilisateur ou email"
                                    value={credentials.username}
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
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                                    placeholder="Mot de passe"
                                    value={credentials.password}
                                    onChange={handleInputChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                                    tabIndex={-1} // ne gêne pas la navigation clavier
                                >
                                    {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
                                </button>
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
                        <h1 className="text-center text-7xl font-extrabold text-white">
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