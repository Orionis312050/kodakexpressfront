import { MapPin, Phone, Mail } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // ⚠️ Très important : le CSS de Leaflet
import L, {type LatLngExpression} from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export const ContactSection = () => {

    const position = [45.6482249, 0.1607603] as LatLngExpression;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Informations Pratiques</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Retrouvez-nous en boutique.</p>
                </div>
                <div>
                    <dl>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-100">
                            <dt className="text-sm font-medium text-gray-500 flex items-center gap-2"><MapPin size={18} /> Adresse</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                1 Rue Hergé <br/>
                                16000 Angoulême, France
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-100">
                            <dt className="text-sm font-medium text-gray-500 flex items-center gap-2"><Phone size={18} /> Téléphone</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">05 45 92 77 03</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-100">
                            <dt className="text-sm font-medium text-gray-500 flex items-center gap-2"><Mail size={18} /> Email</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">contact@kodakexpress-demo.fr</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Horaires d'ouverture</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                    <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                        <div className="w-0 flex-1 flex items-center">
                                            <span className="ml-2 flex-1 w-0 truncate">Lundi - Samedi</span>
                                        </div>
                                        <div className="ml-4 flex-shrink-0 font-bold text-green-600">
                                            09h30 - 12h30 / 13h30 - 18h30
                                        </div>
                                    </li>
                                    <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm bg-gray-50">
                                        <div className="w-0 flex-1 flex items-center">
                                            <span className="ml-2 flex-1 w-0 truncate">Dimanche</span>
                                        </div>
                                        <div className="ml-4 flex-shrink-0 text-red-500">
                                            Fermé
                                        </div>
                                    </li>
                                </ul>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="mt-8 bg-gray-200 w-full h-64 rounded-lg overflow-hidden flex items-center justify-center text-gray-500 shadow-inner">
                <MapContainer
                    center={position}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={false} // Désactive le zoom molette (comme sur les sites pro)
                >
                    {/* Le fond de carte (ici OpenStreetMap, gratuit) */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Le marqueur de votre enseigne */}
                    <Marker position={position}>
                        <Popup>
                            <strong>Kodak Express</strong> <br />
                            Nous sommes ici ! <br/>
                            <a href="https://www.google.com/maps/place/Kodak+Express/@45.6482249,0.1607603,17z/data=!3m1!4b1!4m6!3m5!1s0x47fe32706f46482b:0x1ca2de5b886ac527!8m2!3d45.6482249!4d0.1607603!16s%2Fg%2F11b6dg07j4?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D" target="_blank" rel="noreferrer">
                                Voir sur Google Maps
                            </a>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
}
