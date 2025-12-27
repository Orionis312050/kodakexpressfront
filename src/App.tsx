import {useEffect, useState} from 'react'
import { Hero } from './elements/hero/Hero';
import { ServicesSection } from './elements/services-section/ServicesSection';
import { OrderSection } from './elements/order-section/OrderSection';
import { ContactSection } from './elements/contact-section/ContactSection';
import { CartView } from './elements/cart-view/CartView';
import { Footer } from './elements/footer/Footer';
import { LoginView } from './elements/login-view/LoginView';
import { ProfileView } from './elements/profile-view/ProfileView';
import { RegisterView } from './elements/register-view/RegisterView';
import './App.css';
import type {
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
import {EditProfileView} from "./elements/edit-profile-view/EditProfileView";
import {Toaster} from "./components/ui/sonner";
import { toast } from "sonner"
import {Header} from "./elements/header/Header";
import './App.css'

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
        showNotification(`${item.name} ajouté !`, 'SUCCESS');
    };

    const removeFromCart = (index: number) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const showNotification = (message: string, messageType: 'SUCCESS' | 'ERROR' | 'LOADING' | 'INFO' | 'WARNING') => {
        switch (messageType) {
            case 'SUCCESS':
                toast.success(message);
                break;
            case 'ERROR':
                toast.error(message);
                break;
            case 'LOADING':
                toast.loading(message);
                break;
            case 'WARNING':
                toast.warning(message);
                break;
            default:
            case 'INFO':
                toast.info(message);
                break;
        }
    };

    const handleLoginSuccess = (authResponse: AuthResponse) => {
        setCurrentUser(authResponse.user);
        setActiveTab('home');
        showNotification(`Bienvenue ${authResponse.user.firstName} !`, 'INFO');
    };

    const handleRegisterSuccess = (user: User) => {
        setActiveTab('login');
        showNotification("Compte créé ! Veuillez vous connecter.", 'SUCCESS');
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
            showNotification("Déconnecté.", 'SUCCESS');
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
            showNotification("Commande enregistrée !", 'SUCCESS');
        } catch (e) {
            console.error("Erreur commande", e);
            showNotification("Erreur lors de la commande. Êtes-vous connecté ?", 'ERROR');
        }
    };

    const handleUpdateProfile = async (updatedUser: User) => {
        try {
            const user = await ManagerService.getInstance().updateUser(updatedUser);
            setCurrentUser(user as UserContext);
            setActiveTab('profile');
            showNotification("Profil mis à jour !", 'SUCCESS');
        } catch (error) {
            showNotification("Erreur lors de la mise à jour.", 'ERROR');
        }
    };

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
                        <ServicesSection products={products} showNotification={showNotification} />
                    </>
                )}

                {activeTab === 'services' && <ServicesSection products={products} showNotification={showNotification} />}

                {activeTab === 'commander' && <OrderSection onAddToCart={addToCart} products={products} setActiveTab={setActiveTab} currentUser={currentUser} showNotification={showNotification} />}

                {activeTab === 'contact' && <ContactSection />}

                {activeTab === 'cart' && (
                    <CartView
                        cart={cart}
                        setActiveTab={setActiveTab}
                        currentUser={currentUser}
                        onCheckout={handleCheckout}
                        removeFromCart={removeFromCart}
                        showNotification={showNotification}
                    />
                )}

                {activeTab === 'login' && <LoginView onLoginSuccess={handleLoginSuccess} setActiveTab={setActiveTab} showNotification={showNotification} />}

                {activeTab === 'register' && <RegisterView onRegisterSuccess={handleRegisterSuccess} setActiveTab={setActiveTab} location={location} showNotification={showNotification} />}

                {activeTab === 'profile' && currentUser && (
                    <ProfileView
                        currentUser={currentUser}
                        orders={orders}
                        onLogout={handleLogout}
                        setActiveTab={setActiveTab}
                        onEditProfile={() => setActiveTab('edit-profile')}
                        showNotification={showNotification}
                    />
                )}
                {activeTab === 'edit-profile' && currentUser && (
                    <EditProfileView
                        currentUser={currentUser}
                        onSave={handleUpdateProfile}
                        onCancel={() => setActiveTab('profile')}
                        onLogout={handleLogout}
                        location={location}
                        showNotification={showNotification}
                    />
                )}
                <Toaster />
            </main>

            <Footer setActiveTab={setActiveTab} />
        </div>
    );
}

export default App
