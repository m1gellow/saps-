import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Users,
  TrendingUp,
  CreditCard,
  AlertCircle,
  Package,
  ArrowUp,
  ArrowDown,
  Loader2,
} from 'lucide-react';
import { getAdminDashboardStats } from '../../lib/api/admin';

export const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    newOrdersToday: 0,
    revenueToday: 0,
    visitors: 3456, // В реальном приложении это можно получать из аналитики
    lowStockItems: [] as any[],
    recentOrders: [] as any[],
  });

  // Загрузка статистики при монтировании компонента
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getAdminDashboardStats();

        if (result.error) {
          throw result.error;
        }

        setStats({
          newOrdersToday: result.newOrdersToday,
          revenueToday: result.revenueToday,
          visitors: 3456, // Заглушка
          lowStockItems: result.lowStockItems || [],
          recentOrders: result.recentOrders || [],
        });
      } catch (err) {
        console.error('Ошибка при загрузке статистики:', err);
        setError('Не удалось загрузить статистику. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Данные статистики для отображения
  const statsCards = [
    {
      title: 'Новые заказы',
      value: stats.newOrdersToday.toString(),
      icon: <ShoppingBag size={24} color='white'/>,
      change: '+17%',
      isUp: true,
    },
    {
      title: 'Выручка сегодня',
      value: `${stats.revenueToday.toLocaleString()} ₽`,
      icon: <CreditCard size={24} color='black'/>,
      change: '+24%',
      isUp: true,
    },
    {
      title: 'Посетители',
      value: stats.visitors.toString(),
      icon: <Users size={24} color='white'/>,
      change: '-12%',
      isUp: false,
    },
    {
      title: 'Товаров на складе',
      value: (stats.lowStockItems.length > 0 ? 234 - stats.lowStockItems.length : 234).toString(),
      icon: <Package size={24} color='black'/>,
      change: '+4%',
      isUp: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-blue animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Панель управления</h1>

      {/* Статистические карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${index % 2 === 0 ? 'bg-blue bg-opacity-10' : 'bg-gray-100'}`}>
                <div className={index % 2 === 0 ? 'text-blue' : 'text-gray-700'}>{stat.icon}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className={`p-1 rounded-full ${stat.isUp ? 'bg-green-100' : 'bg-red-100'} mr-2`}>
                {stat.isUp ? (
                  <ArrowUp size={14} className="text-green-600" />
                ) : (
                  <ArrowDown size={14} className="text-red-600" />
                )}
              </div>
              <p className={`text-sm ${stat.isUp ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} по сравнению с прошлой неделей
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Последние заказы */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100 lg:col-span-2"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Последние заказы</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Номер заказа</th>
                  <th className="px-6 py-3 text-left">Клиент</th>
                  <th className="px-6 py-3 text-left">Дата</th>
                  <th className="px-6 py-3 text-left">Статус</th>
                  <th className="px-6 py-3 text-right">Сумма</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium
                          ${order.status === 'Оплачен' ? 'bg-green-100 text-green-800' : ''}
                          ${order.status === 'Ожидает оплаты' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${order.status === 'Доставляется' ? 'bg-blue-100 text-blue-800' : ''}
                          ${order.status === 'Завершен' ? 'bg-gray-100 text-gray-800' : ''}
                          ${order.status === 'Отменен' ? 'bg-red-100 text-red-800' : ''}
                        `}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{order.amount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Нет заказов для отображения
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 text-center">
            <button className="text-sm text-blue hover:text-blue-600 font-medium">Посмотреть все заказы</button>
          </div>
        </motion.div>

        {/* Товары с низким запасом */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Заканчивающиеся товары</h2>
          </div>
          <div className="p-6 space-y-6">
            {stats.lowStockItems.length > 0 ? (
              stats.lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <div className="flex items-center">
                      <AlertCircle size={16} className="text-amber-500 mr-1" />
                      <p className="text-xs text-amber-600">Товар закончился</p>
                    </div>
                  </div>
                  <button className="text-xs bg-blue text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors">
                    Пополнить
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">Все товары в достаточном количестве</div>
            )}
          </div>
          <div className="p-4 border-t border-gray-100 text-center">
            <button className="text-sm text-blue hover:text-blue-600 font-medium">Управление складом</button>
          </div>
        </motion.div>
      </div>

      {/* Графики и аналитика */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 pt-0"
      >
        <div className="flex justify-between items-center border-b border-gray-100 py-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Аналитика продаж</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-blue text-white rounded-md">За неделю</button>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">
              За месяц
            </button>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">За год</button>
          </div>
        </div>

        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="text-center text-gray-500">
            <TrendingUp className="h-10 w-10 mx-auto mb-3 text-gray-400" />
            <p>Графики аналитики будут доступны в следующем обновлении</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};