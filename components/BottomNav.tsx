
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, MotorcycleIcon, SoldIcon, ReportIcon } from './Icons';

const navItems = [
  { path: '/', label: 'Dashboard', icon: HomeIcon },
  { path: '/inventory', label: 'Inventory', icon: MotorcycleIcon },
  { path: '/sales', label: 'Sales', icon: SoldIcon },
  { path: '/reports', label: 'Reports', icon: ReportIcon },
];

const BottomNav: React.FC = () => {
  const activeLink = 'text-primary';
  const inactiveLink = 'text-text-secondary hover:text-text-primary';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-700 shadow-lg">
      <div className="flex justify-around max-w-2xl mx-auto">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-full py-2 px-1 text-xs transition-colors duration-200 ${isActive ? activeLink : inactiveLink}`
            }
          >
            <Icon className="w-6 h-6 mb-1" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
