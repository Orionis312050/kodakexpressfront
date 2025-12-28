import React, {type Dispatch, type SetStateAction, useState} from 'react';
import { BRAND_COLORS } from '../../constants/Constants';
import {ManagerService} from "@/services/ManagerService.ts";
import type {LoginDto, Tab, UserContext} from "../../constants/Interfaces";
import {Loader, ShieldCheck} from "lucide-react";

export const LoginView = ({ onLoginSuccess, setActiveTab, showNotification }: { onLoginSuccess: (user: UserContext) => void, setActiveTab: Dispatch<SetStateAction<Tab>>, showNotification:  (message: string, messageType: 'SUCCESS' | 'ERROR' | 'LOADING' | 'INFO' | 'WARNING') => void}) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const loginDto: LoginDto = { email, password };

        const user = await ManagerService.getInstance().login(loginDto);
        if (user) {
            onLoginSuccess(user);
        }
        else {
            showNotification("Erreur lors de la connexion.", 'ERROR');
        }

        setIsLoading(false);
    };

    return (
        <div className="max-w-md mx-auto py-12 px-4">
            <div className="bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                    <ShieldCheck className="text-blue-500" size={24} /> Connexion Sécurisée
                </h2>

                <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-6 text-sm text-center">
                    <p className="font-bold mb-1">Compte de test :</p>
                    <p>Email : <span className="font-mono bg-blue-100 px-1 rounded">jean.dupont@email.com</span></p>
                    <p>Pass : <span className="font-mono bg-blue-100 px-1 rounded">123456</span></p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${BRAND_COLORS.redBg} ${BRAND_COLORS.redHover} disabled:opacity-50`}
                    >
                        {isLoading ? <Loader className="animate-spin" size={20} /> : 'Se connecter (JWT)'}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Pas encore de compte ?{' '}
                        <button onClick={() => setActiveTab('register')} className="font-medium text-red-600 hover:text-red-500">
                            S'inscrire
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};