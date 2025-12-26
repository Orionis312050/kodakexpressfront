import React, { useState } from 'react';
import { Upload, Star } from 'lucide-react';

export const OrderSection = ({ onAddToCart, products, currentUser, setActiveTab }: { onAddToCart: any, products: any[], currentUser: any, setActiveTab: any }) => {
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    if (!currentUser) {
        setActiveTab('login');
    }

    const handleUpload = () => {
        if (isUploading) return;
        setIsUploading(true);
        setUploadProgress(0);
        const interval: ReturnType<typeof setInterval> = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    onAddToCart({ name: "Pack 50 Tirages 10x15", price: 15.00 });
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8 bg-gray-50 border-b border-gray-100 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Borne Kodak Express</h2>
                    <p className="text-gray-500 mt-2">Glissez vos photos ici pour commencer vos tirages</p>
                </div>

                <div className="p-8">
                    {isUploading ? (
                        <div className="text-center py-16">
                            <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                                <div className="bg-yellow-400 h-full rounded-full transition-all duration-100 ease-linear" style={{ width: `${uploadProgress}%`}}></div>
                            </div>
                            <p className="text-gray-600 font-medium animate-pulse">Traitement de vos photos... {uploadProgress}%</p>
                        </div>
                    ) : (
                        <div
                            onClick={handleUpload}
                            className="border-4 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-yellow-400 hover:bg-yellow-50 transition-colors group"
                            role="button"
                            tabIndex={0}
                        >
                            <Upload size={64} className="text-gray-400 mb-4 group-hover:text-yellow-600 transition-colors" />
                            <h3 className="text-xl font-medium text-gray-900">Sélectionnez vos fichiers</h3>
                            <p className="text-gray-500 text-sm mt-2">JPG, PNG, HEIC acceptés</p>
                            <button className="mt-6 px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors">
                                Parcourir mon appareil
                            </button>
                        </div>
                    )}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex flex-col justify-center">
                            <h4 className="font-bold text-gray-800 flex items-center gap-2"><Star size={16} className="text-red-600" /> Offre du moment</h4>
                            <p className="text-sm text-gray-600 mt-1">Pack 50 tirages 10x15cm à <strong>15€</strong> seulement !</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};