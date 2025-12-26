import React, {useRef, useState} from 'react';
import {RegisterDto} from '../../constants/Interfaces';
import {ManagerService} from "../../services/ManagerService";
import {Loader, Server} from "lucide-react";

export const RegisterView = ({ onRegisterSuccess, setActiveTab, location }: { onRegisterSuccess: any, setActiveTab: any, location: any }) => {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', phone: '', address: '', zipCode: '', city: '' });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

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

    const [suggestions, setSuggestions] = useState([]); // Liste des suggestions
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef<HTMLDivElement>(null);

    const handleAddressChange = async (e: any) => {
        const val = e.target.value;
        setFormData({ ...formData, address: val }); // On met à jour ce que l'utilisateur voit

        // On cherche seulement si l'utilisateur a tapé plus de 3 caractères
        if (val.length > 3) {
            try {
                const response = await fetch(`https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(val)}&lat=${encodeURIComponent(location.latitude)}&lon=${encodeURIComponent(location.longitude)}&limit=15&index=address`);
                const data = await response.json();
                setSuggestions(data.features);
                setShowSuggestions(true);
            } catch (error) {
                console.error("Erreur API:", error);
            }
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSelectSuggestion = (suggestion: any) => {
        // On remplit tout le formulaire d'un coup
        setFormData({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            address: suggestion.properties.name,          // La rue (ex: 10 Rue de la Paix)
            zipCode: suggestion.properties.postcode,   // Le CP (ex: 75002)
            city: suggestion.properties.city             // La city (ex: Paris)
        });

        // On cache la liste et on la vide
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-md mx-auto py-12 px-4">
            <div className="bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                    <Server className="text-green-600" size={24} /> Inscription
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Prénom</label>
                            <input
                                type="text"
                                name="firstName"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input
                                type="text"
                                name="lastName"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                        <input
                            type="tel"
                            name="phone"
                            pattern="[0-9]{10}"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div ref={suggestionRef}>
                        <label className="block text-sm font-medium text-gray-700">Adresse</label>
                        <input
                            type="text"
                            name="address"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                            value={formData.address}
                            onChange={handleAddressChange}
                            onFocus={() => formData.address.length > 3 && setShowSuggestions(true)}
                            autoComplete="off"
                            placeholder="123 Rue de l'Exemple"
                        />
                        {showSuggestions && suggestions.length > 0 && (
                            <ul className="w-full relative bg-white border border-opacity-10 border-gray-500 border-solid rounded-b z-50 shadow list-none m-0 p-0 max-h-52 overflow-y-auto">
                                {suggestions.map((item: any) => (
                                    <li
                                        className="py-2.5 px-4 cursor-pointer border-b border-gray-50 border-solid text-sm"
                                        key={item.properties.id}
                                        onClick={() => handleSelectSuggestion(item)}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                    >
                                        {/* On affiche le label complet (ex: 8 Rue de Londres 75009 Paris) */}
                                        <strong>{item.properties.name}</strong> <span style={{color: '#666'}}>{item.properties.city}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Code Postale</label>
                        <input
                            type="text"
                            name="zipCode"
                            pattern="[1-9][0-9]{4}"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                            value={formData.zipCode}
                            onChange={handleChange}
                            placeholder="75000"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ville</label>
                        <input
                            type="text"
                            name="city"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Paris"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                            value={formData.confirmPassword}
                            onChange={handleChange}
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