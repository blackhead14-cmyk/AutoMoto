
export interface Expense {
  id: string;
  description: string;
  cost: number;
}

export interface Promotion {
  id: string;
  description: string;
  cost: number;
}

export interface Motorcycle {
  id: string;
  model: string;
  year: number;
  licenseNo: string;
  voucherNo: string;
  purchasePrice: number;
  askingPrice: number;
  odometer: number;
  notes: string;
  photos: string[]; // base64 encoded images
  expenses: Expense[];
  promotions: Promotion[];
  purchaseDate: string; // ISO date string
  status: 'For Sale' | 'Sold';
  saleDate: string | null;
  sellingPrice: number | null;
}
