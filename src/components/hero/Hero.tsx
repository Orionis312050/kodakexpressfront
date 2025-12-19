import { BRAND_COLORS } from '../../constants/Constants';

export const Hero = ({ setActiveTab }: { setActiveTab: any }) => (
    <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <polygon points="50,0 100,0 50,100 0,100" />
                </svg>
                <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                    <div className="sm:text-center lg:text-left">
                        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                            <span className="block xl:inline">Imprimez vos</span>{' '}
                            <span className={`block ${BRAND_COLORS.redText} xl:inline`}>plus beaux souvenirs</span>
                        </h1>
                        <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                            Qualité laboratoire Kodak. Tirages simples, agrandissements, livres photo et objets personnalisés disponibles en 1 heure.
                        </p>
                        <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-3">
                            <div className="rounded-md shadow">
                                <button onClick={() => setActiveTab('commander')} className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white ${BRAND_COLORS.redBg} ${BRAND_COLORS.redHover} md:py-4 md:text-lg transition-colors`}>
                                    Commander maintenant
                                </button>
                            </div>
                            <div>
                                <button onClick={() => setActiveTab('services')} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 md:py-4 md:text-lg transition-colors">
                                    Nos services
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-100 flex items-center justify-center pointer-events-none">
            <div className="grid grid-cols-2 gap-4 p-8 transform rotate-3 opacity-90">
                <div className="w-40 h-52 bg-white shadow-lg p-2 pb-8 rounded transform -rotate-6">
                    <div className="w-full h-full bg-gray-200 rounded overflow-hidden relative">
                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500 text-xs">Photo 1</div>
                    </div>
                </div>
                <div className="w-40 h-52 bg-white shadow-lg p-2 pb-8 rounded transform rotate-6 mt-12">
                    <div className="w-full h-full bg-gray-200 rounded overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500 text-xs">Photo 2</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);