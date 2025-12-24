
export interface User {
  id: string;
  name: string;
  email: string;
  joinedAt: number;
  balance: number; // Current earnings available for withdrawal
  role?: 'admin' | 'reseller';
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  timestamp: number;
  read: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  video?: string; // Optional Base64 video data
  category: string;
  createdAt: number;
  sellerId?: string;
  sellerName?: string;
  source?: 'local' | 'external';
  externalId?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharges: number;
  total: number;
  customerMobile: string;
  customerAddress: string;
  customerCity: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
  createdAt: number;
  sellerId?: string; // To track which seller needs to fulfill
}

export enum ViewMode {
  STOREFRONT = 'STOREFRONT',
  ADMIN = 'ADMIN',
  AUTH = 'AUTH'
}

export type Category = 'Electronics' | 'Home' | 'Fashion' | 'Other';

export interface WithdrawalRequest {
  id: string;
  amount: number;
  method: 'Easypaisa' | 'JazzCash';
  accountNumber: string;
  status: 'Pending' | 'Completed';
  createdAt: number;
}
