import { useState } from "react";
import { useCart } from "../../lib/context/CartContext";
import { useFavorites } from "../../lib/context/FavoritesContext";
import { Product } from "../../lib/types";
import { AddedToCartModal } from "./AddedToCartModal";
import { Heart, Info, ShoppingCart, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ProductImage } from "./ProductImage";
import { motion } from 'framer-motion';

interface NewProductCardProps {
  product?: Product;
  isLarge?: boolean;
}

export const NewProductCard = ({ product, isLarge = false }: NewProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

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

  const toggleFavorite = () => {
    if (isFavorite(currentProduct.id)) {
      removeFromFavorites(currentProduct.id);
    } else {
      addToFavorites(currentProduct);
    }
  };

  const formatPrice = (price: string) => {
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <>
      <motion.div
        className={`w-full ${isLarge ? 'max-w-none h-full' : 'max-w-[320px]'} bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col relative`}
        whileHover={{ y: -5 }}
      >
        {/* Обертка для изображения с кнопкой "Подробнее" */}
        <div className="relative group">
          <Link to={`/product/${currentProduct.id}`} className="block h-full">
            <div className="relative aspect-square">
              <ProductImage 
                src={currentProduct.image} 
                alt={currentProduct.name}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
              />
              
              {/* Анимированная кнопка "Подробнее" */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to={`/product/${currentProduct.id}`}
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue font-bold rounded-full  text-sm shadow-md border-[2px] border-blue"
                  >
                    <Info className="mr-2" size={16} />
                    Подробнее
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </Link>
          
        
        </div>

        {/* Информация о товаре */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="mb-2">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {currentProduct.brand}
            </h3>
            <Link to={`/product/${currentProduct.id}`}>
              <h2 className={`${isLarge ? 'text-xl' : 'text-lg'} font-semibold text-gray-900 mt-1 hover:text-primary line-clamp-2`}>
                {currentProduct.name}
              </h2>
            </Link>
          </div>

          <div className="flex items-center mb-3">
            <div className="flex mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">(24)</span>
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-4">
              <div className={`${isLarge ? 'text-3xl' : 'text-2xl'} font-bold text-gray-900`}>
                {formatPrice(currentProduct.price)}
              </div>
            </div>

            <div className="flex gap-3">
              <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                <Button
                  onClick={handleAddToCart}
                  className="w-full h-12 rounded-lg bg-blue shadow-sm "
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  <span>В корзину</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Модальное окно добавления в корзину */}
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