import { Image, UserIcon, Gift, Film } from 'lucide-react';
import { ServiceData, MenuItem } from './Interfaces';

export const BRAND_COLORS = {
    yellow: "bg-yellow-400",
    redText: "text-red-600",
    redBg: "bg-red-600",
    redHover: "hover:bg-red-700",
};

export const SERVICES_DATA: ServiceData[] = [
    {
        id: 1,
        title: "Tirages Numériques",
        icon: <Image size={32} />,
        desc: "Vos photos sur papier premium Kodak Royal.",
        price: "Dès 0,25€"
    },
    {
        id: 2,
        title: "Photos d'Identité",
        icon: <UserIcon size={32} />,
        desc: "Normes ANTS pour passeport, CNI, permis.",
        price: "12,00€ / planche"
    },
    {
        id: 3,
        title: "Cadeaux Photo",
        icon: <Gift size={32} />,
        desc: "Mugs, toiles, coussins personnalisés.",
        price: "Dès 14,90€"
    },
    {
        id: 4,
        title: "Développement Film",
        icon: <Film size={32} />,
        desc: "Expertise argentique couleur et N&B.",
        price: "Dès 9,90€"
    }
];

export const MENU_ITEMS: MenuItem[] = [
    { label: 'Accueil', key: 'home' },
    { label: 'Services', key: 'services' },
    { label: 'Commander', key: 'commander' },
    { label: 'Contact', key: 'contact' }
];