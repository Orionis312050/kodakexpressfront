import { MapPin, Phone, Mail } from "lucide-react";

export const ContactSection = () => (
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
                            12 Rue de la Photographie<br/>
                            75001 Paris, France
                        </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-100">
                        <dt className="text-sm font-medium text-gray-500 flex items-center gap-2"><Phone size={18} /> Téléphone</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">01 23 45 67 89</dd>
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
                                        09h30 - 19h30
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

        <div className="mt-8 bg-gray-200 w-full h-64 rounded-lg flex items-center justify-center text-gray-500 shadow-inner">
            <div className="text-center">
                <MapPin size={48} className="mx-auto mb-2 text-red-600" />
                <p className="font-medium">Carte Google Maps</p>
            </div>
        </div>
    </div>
);