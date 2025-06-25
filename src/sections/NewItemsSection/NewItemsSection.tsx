import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../lib/context/CartContext';
import { useFavorites } from '../../lib/context/FavoritesContext';
import { AddedToCartModal } from '../../components/ProductCard/AddedToCartModal';
import { ProductImage } from '../../components/ProductCard/ProductImage';
import { Button } from '../../components/ui/button';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { Product } from '../../lib/types';

interface NewProductCardProps {
  product?: Product;
  isLarge?: boolean;
}

const NewProductCard = ({ product, isLarge = false }: NewProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  // Создаем объект продукта по умолчанию, если не передан
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

  // Форматирование цены с пробелами между тысячами
  const formatPrice = (price: string) => {
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <>
      <div
        className={`w-full ${isLarge ? 'max-w-none h-full' : 'max-w-[320px]'} bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col`}
      >
        <div className="p-0 flex flex-col gap-[20px] h-full">
          {/* Изображение товара с кнопкой избранного */}
          <div className="relative aspect-square">
            <Link to={`/product/${currentProduct.id}`} className="block h-full">
              <ProductImage 
                src={currentProduct.image} 
                alt={currentProduct.name}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
              />
            </Link>
            
            <motion.button
              className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-white transition-colors"
              onClick={toggleFavorite}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isFavorite(currentProduct.id) ? 'Удалить из избранного' : 'Добавить в избранное'}
            >
              <Heart
                className={`w-5 h-5 ${isFavorite(currentProduct.id) ? 'text-rose-500 fill-rose-500' : 'text-gray-400 hover:text-rose-400'}`}
              />
            </motion.button>
          </div>

          {/* Информация о товаре */}
          <div className="p-4 flex flex-col flex-grow">
            {/* Бренд и название */}
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

            {/* Рейтинг */}
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

            {/* Цена и количество */}
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-4">
                <div className={`${isLarge ? 'text-3xl' : 'text-2xl'} font-bold text-gray-900`}>
                  {formatPrice(currentProduct.price)}
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex gap-3">
                <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                  <Button
                    onClick={handleAddToCart}
                    className="w-full h-12 rounded-lg bg-blue hover:bg-primary/90 shadow-sm transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    <span>В корзину</span>
                  </Button>
                </motion.div>
                
                <div className="flex-1">
                  <Link to={`/product/${currentProduct.id}`} className="block w-full">
                    <Button
                      variant="outline"
                      className="w-full px-2 h-12 rounded-lg border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <Info className="w-5 h-5 mr-2" />
                      <span>Подробнее</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

interface NewItemsSectionProps {
  products?: Product[];
}

export const NewItemsSection = ({ products = [] }: NewItemsSectionProps) => {
  return (
    <SectionWrapper
      title="Новинки"
      layout="grid-2-1"
      className="px-4 lg:px-8"
      innerContainerClassName="grid md:grid-cols-3 grid-cols-1 gap-8"
    >
      {/* Сетка 2x2 (занимает 2 колонки) */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-8 md:col-span-2">
        {products.slice(0, 4).map((product, index) => (
          <NewProductCard key={product.id || index} product={product} />
        ))}
        {products.length === 0 && (
          <>
            <NewProductCard />
            <NewProductCard />
            <NewProductCard />
            <NewProductCard />
          </>
        )}
      </div>
      
      {/* Большая карточка (занимает 1 колонку) */}
      <div className="flex justify-center md:col-span-1">
        <div className="w-full h-full">
          {products.length > 4 ? (
            <NewProductCard product={products[4]} isLarge />
          ) : (
            <NewProductCard isLarge />
          )}
        </div>
      </div>
    </SectionWrapper>
  );
};