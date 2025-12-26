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
import './App.css';
import {
    AuthResponse,
    CartItem,
    LocationBrowser,
    Order,
    ProductData,
    Tab,
    User,
    UserContext
} from "./constants/Interfaces";
import {ManagerService} from "./services/ManagerService";
import {EditProfileView} from "./components/edit-profile-view/EditProfileView";

function App() {
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [currentUser, setCurrentUser] = useState<UserContext | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<ProductData[]>([]);
    const [location, setLocation] = useState<LocationBrowser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const manager = ManagerService.getInstance();
        manager.getProducts().then(setProducts);

        const checkSession = async () => {
            const user = await manager.verifyToken();

            if (user != null) {
                setCurrentUser(user);
            }
        };

        checkSession();
    }, []);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                // Appel à une API publique de géolocalisation IP
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();

                console.log(data);

                setLocation(data as LocationBrowser);
            } catch (error) {
                console.error("Erreur lors de la récupération de la localisation IP:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLocation();
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

    const handleLoginSuccess = (authResponse: AuthResponse) => {
        setCurrentUser(authResponse.user);
        setActiveTab('profile');
        showNotification(`Bienvenue ${authResponse.user.firstName} !`);
    };

    const handleRegisterSuccess = (user: User) => {
        setActiveTab('login');
        showNotification("Compte créé ! Veuillez vous connecter.");
    };

    const handleLogout = async () => {
        try {
            await ManagerService.getInstance().logout();
        } catch (error) {
            console.error("Erreur lors du logout", error);
        } finally {
            setCurrentUser(null);
            setOrders([]);
            setActiveTab('home');
            showNotification("Déconnecté.");
        }
    };

    const handleCheckout = async () => {
        if (!currentUser) return;

        try {
            const total = cart.reduce((acc, item) => acc + item.price, 0);

            const newOrder = await ManagerService.getInstance().createOrder(cart, total);

            setOrders([newOrder, ...orders]);
            setCart([]);
            setActiveTab('profile');
            showNotification("Commande enregistrée !");
        } catch (e) {
            console.error("Erreur commande", e);
            showNotification("Erreur lors de la commande. Êtes-vous connecté ?");
        }
    };

    const handleUpdateProfile = async (updatedUser: User) => {
        try {
            const user = await ManagerService.getInstance().updateUser(updatedUser);
            setCurrentUser(user as UserContext);
            setActiveTab('profile');
            showNotification("Profil mis à jour !");
        } catch (error) {
            showNotification("Erreur lors de la mise à jour.");
        }
    };

    // Filtre les commandes pour l'utilisateur actuel
    // const userOrders = orders.filter((o: any) => o.userId === currentUser?.id);

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

                {activeTab === 'commander' && <OrderSection onAddToCart={addToCart} products={products} setActiveTab={setActiveTab} currentUser={currentUser} />}

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

                {activeTab === 'register' && <RegisterView onRegisterSuccess={handleRegisterSuccess} setActiveTab={setActiveTab} location={location} />}

                {activeTab === 'profile' && currentUser && (
                    <ProfileView
                        currentUser={currentUser}
                        orders={orders}
                        onLogout={handleLogout}
                        setActiveTab={setActiveTab}
                        onEditProfile={() => setActiveTab('edit-profile')}
                    />
                )}
                {activeTab === 'edit-profile' && currentUser && (
                    <EditProfileView
                        currentUser={currentUser}
                        onSave={handleUpdateProfile}
                        onCancel={() => setActiveTab('profile')}
                        onLogout={handleLogout}
                        location={location}
                    />
                )}
            </main>

            <Footer setActiveTab={setActiveTab} />
        </div>
    );
}

export default App;
