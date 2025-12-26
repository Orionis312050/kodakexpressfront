import {useEffect, useState} from "react";
import {User} from "../../constants/Interfaces";
import {ArrowLeft, Loader, Loader2, Save, Settings} from "lucide-react";
import {ManagerService} from "../../services/ManagerService";

export const EditProfileView = ({ currentUser, onSave, onCancel, onLogout }: { currentUser: any, onSave: any, onCancel: any, onLogout: any}) => {
    const [fullUser, setFullUser] = useState<User | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        zipCode: "",
        city: ""
    });

    const [suggestions, setSuggestions] = useState([]); // Liste des suggestions
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleAddressChange = async (e: any) => {
        const val = e.target.value;
        setFormData({ ...formData, address: val }); // On met à jour ce que l'utilisateur voit

        // On cherche seulement si l'utilisateur a tapé plus de 3 caractères
        if (val.length > 3) {
            try {
                const response = await fetch(`https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(val)}&limit=5`);
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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await ManagerService.getInstance().getUserByEmail(currentUser.email);
                setFullUser(user);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [currentUser.email]);

    useEffect(() => {
        if (fullUser) {
            console.log("fullUser", fullUser);
            setFormData({
                firstName: fullUser.firstName || '',
                lastName: fullUser.lastName || '',
                email: fullUser.email || '',
                phone: fullUser.phone || '',
                address: fullUser.address || '',
                zipCode: fullUser.zipCode || '',
                city: fullUser.city || ''
            });
        }
    }, [fullUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // On remet le loading le temps de la sauvegarde

        // On construit l'objet User mis à jour
        // Note: J'utilise fullUser comme base plutôt que currentUser pour être sûr d'avoir toutes les props
        const updatedUser: User = {
            ...fullUser!, // Le '!' assure à TS que fullUser existe ici
            ...formData   // On écrase avec les nouvelles données du formulaire
        };

        try {
            await onSave(updatedUser);
        } catch (error) {
            console.error("Erreur de sauvegarde", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-yellow-500" size={48} />
            </div>
        );
    }

    if (!fullUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
                    <p className="text-gray-600 mb-6">Impossible de charger les informations de votre profil.</p>
                    <button
                        onClick={onLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                        Retour à la connexion
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="bg-white shadow-lg rounded-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Settings className="text-gray-600" size={24} /> Modifier mes informations
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Adresse</label>
                        <input
                            type="text"
                            name="address"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                            value={formData.address}
                            onChange={handleAddressChange}
                            autoComplete="off"
                            placeholder="123 Rue de l'Exemple"
                        />
                        {showSuggestions && suggestions.length > 0 && (
                            <ul style={{
                                position: 'absolute',     // C'est ça qui fait "flotter" la liste
                                top: '100%',              // Juste en dessous du champ
                                left: 0,
                                right: 0,
                                zIndex: 1000,             // Pour passer au dessus des autres champs
                                background: 'white',
                                border: '1px solid #ddd',
                                borderRadius: '0 0 4px 4px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                listStyle: 'none',
                                margin: 0,
                                padding: 0,
                                maxHeight: '200px',
                                overflowY: 'auto'
                            }}>
                                {suggestions.map((item: any) => (
                                    <li
                                        key={item.properties.id}
                                        onClick={() => handleSelectSuggestion(item)}
                                        style={{
                                            padding: '10px 15px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #f0f0f0',
                                            fontSize: '14px'
                                        }}
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

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                        >
                            {loading ? <Loader className="animate-spin" size={18} /> : <><Save size={18} /> Enregistrer</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};