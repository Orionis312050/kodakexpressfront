import React, { useState } from 'react';
import {RegisterDto} from '../../constants/Interfaces';
import {ManagerService} from "../../services/ManagerService";
import {Loader, Server} from "lucide-react";

export const RegisterView = ({ onRegisterSuccess, setActiveTab }: { onRegisterSuccess: any, setActiveTab: any }) => {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', address: '', zipCode: '', city: '' });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const newUserInput: RegisterDto = {
            id: 'temp-id',
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            address: formData.address,
            zipCode: formData.zipCode,
            city: formData.city,
        };

        const createdUser = await ManagerService.getInstance().registerUser(newUserInput);
        setIsLoading(false);
        onRegisterSuccess(createdUser);
    };

    return (
        <div className="max-w-md mx-auto py-12 px-4">
            <div className="bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                    <Server className="text-green-600" size={24} /> Inscription
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Prénom</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                        <input
                            type="tel"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Adresse</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Code Postale</label>
                        <input
                            type="text"
                            required
                            pattern="[0-9][1-9]{4}"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                            value={formData.zipCode}
                            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ville</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                        <input
                            type="password"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50"
                    >
                        {isLoading ? <Loader className="animate-spin" size={20} /> : "S'inscrire"}
                    </button>
                </form>
            </div>
        </div>
    );
};