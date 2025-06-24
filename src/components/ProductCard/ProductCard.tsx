import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Product } from '../../lib/types';
import { useCart } from '../../lib/context/CartContext';
import { useFavorites } from '../../lib/context/FavoritesContext';
import { ProductImage } from './ProductImage';
import { QuantitySelector } from './QuantitySelector';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Info, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AddedToCartModal } from './AddedToCartModal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowAddedToCart(true);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const toggleFavorite = () => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const showProductDetails = () => {
    setShowDetails(true);
  };

  // Форматирование цены с пробелами между тысячами
  const formatPrice = (price: string) => {
    return price.replace(/(\d)(?=(\d{3})+\s*\.)/g, '$1 ');
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-[325px] h-auto bg-white rounded-[22px] shadow-[0px_0px_30px_#0000001a] transition-all duration-300 hover:shadow-[0px_10px_30px_#0000004d] overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <Link to={`/product/${product.id}`}>
                <ProductImage src={product.image} alt={product.name} />
              </Link>
              <motion.button
                className="absolute w-[32px] h-[32px] top-3 right-3 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-md border border-gray-100"
                onClick={toggleFavorite}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={isFavorite(product.id) ? 'Удалить из избранного' : 'Добавить в избранное'}
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                />
              </motion.button>
            </div>

            <div className="flex flex-col items-start justify-center gap-3 p-4 mt-4">
              <div className="flex flex-col items-start gap-2.5">
                <div className="font-normal text-[#333333] text-lg">
                  <span>{product.name.split(' ')[0]} </span>
                  <span className="font-light">{product.name.split(' ').slice(1).join(' ')}</span>
                </div>
                <div className="font-extralight text-black text-[15px]">{product.brand}</div>
              </div>

              <div className="flex flex-col items-center justify-center gap-3 w-full">
                <div className="flex items-center justify-between w-full">
                  <div className="font-semibold text-gray-1 text-2xl">{formatPrice(product.price)}</div>

                  <QuantitySelector
                    quantity={quantity}
                    onDecrease={handleDecreaseQuantity}
                    onIncrease={handleIncreaseQuantity}
                  />
                </div>

                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>

              <div className="flex justify-between w-full gap-4 mt-2">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    className="w-full max-w-[139px] h-[47px] bg-gray-1 rounded-[53px] text-white text-[15px] md:text-[17px] font-semibold shadow-[0px_8px_20px_#1960c640] transition-all duration-300 hover:bg-[#555555] flex items-center gap-2"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-4 h-4" />В корзину
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to={`/product/${product.id}`}>
                    <Button
                      variant="outline"
                      className="w-full max-w-[139px] h-[47px] rounded-[53px] text-gray-1 text-[15px] md:text-[17px] font-semibold border-[#333333] transition-all duration-300 hover:bg-[#f5f5f5] flex items-center gap-2"
                    >
                      <Info className="w-4 h-4" />
                      Подробнее
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Модальное окно добавления в корзину */}
      <AnimatePresence>
        {showAddedToCart && (
          <AddedToCartModal product={product} isOpen={showAddedToCart} onClose={() => setShowAddedToCart(false)} />
        )}
      </AnimatePresence>
    </>
  );
};
