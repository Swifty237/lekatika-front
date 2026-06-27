import { Eye, EyeOff } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { showToast } from '@/components/CustomToast';
import { useUser } from '@/hooks/useUser';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { refreshUser } = useUser();

    const [showPassword, setShowPassword] = useState(false);
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const [isChecking, setIsChecking] = useState(true); // État de vérification
    //   const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_LEKATIKA_SERVER_URI;

    // Vérification automatique du token existant
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsChecking(false);
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await fetch(`${API_URL}/api/user/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const result = await response.json();

                    // Mettre à jour localStorage avec les données fraîches
                    localStorage.setItem('userID', result.user.user_id);
                    localStorage.setItem('username', result.user.username);
                    localStorage.setItem('freeChipsAmountBankroll', result.user.free_chips_amount_bankroll);
                    await refreshUser();
                    showToast('Reconnexion automatique', 'success');
                    navigate('/lobby');
                } else {
                    // Token invalide ou expiré
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userID');
                    localStorage.removeItem('username');
                    localStorage.removeItem('freeChipsAmountBankroll');
                }
            } catch (err) {
                console.error('Erreur lors de la vérification du token', err);
            } finally {
                setIsChecking(false);
            }
        };

        verifyToken();
    }, [navigate, API_URL, refreshUser]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // setLoading(true);

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
                    localStorage.setItem('userID', result.user.user_id);
                    localStorage.setItem('username', result.user.username);
                    localStorage.setItem('freeChipsAmountBankroll', result.user.free_chips_amount_bankroll);
                    await refreshUser(); // charge l'utilisateur dans le contexte
                }

                showToast("Connexion reussie !", "success");

                setCredentials({ username: '', password: '' });

                //   setLoading(false);
                navigate("/lobby");


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

    // Pendant la vérification, affichez un loader
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-gradient">
                <div className="text-white text-xl">Vérification en cours...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-gradient font-suse flex items-center justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="grid grid-cols-1 mt-8 mx-2">
                    <div className="bg-green-gradient rounded-lg flex items-center justify-center mx-10 shadow-xl">
                        <h1 className="text-5xl xl:text-7xl font-extrabold text-center text-white shadow-xl py-4 px-8 rounded-xl">
                            Le katika.com
                        </h1>
                    </div>
                    <div className="my-8 pb-8 flex justify-center">
                        <img className="flex" src="img/main-illustration-desktop@2x.png" alt="" />
                    </div>
                </div>

                <div className="bg-red-gradient flex flex-col items-center justify-center p-4 mx-4 lg:mx-8 rounded-lg shadow-xl">
                    <div className="w-[70%]">
                        <img src="img/logo-transparent.png" alt="" />
                    </div>

                    <h2 className="text-center text-xl font-extrabold text-white">
                        Connexion
                    </h2>
                    <form className="mt-8 space-y-6 w-full" onSubmit={handleSubmit}>
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
            </div>
        </div>
    );
};

export default Login;