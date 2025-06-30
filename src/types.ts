
import { ReactNode } from 'react';

export interface IStatsCardItem {
  title: string;
  value: string | number;
  icon: ReactNode;
  change: number;
  bgColor: string;
  borderColor?: string;
}

export interface IStatsData {
  newOrdersToday: number;
  revenueToday: number;
  visitors: number;
  lowStockItems: any[];
  recentOrders: any[];
}

