import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LineItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

export interface SellerDetails {
  companyName: string;
  logoUrl: string;
  address: string;
  email: string;
  phone: string;
  taxId: string;
}

export interface ClientDetails {
  clientName: string;
  companyName: string;
  address: string;
  email: string;
}

export interface InvoiceDetails {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  notes: string;
  paymentTerms: string;
  discountRate: number;
  paidAmount: number;
}

export interface InvoiceTheme {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

interface InvoiceState {
  seller: SellerDetails;
  client: ClientDetails;
  details: InvoiceDetails;
  items: LineItem[];
  theme: InvoiceTheme;
  
  // Actions
  updateSeller: (data: Partial<SellerDetails>) => void;
  updateClient: (data: Partial<ClientDetails>) => void;
  updateDetails: (data: Partial<InvoiceDetails>) => void;
  updateTheme: (data: Partial<InvoiceTheme>) => void;
  addItem: () => void;
  updateItem: (id: string, data: Partial<LineItem>) => void;
  removeItem: (id: string) => void;
  resetInvoice: () => void;
}

const initialSeller: SellerDetails = {
  companyName: '',
  logoUrl: '',
  address: '',
  email: '',
  phone: '',
  taxId: '',
};

const initialClient: ClientDetails = {
  clientName: '',
  companyName: '',
  address: '',
  email: '',
};

const initialDetails: InvoiceDetails = {
  invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +14 days
  currency: 'USD',
  notes: '',
  paymentTerms: '',
  discountRate: 0,
  paidAmount: 0,
};

const initialTheme: InvoiceTheme = {
  backgroundColor: '#ffffff',
  textColor: '#0f172a',
  accentColor: '#4f46e5', // indigo-600
};

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set) => ({
      seller: initialSeller,
      client: initialClient,
      details: initialDetails,
      theme: initialTheme,
      items: [
        {
          id: crypto.randomUUID(),
          name: '',
          description: '',
          quantity: 1,
          unitPrice: 0,
          taxRate: 0,
        },
      ],

      updateSeller: (data) =>
        set((state) => ({ seller: { ...state.seller, ...data } })),
      updateClient: (data) =>
        set((state) => ({ client: { ...state.client, ...data } })),
      updateDetails: (data) =>
        set((state) => ({ details: { ...state.details, ...data } })),
      updateTheme: (data) =>
        set((state) => ({ theme: { ...state.theme, ...data } })),
      addItem: () =>
        set((state) => ({
          items: [
            ...state.items,
            {
              id: crypto.randomUUID(),
              name: '',
              description: '',
              quantity: 1,
              unitPrice: 0,
              taxRate: 0,
            },
          ],
        })),
      updateItem: (id, data) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...data } : item
          ),
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      resetInvoice: () =>
        set({
          seller: initialSeller,
          client: initialClient,
          theme: initialTheme,
          details: {
            ...initialDetails,
            invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
          },
          items: [
            {
              id: crypto.randomUUID(),
              name: '',
              description: '',
              quantity: 1,
              unitPrice: 0,
              taxRate: 0,
            },
          ],
        }),
    }),
    {
      name: 'smart-invoice-storage',
    }
  )
);
