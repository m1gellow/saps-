import React from 'react';
import { CartItem as CartItemType } from '../../lib/types';
import { useCart } from '../../lib/context/CartContext';
import { QuantitySelector } from '../ProductCard/QuantitySelector';
import { motion } from 'framer-motion';
import { Trash2Icon } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const handleDecreaseQuantity = () => {
    updateQuantity(product.id, quantity - 1);
  };

  const handleIncreaseQuantity = () => {
    updateQuantity(product.id, quantity + 1);
  };

  // Форматирование цены с пробелами между тысячами
  const formatPrice = (price: string) => {
    return price.replace(/(\d)(?=(\d{3})+\s*\.)/g, '$1 ');
  };

  return (
    <motion.div
      className="flex items-center justify-between p-4 border-b border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="flex items-center space-x-4">
        <motion.div
          className="w-16 h-16 bg-gray-50 rounded-md flex items-center justify-center p-1"
          whileHover={{ scale: 1.05 }}
        >
          <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
        </motion.div>
        <div>
          <h3 className="font-normal text-[#333333] text-lg">
            <span>{product.name.split(' ')[0]} </span>
            <span className="font-light">{product.name.split(' ').slice(1).join(' ')}</span>
          </h3>
          <p className="text-gray-1 font-semibold">{formatPrice(product.price)}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <QuantitySelector
          quantity={quantity}
          onDecrease={handleDecreaseQuantity}
          onIncrease={handleIncreaseQuantity}
          small
        />

        <motion.button
          className="text-red-500 hover:text-red-700 flex items-center justify-center"
          onClick={() => removeFromCart(product.id)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2Icon className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};
