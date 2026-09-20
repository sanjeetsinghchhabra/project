export type Language = 'en' | 'hi';

export type ScreenTab = 'dashboard' | 'cash-flow' | 'udhaar-ledger' | 'simulation' | 'ai-copilot';

export interface CustomerUdhaar {
  id: string;
  name: string;
  phone: string;
  amount: number;
  daysOverdue: number;
  itemsSummary: string;
  impactLevel: 'high' | 'medium' | 'low';
  likelihoodToPay: number; // 0-100%
  lastActive: string;
  ledgerHistory: Array<{
    id: string;
    date: string;
    description: string;
    type: 'debit' | 'credit'; // debit = took goods (owed), credit = paid
    amount: number;
  }>;
}

export interface PayableBill {
  id: string;
  vendor: string;
  category: string;
  amount: number;
  dueDate: string;
  status: 'due_tomorrow' | 'due_soon' | 'critical' | 'paid';
  description: string;
}

export interface InventoryAlert {
  id: string;
  itemName: string;
  stockLeft: number;
  daysLeft: number;
  unit: string;
  reorderUnit: string;
  estimatedCost: number;
  status: 'critical' | 'warning';
}

export interface TransactionActivity {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  amount: number;
  type: 'sale' | 'expense' | 'udhaar_in' | 'udhaar_out';
  category?: string;
}

export interface CashForecastDay {
  dayName: string;
  date: string;
  projectedBalance: number;
  inflow: number;
  outflow: number;
  isDip?: boolean;
  notes?: string;
}

export interface StoreProfile {
  id: string;
  name: string;
  ownerName: string;
  location: string;
  phone: string;
  minSafeReserve: number;
  currentCash: number;
}
