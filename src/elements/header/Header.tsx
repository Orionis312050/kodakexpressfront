import {type Dispatch, type SetStateAction, useState} from "react";
import {Menu, ShoppingCart, X, UserIcon, LogOut} from "lucide-react";
import {BRAND_COLORS, MENU_ITEMS } from "../../constants/Constants";
import type {Tab, UserContext} from "../../constants/Interfaces";

export const Header = ({ activeTab, setActiveTab, cartCount, currentUser, onLogout }: { activeTab: Tab, setActiveTab: Dispatch<SetStateAction<Tab>>, cartCount: number, currentUser: UserContext | null, onLogout: () => void }) => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    console.log(currentUser);

    return (
        <nav className={`sticky top-0 z-40 ${BRAND_COLORS.yellow} shadow-md`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => setActiveTab('home')}
                        role="button"
                        tabIndex={0}
                    >
                        <div className={`bg-red-600 text-white p-1 rounded mr-2 font-bold text-xl`}>K</div>
                        <span className={`font-bold text-2xl tracking-tighter ${BRAND_COLORS.redText}`}>
              Kodak<span className="text-black">Express</span>
            </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {MENU_ITEMS.map((item) => {
                                const isActive = activeTab === item.key;
                                return (
                                    <button
                                        key={item.key}
                                        onClick={() => setActiveTab(item.key)}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                            isActive ? 'bg-black/10 text-black' : 'text-black/70 hover:text-black hover:bg-black/5'
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center gap-4">

                        {/* User Account Icon */}
                        {currentUser ? (
                            <button
                                onClick={() => setActiveTab('profile')}
                                className="hidden md:flex items-center gap-2 text-sm font-medium text-black hover:bg-black/5 px-3 py-2 rounded-full transition-colors"
                            >
                                <div className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                    {currentUser.firstName.charAt(0)}
                                </div>
                                <span className="truncate max-w-[100px]">{currentUser.firstName}</span>
                            </button>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <button
                                    onClick={() => setActiveTab('login')}
                                    className="flex items-center gap-1 text-sm font-medium text-black hover:bg-black/5 px-3 py-2 rounded-md transition-colors"
                                >
                                    <UserIcon size={18} /> Connexion
                                </button>
                                <button
                                    onClick={() => setActiveTab('register')}
                                    className={`text-sm font-medium text-white px-3 py-2 rounded-md transition-colors ${BRAND_COLORS.redBg} ${BRAND_COLORS.redHover}`}
                                >
                                    S'inscrire
                                </button>
                            </div>
                        )}

                        <button
                            className="relative p-2 text-black hover:bg-black/5 rounded-full transition-colors"
                            onClick={() => setActiveTab('cart')}
                            aria-label="Voir le panier"
                        >
                            <ShoppingCart size={24} />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                    {cartCount}
                  </span>
                            )}
                        </button>
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-black p-2"
                                aria-label="Ouvrir le menu"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-yellow-300 pb-4 border-t border-yellow-400">
                    {MENU_ITEMS.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => {
                                setActiveTab(item.key);
                                setIsMenuOpen(false);
                            }}
                            className="block w-full text-left px-4 py-3 text-black hover:bg-black/5 font-medium border-b border-yellow-400 last:border-0"
                        >
                            {item.label}
                        </button>
                    ))}
                    <div className="border-t border-yellow-400 mt-2 pt-2">
                        {currentUser ? (
                            <>
                                <button onClick={() => { setActiveTab('profile'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 font-medium flex items-center gap-2">
                                    <UserIcon size={18} /> Mon Profil ({currentUser.firstName})
                                </button>
                                <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 text-red-700 font-medium flex items-center gap-2">
                                    <LogOut size={18} /> Déconnexion
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => { setActiveTab('login'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 font-medium flex items-center gap-2">
                                    <UserIcon size={18} /> Se connecter
                                </button>
                                <button onClick={() => { setActiveTab('register'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 font-medium text-red-700 flex items-center gap-2">
                                    <UserIcon size={18} /> Créer un compte
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};