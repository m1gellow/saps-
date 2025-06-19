import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../lib/context/FavoritesContext';
import { useCart } from '../lib/context/CartContext';
import { Button } from '../components/ui/button';
import { HeartIcon, ShoppingCartIcon, ArrowLeftIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FavoritesPage: React.FC = () => {
  const { favorites, removeFromFavorites, totalFavorites } = useFavorites();
  const { addToCart } = useCart();

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HeartIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">У вас нет избранных товаров</h1>
          <p className="text-gray-600 mb-8">Добавляйте товары в избранное, чтобы не потерять их.</p>
          <Link to="/catalog">
            <Button className="bg-blue-4 hover:bg-teal-600 rounded-full flex items-center justify-center mx-auto gap-2">
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Избранное</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {favorites.map((product) => (
            <motion.div 
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <div className="p-4 flex space-x-4">
                <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center p-2 flex-shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-normal text-[#333333] text-base">
                    <span>{product.name.split(' ')[0]} </span>
                    <span className="font-light">{product.name.split(' ').slice(1).join(' ')}</span>
                  </h3>
                  
                  <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                  
                  <p className="text-gray-1 font-semibold">{product.price}</p>
                  
                  <div className="flex mt-2 space-x-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        className="h-9 rounded-full bg-blue-4 text-white text-sm px-3 flex items-center gap-1"
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingCartIcon className="w-4 h-4" />
                        В корзину
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        className="h-9 rounded-full border-red-500 text-red-500 hover:bg-red-50 text-sm px-3"
                        onClick={() => removeFromFavorites(product.id)}
                      >
                        Удалить
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="mt-8 flex justify-center">
        <Link to="/catalog">
          <Button 
            variant="outline" 
            className="rounded-full text-blue-4 border-blue-4 hover:bg-blue-4 hover:text-white flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Вернуться к покупкам
          </Button>
        </Link>
      </div>
    </div>
  );
};