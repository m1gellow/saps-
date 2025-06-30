import { useState } from 'react';
import { useCart } from '../../lib/context/CartContext';
import { Product } from '../../lib/types';
import { AddedToCartModal } from './AddedToCartModal';
import { Info, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NewProductCardProps {
  product?: Product;
  isLarge?: boolean;
  className?: string;
}

export const NewProductCard = ({ 
  product, 
  isLarge = false, 
  className = '' 
}: NewProductCardProps) => {
  const [quantity] = useState(1);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  // const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const defaultProduct: Product = {
    id: 50,
    name: 'AQUATONE Wave All-round SUP',
    brand: 'GQ',
    price: '14 000 ₽',
    priceValue: 14000,
    image: '/ProductCardItem.png',
    favoriteIcon: '/group-213.png',
    category: 'SUP доски',
    inStock: true,
  };

  const currentProduct = product || defaultProduct;

  const handleAddToCart = () => {
    addToCart(currentProduct, quantity);
    setShowAddedToCart(true);
  };

  // const toggleFavorite = () => {
  //   if (isFavorite(currentProduct.id)) {
  //     removeFromFavorites(currentProduct.id);
  //   } else {
  //     addToFavorites(currentProduct);
  //   }
  // };

  const formatPrice = (price: string) => {
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`group relative flex flex-col ${isLarge ? 'w-full max-w-[320px]' : 'w-full max-w-[260px]'} ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Изображение товара с эффектом при наведении */}
        <div className={`relative ${isLarge ? 'h-80' : 'h-64'} overflow-hidden rounded-lg bg-gray-100`}>
          <Link to={`/product/${currentProduct.id}`} className="block h-full">
            <motion.img
              src={currentProduct.image}
              alt={currentProduct.name}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              whileHover={{ scale: 1.05 }}
            />
          </Link>

          {/* Бейдж "В наличии" */}
          {currentProduct.inStock && (
            <span className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              В наличии
            </span>
          )}

          {/* Кнопка "Избранное" */}
          <button
            // onClick={toggleFavorite}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Добавить в избранное"
          >
            <Heart 
              className="w-5 h-5 text-gray-400" 
              // fill={isFavorite(currentProduct.id) ? 'red' : 'none'} 
              // stroke={isFavorite(currentProduct.id) ? 'red' : 'currentColor'}
            />
          </button>

          {/* Кнопка "Подробнее" появляется при наведении */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center bg-black/20"
            >
              <Link
                to={`/product/${currentProduct.id}`}
                className="inline-flex items-center justify-center px-4 py-2 bg-white text-blue-600 font-bold rounded-full text-sm shadow-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Info className="mr-2" size={16} />
                Подробнее
              </Link>
            </motion.div>
          )}
        </div>

        {/* Информация о товаре */}
        <div className="mt-4 flex flex-col flex-grow">
          <div className="mb-2">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {currentProduct.brand}
            </h3>
            <Link to={`/product/${currentProduct.id}`}>
              <h2 className={`mt-1 font-semibold text-gray-900 hover:text-primary transition-colors ${isLarge ? 'text-lg' : 'text-md'} line-clamp-2`}>
                {currentProduct.name}
              </h2>
            </Link>
          </div>

          {/* Рейтинг и отзывы */}
          {/* {currentProduct.rating && (
            <div className="flex items-center mt-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(currentProduct.rating!) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs text-gray-600 ml-1">
                  {currentProduct.rating} ({currentProduct.reviewsCount})
                </span>
              </div>
            </div>
          )} */}

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <div className={`font-bold ${isLarge ? 'text-xl' : 'text-lg'}`}>
                {formatPrice(currentProduct.price)}
              </div>
            </div>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleAddToCart}
                className={`w-full ${isLarge ? 'h-12 text-md' : 'h-10 text-sm'} bg-blue  shadow-sm`}
              >
                <ShoppingCart className={`${isLarge ? 'w-5 h-5 mr-2' : 'w-4 h-4 mr-1'}`} />
                В корзину
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Модальное окно после добавления в корзину */}
      {showAddedToCart && (
        <AddedToCartModal 
          product={currentProduct} 
          isOpen={showAddedToCart} 
          onClose={() => setShowAddedToCart(false)} 
        />
      )}
    </>
  );
};