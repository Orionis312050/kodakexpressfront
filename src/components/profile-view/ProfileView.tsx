import {Loader2, LogOut, Package, Settings, UserIcon} from 'lucide-react';
import {User} from "../../constants/Interfaces";
import {ManagerService} from "../../services/ManagerService";
import {useEffect, useState} from "react";

export const ProfileView = ({ currentUser, orders, onLogout }: { currentUser: any, orders: any, onLogout: any }) => {
    const [fullUser, setFullUser] = useState<User | undefined>(undefined);
    const [loading, setLoading] = useState(true);

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

                {/* Sidebar Info Utilisateur */}
                <div className="lg:col-span-1">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="bg-yellow-400 px-4 py-5 sm:px-6 flex items-center justify-between">
                            <h3 className="text-lg leading-6 font-bold text-gray-900 flex items-center gap-2">
                                <UserIcon size={20} /> Mon Profil
                            </h3>
                            <button onClick={onLogout} className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition flex items-center gap-1">
                                <LogOut size={14} /> Déconnexion
                            </button>
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
                            </dl>
                        </div>
                        <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
                            <button className="text-sm font-medium text-red-600 hover:text-red-500 flex items-center gap-2">
                                <Settings size={16} /> Modifier mes informations
                            </button>
                        </div>
                    </div>
                </div>

                {/* Historique des commandes */}
                <div className="lg:col-span-2">
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-bold text-gray-900 flex items-center gap-2">
                                <Package size={20} /> Mes Commandes
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
                                                <p className="text-sm text-gray-500">{order.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    order.status === 'Livrée' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                  {order.status}
                                                </span>
                                                <p className="mt-1 text-sm font-bold text-gray-900">{order.total.toFixed(2)}€</p>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-xs text-gray-500">
                                                {order.items.length} article(s): {order.items.map((i: { name: any; }) => i.name).join(', ')}
                                            </p>
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