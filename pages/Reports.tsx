
import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import PageWrapper from '../components/PageWrapper';
import { formatCurrency, calculateFinalCost, calculateProfit, timeInInventory } from '../utils/helpers';

const MetricCard: React.FC<{ label: string, value: string | number }> = ({ label, value }) => (
    <div className="bg-surface p-4 rounded-lg shadow-md">
        <p className="text-text-secondary text-sm">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
    </div>
);

const Reports: React.FC = () => {
  const { soldMotorcycles } = useData();
  const [dateRange, setDateRange] = useState('allTime');

  const filteredSales = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    
    return soldMotorcycles.filter(sale => {
      if (dateRange === 'allTime') return true;
      const saleDate = new Date(sale.saleDate!);
      if (dateRange === 'thisMonth') return saleDate >= startOfMonth;
      if (dateRange === 'thisYear') return saleDate >= startOfYear;
      return true;
    });
  }, [soldMotorcycles, dateRange]);

  const totalSalesRevenue = filteredSales.reduce((acc, sale) => acc + (sale.sellingPrice || 0), 0);
  const totalCostOfGoodsSold = filteredSales.reduce((acc, sale) => acc + calculateFinalCost(sale), 0);
  const totalProfit = totalSalesRevenue - totalCostOfGoodsSold;
  const averageProfit = filteredSales.length > 0 ? totalProfit / filteredSales.length : 0;
  const averageTime = filteredSales.length > 0 ? filteredSales.reduce((acc, sale) => acc + timeInInventory(sale), 0) / filteredSales.length : 0;

  const topPerformers = [...filteredSales].sort((a, b) => calculateProfit(b) - calculateProfit(a)).slice(0, 3);
  
  const profitByMake = useMemo(() => {
    const makes: { [key: string]: number } = {};
    filteredSales.forEach(sale => {
        const make = sale.model.split(' ')[0];
        const profit = calculateProfit(sale);
        if (makes[make]) {
            makes[make] += profit;
        } else {
            makes[make] = profit;
        }
    });
    return Object.entries(makes).sort((a,b) => b[1] - a[1]);
  }, [filteredSales]);

  return (
    <PageWrapper title="Reports">
      <div className="mb-6">
        <select
          value={dateRange}
          onChange={e => setDateRange(e.target.value)}
          className="w-full bg-surface p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="allTime">All Time</option>
          <option value="thisMonth">This Month</option>
          <option value="thisYear">This Year</option>
        </select>
      </div>
      
      {filteredSales.length > 0 ? (
      <>
        <div className="grid grid-cols-2 gap-4 mb-6">
            <MetricCard label="Total Sales Revenue" value={formatCurrency(totalSalesRevenue)} />
            <MetricCard label="Total Cost of Goods" value={formatCurrency(totalCostOfGoodsSold)} />
            <MetricCard label="Total Profit" value={formatCurrency(totalProfit)} />
            <MetricCard label="Avg Profit / Bike" value={formatCurrency(averageProfit)} />
            <MetricCard label="Avg Days in Inventory" value={`${averageTime.toFixed(1)} days`} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-3">Top 3 Most Profitable Sales</h3>
            <ul className="space-y-2">
                {topPerformers.map(sale => (
                    <li key={sale.id} className="flex justify-between text-sm">
                        <span>{sale.year} {sale.model}</span>
                        <span className="font-semibold text-accent-green">{formatCurrency(calculateProfit(sale))}</span>
                    </li>
                ))}
            </ul>
          </div>

          <div className="bg-surface p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-3">Profit by Make</h3>
             <ul className="space-y-2">
                {profitByMake.map(([make, profit]) => (
                    <li key={make} className="flex justify-between text-sm">
                        <span>{make}</span>
                        <span className="font-semibold text-accent-green">{formatCurrency(profit)}</span>
                    </li>
                ))}
            </ul>
          </div>
        </div>
      </>
      ) : (
          <p className="text-center text-text-secondary py-10">No sales data for the selected period.</p>
      )}

    </PageWrapper>
  );
};

export default Reports;
