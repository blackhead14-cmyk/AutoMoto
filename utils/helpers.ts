
import { Motorcycle } from "../types";

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const calculateTotalExpenses = (motorcycle: Motorcycle): number => {
    return motorcycle.expenses.reduce((acc, expense) => acc + expense.cost, 0);
};

export const calculateTotalPromotions = (motorcycle: Motorcycle): number => {
    return motorcycle.promotions.reduce((acc, promo) => acc + promo.cost, 0);
};

export const calculateTotalInvestment = (motorcycle: Motorcycle): number => {
  return motorcycle.purchasePrice + calculateTotalExpenses(motorcycle);
};

export const calculateFinalCost = (motorcycle: Motorcycle): number => {
    return calculateTotalInvestment(motorcycle) - calculateTotalPromotions(motorcycle);
}

export const calculateProfit = (motorcycle: Motorcycle): number => {
    if (motorcycle.status !== 'Sold' || motorcycle.sellingPrice === null) return 0;
    return motorcycle.sellingPrice - calculateFinalCost(motorcycle);
}

export const timeInInventory = (motorcycle: Motorcycle): number => {
    const startDate = new Date(motorcycle.purchaseDate);
    const endDate = motorcycle.saleDate ? new Date(motorcycle.saleDate) : new Date();
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
};
