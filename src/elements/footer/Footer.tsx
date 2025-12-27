import { BRAND_COLORS } from '../../constants/Constants';

export const Footer = ({ setActiveTab }: { setActiveTab: any }) => (
    <footer className="bg-gray-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Brand Info */}
                <div>
                    <span className="font-bold text-xl tracking-tighter text-yellow-400">Kodak<span className="text-white">Express</span></span>
                    <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                        Votre partenaire photo de confiance depuis 1995. Qualité laboratoire, rapidité d'exécution et service client expert sont nos priorités quotidiennes.
                    </p>
                </div>
                {/* Quick Links */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Liens Rapides</h4>
                    <ul className="mt-4 space-y-2">
                        <li><button onClick={() => setActiveTab('services')} className="text-gray-400 hover:text-white transition-colors">Nos Services</button></li>
                        <li><button onClick={() => setActiveTab('contact')} className="text-gray-400 hover:text-white transition-colors">Trouver le magasin</button></li>
                        <li><button onClick={() => setActiveTab('commander')} className="text-gray-400 hover:text-white transition-colors">Commander en ligne</button></li>
                    </ul>
                </div>
                {/* Newsletter */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Newsletter</h4>
                    <p className="mt-2 text-gray-400 text-sm">Recevez nos offres exclusives et conseils photo.</p>
                    <div className="mt-3 flex">
                        <input
                            type="email"
                            placeholder="Votre email"
                            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l text-white focus:outline-none focus:ring-1 focus:ring-yellow-400 placeholder-gray-500"
                        />
                        <button className={`${BRAND_COLORS.redBg} px-4 py-2 rounded-r font-bold hover:bg-red-700 transition-colors`}>OK</button>
                    </div>
                </div>
            </div>
            <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Kodak Express Demo. Tous droits réservés.
            </div>
        </div>
    </footer>
);