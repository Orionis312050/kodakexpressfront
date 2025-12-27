import React, {useRef, useState} from 'react';
import {RegisterDto} from '../../constants/Interfaces';
import {ManagerService} from "../../services/ManagerService";
import {Check} from "lucide-react";

export const RegisterView = ({ onRegisterSuccess, setActiveTab, location, showNotification }: { onRegisterSuccess: any, setActiveTab: any, location: any, showNotification: any }) => {
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
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                {/* Colonne visuelle (Gauche) */}
                <div className="hidden md:flex md:w-5/12 bg-yellow-400 p-12 flex-col justify-between text-gray-900 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-extrabold mb-4 text-red-600">Bienvenue chez Kodak</h2>
                        <p className="text-lg font-medium mb-6">Créez votre compte pour gérer vos commandes et accéder à nos services d'impression premium.</p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3"><div className="bg-white p-1 rounded-full"><Check className="w-4 h-4 text-green-600"/></div> Suivi de commande</li>
                            <li className="flex items-center gap-3"><div className="bg-white p-1 rounded-full"><Check className="w-4 h-4 text-green-600"/></div> Historique d'achats</li>
                            <li className="flex items-center gap-3"><div className="bg-white p-1 rounded-full"><Check className="w-4 h-4 text-green-600"/></div> Offres exclusives</li>
                        </ul>
                    </div>
                    {/* Cercle déco */}
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-yellow-300 rounded-full z-0 opacity-50"></div>
                    <div className="absolute top-12 -left-12 w-32 h-32 bg-yellow-500 rounded-full z-0 opacity-20"></div>
                </div>

                {/* Colonne Formulaire (Droite) */}
                <div className="w-full md:w-7/12 p-8 md:p-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center md:text-left">Créer un compte</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md border border-red-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

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
                            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition transform hover:scale-[1.01] shadow-md mt-6"
                        >
                            Créer mon compte
                        </button>
                    </form>

                </div>
            </div>
        </div>
        // <div className="max-w-md mx-auto py-12 px-4">
        //     <div className="bg-white shadow-lg rounded-lg p-8">
        //         <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
        //             <Server className="text-green-600" size={24} /> Inscription
        //         </h2>
        //
        //         {error && (
        //             <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md border border-red-200">
        //                 {error}
        //             </div>
        //         )}
        //
        //         <form onSubmit={handleSubmit} className="space-y-4">
        //             <div className="grid grid-cols-2 gap-4">
        //                 <div>
        //                     <label className="block text-sm font-medium text-gray-700">Prénom</label>
        //                     <input
        //                         type="text"
        //                         name="firstName"
        //                         required
        //                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
        //                         value={formData.firstName}
        //                         onChange={handleChange}
        //                     />
        //                 </div>
        //                 <div>
        //                     <label className="block text-sm font-medium text-gray-700">Nom</label>
        //                     <input
        //                         type="text"
        //                         name="lastName"
        //                         required
        //                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
        //                         value={formData.lastName}
        //                         onChange={handleChange}
        //                     />
        //                 </div>
        //             </div>
        //             <div>
        //                 <label className="block text-sm font-medium text-gray-700">Email</label>
        //                 <input
        //                     type="email"
        //                     name="email"
        //                     required
        //                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
        //                     value={formData.email}
        //                     onChange={handleChange}
        //                 />
        //             </div>
        //             <div>
        //                 <label className="block text-sm font-medium text-gray-700">Téléphone</label>
        //                 <input
        //                     type="tel"
        //                     name="phone"
        //                     pattern="[0-9]{10}"
        //                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
        //                     value={formData.phone}
        //                     onChange={handleChange}
        //                 />
        //             </div>
        //             <div ref={suggestionRef}>
        //                 <label className="block text-sm font-medium text-gray-700">Adresse</label>
        //                 <input
        //                     type="text"
        //                     name="address"
        //                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
        //                     value={formData.address}
        //                     onChange={handleAddressChange}
        //                     onFocus={() => formData.address.length > 3 && setShowSuggestions(true)}
        //                     autoComplete="off"
        //                     placeholder="123 Rue de l'Exemple"
        //                 />
        //                 {showSuggestions && suggestions.length > 0 && (
        //                     <ul className="w-full relative bg-white border border-opacity-10 border-gray-500 border-solid rounded-b z-50 shadow list-none m-0 p-0 max-h-52 overflow-y-auto">
        //                         {suggestions.map((item: any) => (
        //                             <li
        //                                 className="py-2.5 px-4 cursor-pointer border-b border-gray-50 border-solid text-sm"
        //                                 key={item.properties.id}
        //                                 onClick={() => handleSelectSuggestion(item)}
        //                                 onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
        //                                 onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
        //                             >
        //                                 {/* On affiche le label complet (ex: 8 Rue de Londres 75009 Paris) */}
        //                                 <strong>{item.properties.name}</strong> <span style={{color: '#666'}}>{item.properties.city}</span>
        //                             </li>
        //                         ))}
        //                     </ul>
        //                 )}
        //             </div>
        //
        //             <div>
        //                 <label className="block text-sm font-medium text-gray-700">Code Postale</label>
        //                 <input
        //                     type="text"
        //                     name="zipCode"
        //                     pattern="[1-9][0-9]{4}"
        //                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
        //                     value={formData.zipCode}
        //                     onChange={handleChange}
        //                     placeholder="75000"
        //                 />
        //             </div>
        //
        //             <div>
        //                 <label className="block text-sm font-medium text-gray-700">Ville</label>
        //                 <input
        //                     type="text"
        //                     name="city"
        //                     required
        //                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
        //                     value={formData.city}
        //                     onChange={handleChange}
        //                     placeholder="Paris"
        //                 />
        //             </div>
        //             <div>
        //                 <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
        //                 <input
        //                     type="password"
        //                     name="password"
        //                     required
        //                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
        //                     value={formData.password}
        //                     onChange={handleChange}
        //                 />
        //             </div>
        //             <div>
        //                 <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
        //                 <input
        //                     type="password"
        //                     name="confirmPassword"
        //                     required
        //                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
        //                     value={formData.confirmPassword}
        //                     onChange={handleChange}
        //                 />
        //             </div>
        //             <button
        //                 type="submit"
        //                 disabled={isLoading}
        //                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50"
        //             >
        //                 {isLoading ? <Loader className="animate-spin" size={20} /> : "S'inscrire"}
        //             </button>
        //         </form>
        //     </div>
        // </div>
    );
};