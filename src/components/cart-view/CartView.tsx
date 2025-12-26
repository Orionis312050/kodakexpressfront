import {ShoppingCart, Image, ChevronRight, X} from 'lucide-react';
import { BRAND_COLORS } from '../../constants/Constants';

export const CartView = ({ cart, setActiveTab, currentUser, onCheckout, removeFromCart }: { cart: any, setActiveTab: any, currentUser: any, onCheckout: any, removeFromCart:any }) => {
    const calculateTotal = (): string => cart.reduce((acc: any, item: any) => acc + item.price, 0).toFixed(2);

    if (!currentUser) {
        setActiveTab('login');
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <ShoppingCart className="text-red-600" /> Votre Panier
            </h2>
            {cart.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Votre panier est vide</h3>
                    <button onClick={() => setActiveTab('commander')} className="mt-6 text-red-600 font-medium hover:underline">
                        Commencer une commande
                    </button>
                </div>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                    <ul className="divide-y divide-gray-200">
                        {cart.map((item: any, idx: any) => (
                            <li key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                        <Image size={20} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-900 block">{item.name}</span>
                                        <p className="text-xs text-gray-500">Quantité: {item.quantity}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-gray-900">{item.price.toFixed(2)}€</span>
                                    <button onClick={() => removeFromCart(idx)} className="text-gray-400 hover:text-red-500"><X size={18} /></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                        <span className="text-lg font-bold text-gray-700">Total TTC</span>
                        <span className="text-2xl font-bold text-red-600">{calculateTotal()}€</span>
                    </div>
                    <div className="p-6 bg-gray-50 border-t border-gray-200">
                        {currentUser ? (
                            <button
                                onClick={onCheckout}
                                className="w-full bg-yellow-400 text-black font-bold py-4 rounded shadow-sm hover:bg-yellow-500 hover:shadow transition-all flex items-center justify-center gap-2 text-lg"
                            >
                                Valider et Payer <ChevronRight size={24} />
                            </button>
                        ) : (
                            <div className="text-center">
                                <p className="mb-4 text-gray-600">Vous devez être connecté pour valider votre commande.</p>
                                <button onClick={() => setActiveTab('login')} className={`w-full ${BRAND_COLORS.redBg} text-white font-bold py-3 rounded hover:bg-red-700`}>
                                    Se connecter pour payer
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};