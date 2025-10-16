import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Motorcycle, Expense, Promotion } from '../types';
import { ChevronLeftIcon, CameraIcon, TrashIcon } from '../components/Icons';
import { formatCurrency, calculateTotalExpenses, calculateTotalPromotions, calculateFinalCost, calculateProfit, fileToBase64 } from '../utils/helpers';

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-surface p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-bold mb-3 border-b border-gray-600 pb-2">{title}</h2>
        {children}
    </div>
);

const DetailItem: React.FC<{ label: string; value: string | number; isEditable?: boolean; name?: string; type?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; isTextArea?: boolean }> = ({ label, value, isEditable, name, type='text', onChange, isTextArea }) => (
    <div className="mb-2">
        <p className="text-sm text-text-secondary">{label}</p>
        {isEditable ? (
            isTextArea ? (
                 <textarea name={name} value={value} onChange={onChange} rows={4} className="w-full bg-background p-2 rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-primary text-base"/>
            ) : (
                <input type={type} name={name} value={value} onChange={onChange} className="w-full bg-background p-2 rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-primary text-base"/>
            )
        ) : (
            <p className="text-lg">{value}</p>
        )}
    </div>
);


const MotorcycleDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getMotorcycleById, updateMotorcycle } = useData();
    const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
    const [originalMotorcycle, setOriginalMotorcycle] = useState<Motorcycle | null>(null);
    const [isSoldModalOpen, setIsSoldModalOpen] = useState(false);
    const [isUnsoldModalOpen, setIsUnsoldModalOpen] = useState(false);
    const [sellingPrice, setSellingPrice] = useState(0);
    const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (id) {
            const data = getMotorcycleById(id);
            if (data) {
                setMotorcycle(data);
                setOriginalMotorcycle(data);
                setSellingPrice(data.askingPrice);
            }
        }
    }, [id, getMotorcycleById]);

    const handleSaveChanges = () => {
        if (motorcycle) {
            updateMotorcycle(motorcycle);
            setOriginalMotorcycle(motorcycle);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!motorcycle) return;
        const { name, value, type } = e.target;
        setMotorcycle(prev => ({
            ...prev!,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };
    
    const handleAddExpense = (description: string, cost: number) => {
        if (!motorcycle || !description || cost <= 0) return;
        const newExpense: Expense = { id: crypto.randomUUID(), description, cost };
        setMotorcycle(prev => ({ ...prev!, expenses: [...prev!.expenses, newExpense] }));
    };
    
    const handleRemoveExpense = (expenseId: string) => {
         if (!motorcycle) return;
         setMotorcycle(prev => ({ ...prev!, expenses: prev!.expenses.filter(e => e.id !== expenseId)}));
    };

    const handleAddPromotion = (description: string, cost: number) => {
        if (!motorcycle || !description || cost <= 0) return;
        const newPromotion: Promotion = { id: crypto.randomUUID(), description, cost };
        setMotorcycle(prev => ({ ...prev!, promotions: [...prev!.promotions, newPromotion] }));
    };

    const handleRemovePromotion = (promoId: string) => {
         if (!motorcycle) return;
         setMotorcycle(prev => ({ ...prev!, promotions: prev!.promotions.filter(p => p.id !== promoId)}));
    };
    
    const handleMarkAsSold = () => {
        if (!motorcycle) return;
        // First save any pending changes
        if (isDirty) {
            handleSaveChanges();
        }
        const soldMotorcycle: Motorcycle = {
            ...motorcycle,
            status: 'Sold',
            sellingPrice,
            saleDate: new Date(saleDate).toISOString()
        };
        updateMotorcycle(soldMotorcycle);
        navigate('/sales');
    };

    const handleMarkAsUnsold = () => {
        if (!motorcycle) return;
        if (isDirty) {
            handleSaveChanges();
        }
        const unsoldMotorcycle: Motorcycle = {
            ...motorcycle,
            status: 'For Sale',
            sellingPrice: null,
            saleDate: null,
        };
        updateMotorcycle(unsoldMotorcycle);
        navigate('/inventory');
    };

    const handlePhotoAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && motorcycle) {
            const file = e.target.files[0];
            const base64 = await fileToBase64(file);
            setMotorcycle(prev => ({...prev!, photos: [...prev!.photos, base64]}));
        }
    }

    const handlePhotoDelete = (index: number) => {
        if(motorcycle) {
            setMotorcycle(prev => ({...prev!, photos: prev!.photos.filter((_, i) => i !== index)}));
        }
    }

    if (!motorcycle) {
        return <div className="text-center p-8">Motorcycle not found.</div>;
    }

    const isDirty = motorcycle && originalMotorcycle ? JSON.stringify(motorcycle) !== JSON.stringify(originalMotorcycle) : false;
    const totalExpenses = calculateTotalExpenses(motorcycle);
    const totalPromotions = calculateTotalPromotions(motorcycle);
    const finalCost = calculateFinalCost(motorcycle);
    const profit = calculateProfit(motorcycle);

    return (
        <div className="min-h-screen bg-background pb-40">
            <header className="bg-surface sticky top-0 z-20 p-4 shadow-md flex items-center">
                <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-gray-700">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-text-primary truncate">{motorcycle.year} {motorcycle.model}</h1>
            </header>
            <main className="p-4">
                <DetailSection title="Photo Gallery">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-2">
                        {motorcycle.photos.map((photo, index) => (
                             <div key={index} className="relative group">
                                <img src={photo} alt={`Photo ${index+1}`} className="w-full h-24 object-cover rounded-md"/>
                                <button onClick={() => handlePhotoDelete(index)} className="absolute top-1 right-1 bg-red-600/70 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                             </div>
                        ))}
                    </div>
                    <label className="cursor-pointer w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-600 rounded-lg text-text-secondary hover:bg-gray-700 hover:text-white transition-colors">
                        <CameraIcon className="w-6 h-6"/>
                        Add Photo
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoAdd} />
                    </label>
                </DetailSection>

                <DetailSection title="Vehicle Details">
                    <DetailItem label="Model" value={motorcycle.model} isEditable={true} name="model" onChange={handleChange}/>
                    <DetailItem label="Year" value={motorcycle.year} isEditable={true} name="year" type="number" onChange={handleChange}/>
                    <DetailItem label="License No." value={motorcycle.licenseNo} isEditable={true} name="licenseNo" onChange={handleChange}/>
                    <DetailItem label="Voucher No." value={motorcycle.voucherNo} isEditable={true} name="voucherNo" onChange={handleChange}/>
                    <DetailItem label="Odometer" value={motorcycle.odometer} isEditable={true} name="odometer" type="number" onChange={handleChange}/>
                    <DetailItem label="Notes" value={motorcycle.notes} isEditable={true} name="notes" onChange={handleChange} isTextArea/>
                </DetailSection>

                <ItemManagementSection 
                  title="Expenses" 
                  items={motorcycle.expenses} 
                  onAdd={handleAddExpense} 
                  onRemove={handleRemoveExpense} 
                  total={totalExpenses} 
                  isEditable={true}
                />
                
                <ItemManagementSection 
                  title="Promotions" 
                  items={motorcycle.promotions} 
                  onAdd={handleAddPromotion} 
                  onRemove={handleRemovePromotion} 
                  total={totalPromotions} 
                  isEditable={true}
                />

                <DetailSection title="Financials">
                    <DetailItem label="Purchase Price" value={motorcycle.purchasePrice} isEditable={true} name="purchasePrice" type="number" onChange={handleChange}/>
                    {motorcycle.status === 'For Sale' && <DetailItem label="Asking Price" value={motorcycle.askingPrice} isEditable={true} name="askingPrice" type="number" onChange={handleChange}/>}
                    <DetailItem label="Total Expenses" value={formatCurrency(totalExpenses)}/>
                    <DetailItem label="Total Promotions" value={formatCurrency(totalPromotions)}/>
                    <div className="border-t border-gray-600 my-2"></div>
                    <DetailItem label="Final Cost" value={formatCurrency(finalCost)} />
                    {motorcycle.status === 'Sold' && (
                        <>
                            <DetailItem label="Selling Price" value={motorcycle.sellingPrice!} isEditable={true} name="sellingPrice" type="number" onChange={handleChange}/>
                            <div className={`mt-2 p-2 rounded-md ${profit >= 0 ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                               <p className="text-sm">{profit >=0 ? 'Final Profit' : 'Final Loss'}</p>
                               <p className={`text-2xl font-bold ${profit >=0 ? 'text-accent-green' : 'text-accent-red'}`}>{formatCurrency(profit)}</p>
                            </div>
                        </>
                    )}
                </DetailSection>
            </main>
            
            <div className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-sm border-t border-gray-700 p-4 max-w-2xl mx-auto">
                <div className="space-y-2">
                    {isDirty && (
                        <button 
                            onClick={handleSaveChanges}
                            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-hover transition-colors"
                        >
                            Save Changes
                        </button>
                    )}
                    {motorcycle.status === 'For Sale' && (
                        <button onClick={() => setIsSoldModalOpen(true)} className="w-full bg-accent-green text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors">
                            Mark as Sold
                        </button>
                    )}
                    {motorcycle.status === 'Sold' && (
                        <button onClick={() => setIsUnsoldModalOpen(true)} className="w-full bg-accent-orange text-white font-bold py-3 rounded-lg hover:bg-orange-500 transition-colors">
                            Mark as Unsold (Undo Sale)
                        </button>
                    )}
                </div>
            </div>
            
            {isSoldModalOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-30">
                     <div className="bg-surface p-6 rounded-lg shadow-xl w-full max-w-sm m-4">
                        <h2 className="text-xl font-bold mb-4">Record Sale</h2>
                        <div className="mb-4">
                            <label className="block text-sm text-text-secondary mb-1">Final Selling Price</label>
                            <input type="number" value={sellingPrice} onChange={e => setSellingPrice(parseFloat(e.target.value))} className="w-full bg-background p-2 rounded-md border border-gray-700" />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm text-text-secondary mb-1">Sale Date</label>
                            <input type="date" value={saleDate} onChange={e => setSaleDate(e.target.value)} className="w-full bg-background p-2 rounded-md border border-gray-700" />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setIsSoldModalOpen(false)} className="bg-secondary px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>
                            <button onClick={handleMarkAsSold} className="bg-accent-green px-4 py-2 rounded-md hover:bg-green-600">Confirm Sale</button>
                        </div>
                     </div>
                 </div>
            )}

            {isUnsoldModalOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-30">
                     <div className="bg-surface p-6 rounded-lg shadow-xl w-full max-w-sm m-4">
                        <h2 className="text-xl font-bold mb-4">Undo Sale</h2>
                        <p className="text-text-secondary mb-6">This will move the motorcycle back to inventory. Are you sure?</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setIsUnsoldModalOpen(false)} className="bg-secondary px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>
                            <button onClick={handleMarkAsUnsold} className="bg-accent-orange px-4 py-2 rounded-md hover:bg-orange-500">Confirm</button>
                        </div>
                     </div>
                 </div>
            )}
        </div>
    );
};

const ItemManagementSection: React.FC<{
    title: string;
    items: (Expense | Promotion)[];
    onAdd: (description: string, cost: number) => void;
    onRemove: (id: string) => void;
    total: number;
    isEditable: boolean;
}> = ({ title, items, onAdd, onRemove, total, isEditable }) => {
    const [description, setDescription] = useState('');
    const [cost, setCost] = useState(0);

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(description, cost);
        setDescription('');
        setCost(0);
    }
    
    return (
        <DetailSection title={title}>
            <div className="space-y-2 mb-3">
                {items.length > 0 ? items.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-background/50 p-2 rounded-md">
                        <span>{item.description}</span>
                        <div className="flex items-center gap-3">
                           <span>{formatCurrency(item.cost)}</span>
                           {isEditable && <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-400"><TrashIcon className="w-4 h-4"/></button>}
                        </div>
                    </div>
                )) : <p className="text-sm text-text-secondary">No {title.toLowerCase()} added yet.</p>}
            </div>
            <div className="border-t border-gray-600 pt-2 flex justify-between font-bold">
                <span>Total {title}</span>
                <span>{formatCurrency(total)}</span>
            </div>
            {isEditable && (
                <form onSubmit={handleAddItem} className="mt-4 pt-4 border-t border-gray-600 flex gap-2">
                    <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="flex-grow bg-background p-2 rounded-md border border-gray-700" required/>
                    <input type="number" placeholder="Cost" value={cost || ''} onChange={e => setCost(parseFloat(e.target.value))} className="w-24 bg-background p-2 rounded-md border border-gray-700" required/>
                    <button type="submit" className="bg-primary px-3 py-2 rounded-md text-white hover:bg-primary-hover">+</button>
                </form>
            )}
        </DetailSection>
    )
}

export default MotorcycleDetail;