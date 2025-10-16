
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import SalesHistory from './pages/SalesHistory';
import Reports from './pages/Reports';
import AddMotorcycle from './pages/AddMotorcycle';
import MotorcycleDetail from './pages/MotorcycleDetail';

const App: React.FC = () => {
  return (
    <DataProvider>
      <HashRouter>
        <div className="max-w-2xl mx-auto bg-background">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/inventory/add" element={<AddMotorcycle />} />
              <Route path="/inventory/:id" element={<MotorcycleDetail />} />
              <Route path="/sales" element={<SalesHistory />} />
              <Route path="/sales/:id" element={<MotorcycleDetail />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
            
            {/* Conditional rendering for BottomNav can be improved if needed */}
            <Routes>
                 <Route path="/" element={<BottomNav />} />
                 <Route path="/inventory" element={<BottomNav />} />
                 <Route path="/sales" element={<BottomNav />} />
                 <Route path="/reports" element={<BottomNav />} />
            </Routes>
        </div>
      </HashRouter>
    </DataProvider>
  );
};

export default App;
