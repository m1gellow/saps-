type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Product = {
  id: number;
  name: string;
  brand: string;
  price: string;
  priceValue: number;
  image: string;
  favoriteIcon?: string; // можно удалить это поле позже
  category: string;
  inStock: boolean;
  description?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type BrandFilter = {
  name: string;
  checked: boolean;
};

export type FilterState = {
  brands: BrandFilter[];
  priceRange: [number, number];
  categories: string[];
  showFilters: boolean;
  activeCategory: string;
};

export type PriceRange = [number, number];

type OrderStatus = 
  | 'Ожидает оплаты'
  | 'Оплачен'
  | 'Доставляется'
  | 'Завершен'
  | 'Отменен';

type PaymentMethod = 
  | 'Карта' 
  | 'СБП' 
  | 'Наличными при получении'
  | 'Ожидает оплаты'
  | 'Отменен';

type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  status: OrderStatus;
  amount: number;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  address: string;
  notes?: string;
};

type AdminRole = 'admin' | 'manager';

type AdminUser = {
  id: string;
  username: string;
  name: string;
  role: AdminRole;
  last_login?: string;
};

type ContentType = 'slider' | 'text' | 'contact';

type ContentItem = {
  id: number;
  type: ContentType;
  title: string;
  description?: string;
  content_json?: any;
  page: string;
  last_updated: string;
};

type SliderItem = {
  id: number;
  url: string;
  title: string;
  priority: number;
};

type ContactInfo = {
  address: string;
  phone: string;
  email: string;
  workHours: string;
};