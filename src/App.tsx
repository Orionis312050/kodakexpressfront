import React, {useEffect, useState} from 'react';
import { Header } from './components/header/Header';
import { Hero } from './components/hero/Hero';
import { ServicesSection } from './components/services-section/ServicesSection';
import { OrderSection } from './components/order-section/OrderSection';
import { ContactSection } from './components/contact-section/ContactSection';
import { CartView } from './components/cart-view/CartView';
import { Footer } from './components/footer/Footer';
import { LoginView } from './components/login-view/LoginView';
import { ProfileView } from './components/profile-view/ProfileView';
import { RegisterView } from './components/register-view/RegisterView';
// import logo from './logo.svg';
import './App.css';
import {AuthResponse, CartItem, LoginDto, Order, ProductData, RegisterDto, Tab, User} from "./constants/Interfaces";
import {ManagerService} from "./services/ManagerService";

function App() {
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<ProductData[]>([]);

    useEffect(() => {
        const manager = ManagerService.getInstance();
        manager.getProducts().then(setProducts);

        // --- RESTAURATION SÉCURISÉE DE SESSION VIA TOKEN ---
        const checkSession = async () => {
            const token = localStorage.getItem('kodak_access_token');
            if (token) {
                try {
                    // On vérifie le token auprès du "serveur" (simulation)
                    const user = await manager.verifyToken(token);
                    setCurrentUser(user);

                    // Si valide, on charge les données
                    // manager.getUserOrders(token).then(setOrders);
                } catch (e) {
                    console.error("Session invalide:", e);
                    // Si token invalide, on nettoie
                    localStorage.removeItem('kodak_access_token');
                }
            }
        };

        checkSession();
    }, []);

    const addToCart = (item: CartItem) => {
        setCart([...cart, item]);
        showNotification(`${item.name} ajouté !`);
    };

    const removeFromCart = (index: number) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const showNotification = (message: string) => {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-bounce flex items-center gap-2';
        notification.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> ${message}`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2500);
    };

    // --- LOGIC AUTHENTIFICATION ---

    const handleLoginSuccess = (authResponse: AuthResponse) => {
        setCurrentUser(authResponse.user);
        // ON STOCKE LE TOKEN (Pas le mot de passe, pas l'objet user complet)
        localStorage.setItem('kodak_access_token', authResponse.access_token);
        setActiveTab('profile');
        showNotification(`Bienvenue ${authResponse.user.firstName} !`);
    };

    const handleRegisterSuccess = (user: User) => {
        // Pour l'instant l'inscription ne connecte pas auto (on pourrait le faire)
        setActiveTab('login');
        showNotification("Compte créé ! Veuillez vous connecter.");
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setOrders([]);
        // ON SUPPRIME LE TOKEN
        localStorage.removeItem('kodak_access_token');
        setActiveTab('home');
        showNotification("Déconnecté.");
    };

    const handleCheckout = async () => {
        if (!currentUser) return;

        // On récupère le token pour authentifier la requête
        const token = localStorage.getItem('kodak_access_token');
        if (!token) {
            handleLogout();
            return;
        }

        const total = cart.reduce((acc, item) => acc + item.price, 0);
        const newOrder = await ManagerService.getInstance().createOrder(token, cart, total);
        setOrders([newOrder, ...orders]);
        setCart([]);
        setActiveTab('profile');
        showNotification("Commande enregistrée !");
    };

    // Filtre les commandes pour l'utilisateur actuel
    const userOrders = orders.filter((o: any) => o.userId === currentUser?.id);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
            <Header
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                cartCount={cart.length}
                currentUser={currentUser}
                onLogout={handleLogout}
            />

            <main className="flex-grow">
                {activeTab === 'home' && (
                    <>
                        <Hero setActiveTab={setActiveTab} />
                        <ServicesSection products={products} />
                    </>
                )}

                {activeTab === 'services' && <ServicesSection products={products} />}

                {activeTab === 'commander' && <OrderSection onAddToCart={addToCart} products={products} />}

                {activeTab === 'contact' && <ContactSection />}

                {activeTab === 'cart' && (
                    <CartView
                        cart={cart}
                        setActiveTab={setActiveTab}
                        currentUser={currentUser}
                        onCheckout={handleCheckout}
                        removeFromCart={removeFromCart}
                    />
                )}

                {activeTab === 'login' && <LoginView onLoginSuccess={handleLoginSuccess} setActiveTab={setActiveTab} />}

                {activeTab === 'register' && <RegisterView onRegisterSuccess={handleRegisterSuccess} setActiveTab={setActiveTab} />}

                {activeTab === 'profile' && currentUser && (
                    <ProfileView
                        currentUser={currentUser}
                        orders={orders}
                        onLogout={handleLogout}
                    />
                )}
            </main>

            <Footer setActiveTab={setActiveTab} />
        </div>
    );
}

export default App;
