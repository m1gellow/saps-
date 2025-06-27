import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../lib/context/CartContext';
import { Button } from '../components/ui/button';
import { CartItem } from '../components/Cart/CartItem';
import { Trash2Icon, ShoppingCartIcon, ArrowLeftIcon, TruckIcon, ShieldCheckIcon, GiftIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CartPage: React.FC = () => {
  const { cartItems, totalItems, totalPrice, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100"
        >
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCartIcon className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Ваша корзина пуста</h1>
          <p className="text-gray-500 mb-6">Найдите что-нибудь по душе в нашем каталоге</p>
          <Link to="/catalog" className="inline-block">
            <Button className="bg-blue rounded-lg px-6 py-3 text-white font-medium">
              Перейти к покупкам
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <Link to="/catalog">
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Назад в каталог
          </Button>
        </Link>
        <div className="mt-4 flex items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Ваша корзина</h1>
          <span className="ml-3 bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-full">
            {totalItems} {totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров'}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">Список товаров</h2>
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-red-500 flex items-center gap-2"
                onClick={clearCart}
              >
                <Trash2Icon className="w-5 h-5" />
                Очистить корзину
              </Button>
            </div>

            <div className="divide-y divide-gray-100">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="lg:w-96">
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Ваш заказ</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Товары ({totalItems}):</span>
                <span className="font-medium">{totalPrice.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Доставка:</span>
                <span className="text-green-600 font-medium">Бесплатно</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="font-semibold text-lg">Итого:</span>
                <span className="text-blue-600 font-bold text-xl">{totalPrice.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            <Link to="/delivery">
              <Button className="w-full bg-blue rounded-lg py-4 text-white font-medium text-base shadow-md shadow-blue-100/50 transition-all">
                Перейти к оформлению
              </Button>
            </Link>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <GiftIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Бесплатная доставка</p>
                  <p className="text-xs text-gray-500">При заказе от 5 000 ₽</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <ShieldCheckIcon className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Безопасная оплата</p>
                  <p className="text-xs text-gray-500">SSL-шифрование данных</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <TruckIcon className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Быстрая доставка</p>
                  <p className="text-xs text-gray-500">1-3 рабочих дня</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};