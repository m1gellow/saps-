import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../lib/context/CartContext';
import { Button } from '../components/ui/button';
import { CartItem } from '../components/Cart/CartItem';
import { Trash2Icon, ShoppingCartIcon, ArrowLeftIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CartPage: React.FC = () => {
  const { cartItems, totalItems, totalPrice, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCartIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Ваша корзина пуста</h1>
          <p className="text-gray-600 mb-8">Добавьте товары в корзину, чтобы совершить покупку.</p>
          <Link to="/catalog">
            <Button className="bg-blue hover:bg-blue rounded-full flex items-center justify-center mx-auto gap-2">
              <ArrowLeftIcon className="w-4 h-4" />
              Вернуться к покупкам
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Корзина</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Товары в корзине ({totalItems})</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 flex items-center gap-1"
                onClick={clearCart}
              >
                <Trash2Icon className="w-4 h-4" />
                Очистить корзину
              </Button>
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </AnimatePresence>
            </div>
          </div>

          <Link to="/catalog">
            <Button
              variant="outline"
              className="rounded-full text-blue border-blue hover:bg-blue hover:text-white flex items-center gap-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Продолжить покупки
            </Button>
          </Link>
        </div>

        <div className="lg:w-80">
          <motion.div
            className="bg-white rounded-lg shadow-md p-6 sticky top-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4">Сумма заказа</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Товары ({totalItems}):</span>
                <span>{totalPrice.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Доставка:</span>
                <span>Бесплатно</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between font-semibold text-lg">
                <span>Итого:</span>
                <span>{totalPrice.toLocaleString()} ₽</span>
              </div>
            </div>

            <Link to="/delivery">
              <Button className="w-full bg-blue-4 hover:bg-teal-600 rounded-full py-3 text-white text-lg">
                Оформить заказ
              </Button>
            </Link>

            <div className="mt-4 text-sm text-gray-500 text-center">
              <p>Нажимая кнопку, вы соглашаетесь с условиями оферты и политикой конфиденциальности</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
