import React, { useCallback, useRef, memo } from "react";
import { motion } from "framer-motion";
import { useCart } from "../../lib/context/CartContext";
import { useFavorites } from "../../lib/context/FavoritesContext";
import { Button } from "../ui/button";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "../../lib/types";

// Типы данных для рекомендуемых товаров
interface RecommendedProductsProps {
  title?: string;
  products: Product[];
  showControls?: boolean;
}

// Компонент отдельного рекомендуемого товара для предотвращения лишних перерендеров
const RecommendedProductItem = memo(({ 
  product, 
  addToCart, 
  isFavorite, 
  toggleFavorite 
}: { 
  product: Product, 
  addToCart: (product: Product) => void, 
  isFavorite: (id: number) => boolean,
  toggleFavorite: (product: Product) => void 
}) => {
  return (
    <motion.div
      layout
      key={product.id}
      className="flex-shrink-0 w-[250px] snap-start bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        {/* Изображение товара */}
        <Link to={`/product/${product.id}`}>
          <div className="h-40 flex items-center justify-center p-4 bg-gray-50 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain transition-transform hover:scale-105"
            />
          </div>
        </Link>
        
        {/* Кнопка "Добавить в избранное" */}
        <motion.button
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100"
          onClick={() => toggleFavorite(product)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart
            className={`w-4 h-4 ${isFavorite(product.id) ? "text-red-500 fill-red-500" : "text-gray-400"}`}
          />
        </motion.button>
      </div>
      
      {/* Информация о товаре */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h4 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2 h-10">
            {product.name}
          </h4>
        </Link>
        
        <div className="text-xs text-gray-500 mb-2">{product.brand}</div>
        
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900">{product.price}</span>
          
          {/* Индикатор рейтинга */}
          <div className="flex items-center">
            <div className="w-4 h-4">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                      fill="#FFC107" stroke="#FFC107" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xs ml-1 text-gray-500">4.8</span>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-3">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1"
          >
            <Button
              className="w-full h-9 bg-gray-800 hover:bg-gray-700 text-white rounded-full text-xs flex items-center justify-center gap-1"
              onClick={() => addToCart(product)}
            >
              <ShoppingCart className="w-3 h-3" />
              В корзину
            </Button>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1"
          >
            <Link to={`/product/${product.id}`}>
              <Button
                variant="outline"
                className="w-full h-9 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full text-xs"
              >
                Подробнее
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});

export const RecommendedProducts: React.FC<RecommendedProductsProps> = memo(({ 
  title = "Рекомендуемые товары", 
  products, 
  showControls = true 
}) => {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Функция для обработки нажатия на кнопку "В корзину"
  const handleAddToCart = useCallback((product: Product) => {
    addToCart(product);
  }, [addToCart]);
  
  // Функция для обработки нажатия на кнопку "Добавить в избранное"
  const toggleFavorite = useCallback((product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  }, [isFavorite, removeFromFavorites, addToFavorites]);
  
  // Функция для перехода к следующему слайду
  const nextSlide = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }, []);
  
  // Функция для перехода к предыдущему слайду
  const prevSlide = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }, []);

  // Если продуктов нет, не рендерим секцию вообще
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 mb-12 relative">
      {/* Заголовок и элементы управления */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800">{title}</h3>
        
        {showControls && products.length > 3 && (
          <div className="flex space-x-2">
            <motion.button 
              className="w-8 h-8 md:w-10 md:h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 shadow-sm"
              onClick={prevSlide}
              whileHover={{ scale: 1.05, backgroundColor: "#f9fafb" }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
            
            <motion.button 
              className="w-8 h-8 md:w-10 md:h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 shadow-sm"
              onClick={nextSlide}
              whileHover={{ scale: 1.05, backgroundColor: "#f9fafb" }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
          </div>
        )}
      </div>
      
      {/* Контейнер для прокрутки товаров */}
      <div 
        ref={containerRef}
        className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide snap-x"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none'
        }}
      >
        {products.map(product => (
          <RecommendedProductItem 
            key={product.id}
            product={product}
            addToCart={handleAddToCart}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </div>
      
 
    </div>
  );
});

RecommendedProducts.displayName = "RecommendedProducts";