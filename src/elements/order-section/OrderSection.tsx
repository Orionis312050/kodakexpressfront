import {type Dispatch, type SetStateAction, useRef, useState} from 'react';
import {Plus, Printer, Trash2, Upload} from 'lucide-react';
import type {CartItem, Tab, UserContext} from "@/constants/Interfaces.tsx";

export const OrderSection = ({ onAddToCart, currentUser, setActiveTab }: { onAddToCart: (item: CartItem) => void, currentUser: UserContext | null, setActiveTab: Dispatch<SetStateAction<Tab>> }) => {
    const [uploadedFiles, setUploadedFiles] = useState<Array<{file: File, preview: string}>>([]);
    const [dragActive, setDragActive] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    if (!currentUser) {
        setActiveTab('login');
    }

    // Handle drag events
    const handleDrag = function(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // Handle drop event
    const handleDrop = function(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    // Handle file input change
    const handleChange = function(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }
    };

    // Process files
    const handleFiles = (files: FileList) => {
        const newFiles = Array.from(files).map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setUploadedFiles(prev => [...prev, ...newFiles]);
    };

    // Remove specific file from preview
    const removeFile = (index: number) => {
        setUploadedFiles(prev => {
            const newFiles = [...prev];
            // Clean up object URL to avoid memory leaks
            URL.revokeObjectURL(newFiles[index].preview);
            newFiles.splice(index, 1);
            return newFiles;
        });
    };

    // Trigger file input click
    const onButtonClick = () => {
        inputRef.current?.click();
    };

    const handleUploadProcess = () => {
        if (isUploading || uploadedFiles.length === 0) return;
        setIsUploading(true);
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);

                    // Add items to cart (simulate 1 item per file or a pack)
                    const qty = uploadedFiles.length;
                    const pricePerPhoto = 0.25;
                    const total = qty * pricePerPhoto;

                    onAddToCart({
                        name: `Tirages Standard (${qty} photos)`,
                        price: total,
                        imageUrl: uploadedFiles[0].preview // Use first image as thumbnail
                    });

                    // Clear files after upload (optional, kept for UX)
                    setUploadedFiles([]);
                    return 100;
                }
                return prev + 10;
            });
        }, 150);
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
                        <>
                            {/* Drag and Drop Zone */}
                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={onButtonClick}
                                className={`border-4 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-colors group ${
                                    dragActive ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 hover:border-yellow-400 hover:bg-yellow-50'
                                }`}
                            >
                                <input
                                    ref={inputRef}
                                    type="file"
                                    className="hidden"
                                    multiple={true}
                                    accept="image/*"
                                    onChange={handleChange}
                                />
                                <Upload size={64} className={`mb-4 transition-colors ${dragActive ? 'text-yellow-600' : 'text-gray-400 group-hover:text-yellow-600'}`} />
                                <h3 className="text-xl font-medium text-gray-900">
                                    {dragActive ? "Déposez vos fichiers ici" : "Sélectionnez vos fichiers"}
                                </h3>
                                <p className="text-gray-500 text-sm mt-2">JPG, PNG, HEIC acceptés</p>
                                <button className="mt-6 px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors pointer-events-none">
                                    Parcourir mon appareil
                                </button>
                            </div>

                            {/* Preview Grid */}
                            {uploadedFiles.length > 0 && (
                                <div className="mt-8">
                                    <h4 className="font-bold text-gray-700 mb-4 flex items-center justify-between">
                                        <span>Vos photos ({uploadedFiles.length})</span>
                                        <button onClick={() => setUploadedFiles([])} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
                                            <Trash2 size={14} /> Tout supprimer
                                        </button>
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {uploadedFiles.map((fileObj, idx) => (
                                            <div key={idx} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                <img src={fileObj.preview} alt="preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {/* Add More Button */}
                                        <div
                                            onClick={onButtonClick}
                                            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
                                        >
                                            <Plus size={24} />
                                            <span className="text-xs mt-1">Ajouter</span>
                                        </div>
                                    </div>

                                    {/* Order Action */}
                                    <div className="mt-8 flex justify-end items-center gap-4 border-t pt-6">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Total estimé</p>
                                            <p className="text-2xl font-bold text-red-600">{(uploadedFiles.length * 0.25).toFixed(2)}€</p>
                                        </div>
                                        <button
                                            onClick={handleUploadProcess}
                                            className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors shadow-md flex items-center gap-2"
                                        >
                                            <Printer size={20} />
                                            Commander ces tirages
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};