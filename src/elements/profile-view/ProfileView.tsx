import {Loader2, LogOut, Package, Settings, ShieldCheck, UserIcon} from 'lucide-react';
import type {User} from "../../constants/Interfaces";
import {ManagerService} from "../../services/ManagerService";
import {useEffect, useState} from "react";

export const ProfileView = ({ currentUser, orders, onLogout, setActiveTab, onEditProfile, showNotification }: { currentUser: any, orders: any, onLogout: any, setActiveTab:any, onEditProfile: any, showNotification: any }) => {
    const [fullUser, setFullUser] = useState<User | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    if (!currentUser) {
        setActiveTab('login');
    }

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
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="bg-yellow-400 px-4 py-5 sm:px-6 flex items-center justify-between">
                            <h3 className="text-lg leading-6 font-bold text-gray-900 flex items-center gap-2">
                                <UserIcon size={20} /> Mon Profil
                            </h3>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            <dl className="sm:divide-y sm:divide-gray-200">
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Nom</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{fullUser.firstName} {fullUser.lastName}</dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{fullUser.email}</dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{fullUser.phone || "Non renseigné"}</dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Adresse</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{fullUser.address + ', ' + fullUser.zipCode + ' ' + fullUser.city || "Non renseignée"}</dd>
                                </div>
                            </dl>
                        </div>
                        <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200 flex justify-between items-center">
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                <ShieldCheck size={12} className="text-green-600" /> Session sécurisée
                            </div>
                            <button
                                onClick={onEditProfile}
                                className="text-sm font-medium text-red-600 hover:text-red-500 flex items-center gap-2"
                            >
                                <Settings size={16} /> Modifier
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="w-full mt-4 flex justify-center items-center gap-2 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                        <LogOut size={16} /> Déconnexion
                    </button>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-bold text-gray-900 flex items-center gap-2">
                                <Package size={20} /> Mes Commandes (Table: orders)
                            </h3>
                        </div>
                        {orders.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <p>Aucune commande pour le moment.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {orders.map((order: any) => (
                                    <li key={order.id} className="p-4 hover:bg-gray-50 transition">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-red-600">Commande #{order.id}</p>
                                                <p className="text-xs text-gray-400">Date: {order.order_date}</p>
                                            </div>
                                            <div className="text-right">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                             order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                         }`}>
                          {order.status}
                        </span>
                                                <p className="mt-1 text-sm font-bold text-gray-900">{order.total.toFixed(2)}€</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};