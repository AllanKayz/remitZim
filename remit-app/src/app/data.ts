// --- Interfaces ---

export interface Transaction {
  id: number;
  recipient: string;
  amount: number;
  currency: string;
  type: 'Cash Pickup' | 'Mobile Wallet' | 'Bank Transfer' | 'Wallet Top-up';
  status: 'Completed' | 'Processing' | 'Failed';
  date: string;
  direction: 'in' | 'out';
}

export interface Beneficiary {
  id: number;
  name: string;
  mobile: string;
  provider: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'alert';
}

export interface PaymentMethod {
  id: number;
  type: 'card' | 'bank';
  name: string;
  details: string; // e.g., "**** 1234"
  expiry?: string;
}

export interface Rates {
  [key: string]: { [key: string]: number };
}

// --- Mock Data ---

export const RATES: Rates = {
  GBP: { USD: 1.27, ZiG: 34.5, ZAR: 23.1 },
  USD: { USD: 1.00, ZiG: 27.3, ZAR: 18.2 },
  ZAR: { USD: 0.055, ZiG: 1.5, ZAR: 1.00 }
};

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: 1, title: 'Transfer Complete', message: 'Your transfer to Tafadzwa Moyo has been collected.', time: '2 mins ago', read: false, type: 'success' },
  { id: 2, title: 'Rate Alert', message: 'USD to ZiG rates have improved by 2%!', time: '1 hour ago', read: false, type: 'info' },
  { id: 3, title: 'Security Alert', message: 'New login detected from Harare, Zimbabwe.', time: '1 day ago', read: true, type: 'alert' },
];

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 1, type: 'card', name: 'Barclays Visa', details: '**** 4242', expiry: '12/26' },
  { id: 2, type: 'bank', name: 'Lloyds Bank', details: 'Sort: 30-**-** Acc: ****1234' },
];

export const FULL_HISTORY: Transaction[] = [
  { id: 1, recipient: "Tafadzwa Moyo", amount: 150.00, currency: "USD", type: "Cash Pickup", status: "Completed", date: "24 Nov 2025", direction: 'out' },
  { id: 2, recipient: "Grace Chiwenga", amount: 2500.00, currency: "ZiG", type: "Mobile Wallet", status: "Processing", date: "25 Nov 2025", direction: 'out' },
  { id: 3, recipient: "Wallet Top-up", amount: 500.00, currency: "GBP", type: "Wallet Top-up", status: "Completed", date: "22 Nov 2025", direction: 'in' },
  { id: 4, recipient: "Kudzanai Dube", amount: 50.00, currency: "USD", type: "Bank Transfer", status: "Completed", date: "20 Nov 2025", direction: 'out' },
  { id: 5, recipient: "Blessing Mahere", amount: 1200.00, currency: "ZAR", type: "Mobile Wallet", status: "Failed", date: "15 Nov 2025", direction: 'out' },
  { id: 6, recipient: "Wallet Top-up", amount: 200.00, currency: "GBP", type: "Wallet Top-up", status: "Completed", date: "10 Nov 2025", direction: 'in' },
];

export const BENEFICIARIES: Beneficiary[] = [
  { id: 1, name: "Tafadzwa Moyo", mobile: "+263 77 123 4567", provider: "EcoCash" },
  { id: 2, name: "Grace Chiwenga", mobile: "+263 71 987 6543", provider: "NetOne" },
  { id: 3, name: "Kudzanai Dube", mobile: "+263 77 555 9999", provider: "CABS" },
];
