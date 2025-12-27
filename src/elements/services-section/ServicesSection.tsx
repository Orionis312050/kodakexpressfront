import { BRAND_COLORS, SERVICES_DATA } from '../../constants/Constants';
import JsxParser from "react-jsx-parser";
import { ProductTypeIcon } from "../../constants/Interfaces";
import { IconName } from '../../constants/Interfaces';

export const ServicesSection = ({ products, showNotification }: {products: any[], showNotification: any}) => {

    return (
        <div className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className={`text-base font-semibold tracking-wide ${BRAND_COLORS.redText} uppercase`}>Nos Services</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Tout pour l'image
                    </p>
                </div>
                <div className="mt-10">
                    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                        {products.map((product: any) => (
                            <div key={product.id} className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-500 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200">
                                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-yellow-400 text-red-600 mb-4">
                                    <JsxParser
                                        // On passe la string
                                        jsx={product.icon}

                                        // IMPORTANT : On donne la "clé" pour comprendre les balises
                                        components={{ [product.iconName]: ProductTypeIcon[product.iconName as IconName] }}
                                    />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    {product.name}
                                </h3>
                                <p className="mt-2 text-sm text-gray-500">{product.description}</p>
                                <p className="mt-4 text-sm font-bold text-red-600">{product.price}€</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}