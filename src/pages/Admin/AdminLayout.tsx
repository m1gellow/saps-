import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { useAdmin } from '../../lib/context/AdminContext';
import { Link, Outlet, useLocation } from 'react-router-dom';

export const AdminLayout = () => {
  const { adminUser, adminLogout } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, title: 'Дашборд', path: '/admin' },
    { icon: <Package size={20} />, title: 'Товары', path: '/admin/products' },
    { icon: <ShoppingCart size={20} />, title: 'Заказы', path: '/admin/orders' },
    { icon: <FileText size={20} />, title: 'Контент', path: '/admin/content' },
    { icon: <Users size={20} />, title: 'Пользователи', path: '/admin/users' },
    { icon: <Settings size={20} />, title: 'Настройки', path: '/admin/settings' },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/admin';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Сайдбар - десктопная версия */}
      <motion.aside
        className={`hidden md:flex flex-col bg-white border-r border-gray-200 shadow-sm`}
        initial={{ width: sidebarOpen ? 250 : 80 }}
        animate={{ width: sidebarOpen ? 250 : 80 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <motion.div
            initial={{ opacity: sidebarOpen ? 1 : 0 }}
            animate={{ opacity: sidebarOpen ? 1 : 0 }}
            className={`${sidebarOpen ? 'block' : 'hidden'} font-bold text-lg text-blue-4`}
          >
            Волны&Горы Админ
          </motion.div>
          <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-gray-200">
            <ChevronDown
              size={20}
              className={`transform transition-transform ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`}
            />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-3">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive(item.path) ? 'bg-blue-4 bg-opacity-10 text-blue-4' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className={`${isActive(item.path) ? 'text-blue-4' : 'text-gray-500'}`}>{item.icon}</span>
                  <motion.span
                    initial={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0 }}
                    animate={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0 }}
                    className={`ml-3 ${sidebarOpen ? 'block' : 'hidden'}`}
                  >
                    {item.title}
                  </motion.span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={adminLogout}
            className="flex items-center w-full px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
          >
            <LogOut size={20} className="text-gray-500" />
            <motion.span
              initial={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0 }}
              animate={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0 }}
              className={`ml-3 ${sidebarOpen ? 'block' : 'hidden'}`}
            >
              Выйти
            </motion.span>
          </button>
        </div>
      </motion.aside>

      {/* Мобильная версия меню */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="font-bold text-lg text-blue-4">Волны&Горы Админ</div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1 rounded-full hover:bg-gray-200">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-20 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              className="absolute top-14 left-0 h-full w-2/3 bg-white shadow-lg"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-2 px-3">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                          isActive(item.path)
                            ? 'bg-blue-4 bg-opacity-10 text-blue-4'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className={`${isActive(item.path) ? 'text-blue-4' : 'text-gray-500'}`}>{item.icon}</span>
                        <span className="ml-3">{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="px-3 py-2 text-sm text-gray-500">
                  Вы вошли как <span className="font-semibold">{adminUser?.name}</span>
                </div>
                <button
                  onClick={adminLogout}
                  className="flex items-center w-full px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <LogOut size={20} className="text-gray-500" />
                  <span className="ml-3">Выйти</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Основное содержимое */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Верхняя панель */}
        <header className="bg-white shadow-sm border-b border-gray-200 py-4 px-6 hidden md:block">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              {menuItems.find((item) => isActive(item.path))?.title || 'Панель управления'}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Привет, <span className="font-semibold">{adminUser?.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Основной контент */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6 md:p-8 mt-14 md:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
