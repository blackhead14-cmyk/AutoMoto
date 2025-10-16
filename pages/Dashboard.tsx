
import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import PageWrapper from '../components/PageWrapper';
import { calculateTotalInvestment, formatCurrency, calculateFinalCost } from '../utils/helpers';
import { Motorcycle } from '../types';

const StatCard: React.FC<{ title: string; value: string; colorClass?: string }> = ({ title, value, colorClass = 'text-accent-green' }) => (
  <div className="bg-surface p-4 rounded-lg shadow-md text-center">
    <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
    <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
  </div>
);

const RecentActivityItem: React.FC<{ motorcycle: Motorcycle; action: 'Added' | 'Sold' }> = ({ motorcycle, action }) => {
    const date = action === 'Sold' ? new Date(motorcycle.saleDate!).toLocaleDateString() : new Date(motorcycle.purchaseDate).toLocaleDateString();
    return (
        <div className="bg-surface/50 p-3 rounded-md flex justify-between items-center">
            <div>
                <p className="font-semibold">{action} {motorcycle.year} {motorcycle.model}</p>
                <p className="text-xs text-text-secondary">{date}</p>
            </div>
            <p className={`font-bold ${action === 'Sold' ? 'text-accent-green' : 'text-accent-orange'}`}>
                {action === 'Sold' ? 'SALE' : 'NEW'}
            </p>
        </div>
    );
};

const Dashboard: React.FC = () => {
  const { forSaleMotorcycles, motorcycles } = useData();

  const totalInventoryValue = forSaleMotorcycles.reduce((sum, m) => sum + m.purchasePrice, 0);
  const totalInvestment = forSaleMotorcycles.reduce((sum, m) => sum + calculateTotalInvestment(m), 0);
  const potentialProfit = forSaleMotorcycles.reduce((sum, m) => {
    const profit = m.askingPrice - calculateFinalCost(m);
    return sum + profit;
  }, 0);
  
  const recentActivities = [...motorcycles]
    .sort((a, b) => {
        const dateA = new Date(a.saleDate || a.purchaseDate).getTime();
        const dateB = new Date(b.saleDate || b.purchaseDate).getTime();
        return dateB - dateA;
    })
    .slice(0, 10);

  return (
    <PageWrapper title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Inventory Value" value={formatCurrency(totalInventoryValue)} colorClass="text-accent-orange" />
        <StatCard title="Total Investment" value={formatCurrency(totalInvestment)} colorClass="text-accent-red" />
        <StatCard title="Potential Profit" value={formatCurrency(potentialProfit)} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link to="/inventory/add" className="bg-primary text-white text-center font-bold py-3 rounded-lg shadow-md hover:bg-primary-hover transition-colors">
          Add New Motorcycle
        </Link>
        <Link to="/inventory" className="bg-secondary text-white text-center font-bold py-3 rounded-lg shadow-md hover:bg-gray-600 transition-colors">
          View Inventory
        </Link>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3">
            {recentActivities.length > 0 ? (
                recentActivities.map(m => (
                    <RecentActivityItem key={m.id} motorcycle={m} action={m.status === 'Sold' ? 'Sold' : 'Added'} />
                ))
            ) : (
                <p className="text-text-secondary text-center">No recent activity.</p>
            )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
