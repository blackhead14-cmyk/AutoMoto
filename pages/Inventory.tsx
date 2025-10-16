
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import PageWrapper from '../components/PageWrapper';
import { Motorcycle } from '../types';
import { formatCurrency, timeInInventory } from '../utils/helpers';
import { PlusIcon } from '../components/Icons';

const MotorcycleCard: React.FC<{ motorcycle: Motorcycle }> = ({ motorcycle }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="bg-surface rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200"
      onClick={() => navigate(`/inventory/${motorcycle.id}`)}
    >
      <img 
        src={motorcycle.photos[0] || `https://picsum.photos/seed/${motorcycle.id}/400/250`} 
        alt={`${motorcycle.year} ${motorcycle.model}`} 
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold truncate">{motorcycle.year} {motorcycle.model}</h3>
        <p className="text-sm text-text-secondary">License: {motorcycle.licenseNo}</p>
        <p className="text-sm text-text-secondary">Voucher: {motorcycle.voucherNo}</p>
        <div className="flex justify-between items-center mt-3">
            <span className="text-accent-green font-semibold">{formatCurrency(motorcycle.purchasePrice)}</span>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">{timeInInventory(motorcycle)} days</span>
        </div>
      </div>
    </div>
  );
};

const Inventory: React.FC = () => {
  const { forSaleMotorcycles } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('purchaseDate');

  const filteredAndSortedMotorcycles = useMemo(() => {
    let filtered = forSaleMotorcycles.filter(
      m =>
        m.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.licenseNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'purchaseDate':
          return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
        case 'buyPrice':
          return b.purchasePrice - a.purchasePrice;
        case 'voucherNo':
          return a.voucherNo.localeCompare(b.voucherNo);
        default:
          return 0;
      }
    });
  }, [forSaleMotorcycles, searchTerm, sortBy]);

  return (
    <PageWrapper title="Inventory (For Sale)">
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by model or license..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-surface p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="w-full sm:w-48 bg-surface p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="purchaseDate">Purchase Date</option>
          <option value="buyPrice">Buy Price</option>
          <option value="voucherNo">Voucher No.</option>
        </select>
      </div>

      {filteredAndSortedMotorcycles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedMotorcycles.map(m => (
              <MotorcycleCard key={m.id} motorcycle={m} />
            ))}
          </div>
      ) : (
        <div className="text-center py-10">
            <p className="text-text-secondary">No motorcycles in inventory.</p>
            <Link to="/inventory/add" className="mt-4 inline-block bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors">
                Add your first motorcycle
            </Link>
        </div>
      )}

      <Link
        to="/inventory/add"
        className="fixed bottom-24 right-4 bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-hover transition-all transform hover:rotate-90"
      >
        <PlusIcon className="w-8 h-8" />
      </Link>
    </PageWrapper>
  );
};

export default Inventory;
