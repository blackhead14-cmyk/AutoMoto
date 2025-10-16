import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Motorcycle } from '../types';
import { ChevronLeftIcon } from '../components/Icons';

const InputField: React.FC<{
  label: string;
  id: keyof Motorcycle | string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  required?: boolean;
}> = ({ label, id, value, onChange, type = 'text', required = false }) => (
  <div>
    <label htmlFor={id as string} className="block text-sm font-medium text-text-secondary mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id as string}
      name={id as string}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full bg-surface p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>
);

const AddMotorcycle: React.FC = () => {
  const navigate = useNavigate();
  const { addMotorcycle } = useData();
  const [formData, setFormData] = useState({
    model: '',
    year: new Date().getFullYear(),
    licenseNo: '',
    voucherNo: '',
    purchasePrice: 0,
    askingPrice: 0,
    odometer: 0,
    notes: '',
    photos: [],
    expenses: [],
    promotions: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMotorcycle(formData);
    navigate('/inventory');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-surface sticky top-0 z-10 p-4 shadow-md flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-gray-700">
            <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-text-primary">Add New Motorcycle</h1>
      </header>
      <main className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Model" id="model" value={formData.model} onChange={handleChange} required />
          <InputField label="Year" id="year" type="number" value={formData.year} onChange={handleChange} required />
          <InputField label="License No." id="licenseNo" value={formData.licenseNo} onChange={handleChange} required />
          <InputField label="Voucher No." id="voucherNo" value={formData.voucherNo} onChange={handleChange} required />
          <InputField label="Purchase Price" id="purchasePrice" type="number" value={formData.purchasePrice} onChange={handleChange} required />
          <InputField label="Asking Price" id="askingPrice" type="number" value={formData.askingPrice} onChange={handleChange} required />
          <InputField label="Odometer Reading" id="odometer" type="number" value={formData.odometer} onChange={handleChange} />
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-text-secondary mb-1">Notes</label>
            <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full bg-surface p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>
          <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover transition-colors">
            Save Motorcycle
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddMotorcycle;