import React from 'react';
import {Film, Gift, Image, UserIcon} from 'lucide-react';

export type Tab = 'home' | 'services' | 'commander' | 'contact' | 'cart' | 'login' | 'register' | 'profile' | 'edit-profile';

// 2. Statut de commande
export type OrderStatus = 'En attente' | 'En traitement' | 'Prête' | 'Livrée';

export const ProductTypeIcon = {
    Image: Image,
    Film: Film,
    Gift: Gift,
    UserIcon: UserIcon,
};

export type IconName = keyof typeof ProductTypeIcon;

export interface GeneratePresignedUrlDto {
    userId: string;
    orderId: string;
    fileType: string;
    originalName: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto extends User {
    password: string;
}

export interface AuthResponse {
    access_token: string;
    user: UserContext;
}

export interface GeoSuggestCollection {
    type: string;
    features: GeoSuggest[];
    query: string;
}

export interface GeoSuggest {
    type: string;
    properties: GeoSuggestProperties;
    geometry: GeoSuggestGeometry;
}

export interface GeoSuggestProperties {
    label: string;
    id: string;
    postcode: string;
    city: string;
    district: string;
    street: string;
    housenumber: string;
    citycode: string;
    x: number;
    y: number;
    score: number;
    name: string;
    type: string;
    _type: string;
    contexte: string;
    importance: string;
}

export interface GeoSuggestGeometry {
    type: string;
    coordinates: number[];
}

export interface LocationBrowser {
    About_Us: string;
    borders: string;
    calling_code: string;
    capital: string;
    city: string;
    connection: any;
    continent: string;
    continent_code: string;
    country: string;
    country_code: string;
    flag: any;
    ip: string;
    is_eu: boolean;
    latitude: number;
    longitude: number;
    postal: string;
    region: string;
    region_code: string;
    success: boolean;
    timezone: any;
    type: string;
}

export interface ProductDto {
    id: number;
    name: string;
    description: string;
    price: number;
    inStock: number;
    category: string;
}

// 3. Interface Utilisateur
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    zipCode: string;
    city: string;
}

export interface UserContext {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

// 4. Interface Commande
export interface Order {
    id: string;
    date: string;
    items: CartItem[];
    total: number;
    status: OrderStatus;
}

// 5. Interface Panier
export interface CartItem {
    name: string;
    price: number;
    imageUrl?: string;
}

// 6. Données Services
export interface ServiceData {
    id: number;
    title: string;
    icon: React.ReactNode;
    desc: string;
    price: string;
}

// 7. Menu Item
export interface MenuItem {
    label: string;
    key: Tab;
}

// 8. Props des composants
export interface HeaderProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
    cartCount: number;
    currentUser: User | null;
    onLogout: () => void;
}

export interface FooterProps {
    setActiveTab: (tab: Tab) => void;
}

export interface HeroProps {
    setActiveTab: (tab: Tab) => void;
}

export interface OrderSectionProps {
    onAddToCart: (item: CartItem) => void;
}

export interface CartViewProps {
    cart: CartItem[];
    setActiveTab: (tab: Tab) => void;
    currentUser: User | null;
    onCheckout: () => void;
}

export interface LoginViewProps {
    onLogin: (email: string, pass: string) => boolean;
    setActiveTab: (tab: Tab) => void;
}

export interface RegisterViewProps {
    onRegister: (user: User) => void;
    setActiveTab: (tab: Tab) => void;
}

export interface ProfileViewProps {
    currentUser: User;
    orders: Order[];
    onLogout: () => void;
}

export interface ProductData {
    id: number;
    name: string;
    description: string;
    price: number;
    inStock: number;
    category: string;
    iconName: string;
    icon: string; // Pour l'affichage UI
}

export interface EmailResponse {
    success: boolean;
    message: string;
}

export interface EmailPayload {
    to: string;
    subject: string;
    message: string;
    name?: string;
    orderDetailsUri: string;
    email?: string;
}