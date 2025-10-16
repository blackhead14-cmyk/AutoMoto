
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import PageWrapper from '../components/PageWrapper';
import { Motorcycle } from '../types';
import { formatCurrency, calculateProfit } from '../utils/helpers';

const SoldMotorcycleCard: React.FC<{ motorcycle: Motorcycle }> = ({ motorcycle }) => {
  const navigate = useNavigate();
  const profit = calculateProfit(motorcycle);
  const profitColor = profit >= 0 ? 'text-accent-green' : 'text-accent-red';

  return (
    <div 
      className="bg-surface rounded-lg shadow-md p-4 flex justify-between items-center cursor-pointer transform hover:bg-gray-700/50 transition-colors"
      onClick={() => navigate(`/sales/${motorcycle.id}`)}
    >
      <div>
        <h3 className="text-lg font-bold">{motorcycle.year} {motorcycle.model}</h3>
        <p className="text-sm text-text-secondary">License: {motorcycle.licenseNo} | Voucher: {motorcycle.voucherNo}</p>
        <p className="text-xs text-text-secondary">Sold on: {new Date(motorcycle.saleDate!).toLocaleDateString()}</p>
      </div>
      <div className="text-right">
        <p className={`text-xl font-bold ${profitColor}`}>{formatCurrency(profit)}</p>
        <p className="text-xs text-text-secondary">{profit >= 0 ? 'Profit' : 'Loss'}</p>
      </div>
    </div>
  );
};


const SalesHistory: React.FC = () => {
  const { soldMotorcycles } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('saleDate');

  const filteredAndSortedMotorcycles = useMemo(() => {
    let filtered = soldMotorcycles.filter(
      m =>
        m.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.licenseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(m.year).includes(searchTerm)
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'saleDate':
          return new Date(b.saleDate!).getTime() - new Date(a.saleDate!).getTime();
        case 'profitMargin':
          return calculateProfit(b) - calculateProfit(a);
        case 'model':
          return a.model.localeCompare(b.model);
        default:
          return 0;
      }
    });
  }, [soldMotorcycles, searchTerm, sortBy]);

  return (
    <PageWrapper title="Sales History">
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search sales..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-surface p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="w-full sm:w-48 bg-surface p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="saleDate">Sale Date</option>
          <option value="profitMargin">Profit Margin</option>
          <option value="model">Model</option>
        </select>
      </div>

      {filteredAndSortedMotorcycles.length > 0 ? (
          <div className="space-y-4">
            {filteredAndSortedMotorcycles.map(m => (
              <SoldMotorcycleCard key={m.id} motorcycle={m} />
            ))}
          </div>
      ) : (
          <p className="text-center text-text-secondary py-10">No sales recorded yet.</p>
      )}
    </PageWrapper>
  );
};

export default SalesHistory;
