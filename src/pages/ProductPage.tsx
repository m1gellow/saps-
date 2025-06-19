import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { HeartIcon, Star, BarChartIcon, TruckIcon, InfoIcon, XIcon, PlusIcon, MinusIcon, Loader2 } from 'lucide-react';
import { useCart } from '../lib/context/CartContext';
import { useFavorites } from '../lib/context/FavoritesContext';
import { Link, useParams } from 'react-router-dom';
import { Separator } from '../components/ui/separator';
import { AddedToCartModal } from '../components/ProductCard/AddedToCartModal';
import { RecommendedProducts } from '../components/ProductCard/RecommendedProducts';
import { getProductById } from '../lib/api/products';
import { getRecommendedProducts } from '../lib/data/products';
import { Product } from '../lib/types';

export const ProductPage: React.FC = () => {
  const { addToCart } = useCart();
  const { addToFavorites, isFavorite, removeFromFavorites } = useFavorites();
  const [activeTab, setActiveTab] = useState('parameters');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const productId = parseInt(id || "1");
  
  // Загрузка товара по ID
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const productData = await getProductById(productId);
        if (!productData) {
          throw new Error("Товар не найден");
        }
        setProduct(productData);
        setQuantity(1); // Сбрасываем количество при смене товара
        
        // Загружаем рекомендуемые товары
        const recommendedData = await getRecommendedProducts(productId, 4);
        setRecommendedProducts(recommendedData);
      } catch (error) {
        console.error(`Ошибка при загрузке товара с ID ${productId}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <Loader2 className="h-12 w-12 text-blue-4 animate-spin" />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Товар не найден</h2>
        <p className="text-gray-600 mb-6">Извините, запрашиваемый товар не существует или был удален.</p>
        <Link to="/catalog">
          <Button className="bg-blue-4 hover:bg-teal-600 text-white">
            Вернуться в каталог
          </Button>
        </Link>
      </div>
    );
  }
  
  // Изображения для галереи (в реальном приложении - из API)
  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image
  ];
  
  // Характеристики товара (в реальном приложении - из API)
  const productSpecs = {
    length: "335 см",
    width: "85 см",
    thickness: "15 см",
    warranty: "12 мес",
    maxPressure: "25 psi",
    equipment: "Весло, Насос, Плавник, Ремкомплект, Сиденье, Сумка для хранения",
    recommendedCapacity: "1 чел.",
    maxCapacity: "2 чел.",
    volume: "315 л",
    boxSize: "28x30x89 см",
    boardWeight: "12 кг",
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowAddedToCart(true);
  };
  
  const toggleFavorite = () => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };
  
  const handleImageSelect = (index: number) => {
    setSelectedImage(index);
  };
  
  const increaseQuantity = () => {
    setQuantity(q => q + 1);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Хлебные крошки */}
      <div className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-4">Главная</Link>
        <span className="mx-2">›</span>
        <Link to="/catalog" className="hover:text-blue-4">Каталог</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{product.name}</span>
      </div>
      
      {/* Основная информация о товаре */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Галерея изображений */}
        <div>
          <div className="bg-gray-50 rounded-lg p-4 mb-4 flex justify-center">
            <img
              src={productImages[selectedImage]}
              alt={product.name}
              className="max-h-[400px] object-contain"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {productImages.map((image, index) => (
              <motion.div
                key={index}
                className={`flex-shrink-0 w-16 h-16 border-2 rounded cursor-pointer overflow-hidden ${
                  selectedImage === index ? 'border-blue-4' : 'border-gray-200'
                }`}
                onClick={() => handleImageSelect(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={image}
                  alt={`Миниатюра ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Информация о товаре */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            {product.name}
          </h1>
          
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="ml-2 text-xs">(32 отзыва)</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 text-sm">Размер:</span>
              <span className="px-3 py-1 border border-gray-300 rounded text-sm bg-gray-50">11'0"</span>
              <span className="px-3 py-1 border border-gray-300 rounded text-sm">10'6"</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 text-sm">Вес доски:</span>
              <span className="px-3 py-1 border border-gray-300 rounded text-sm">9 кг</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 text-sm">Макс. давление:</span>
              <span className="px-3 py-1 border border-gray-300 rounded text-sm">25 psi</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 text-sm">Грузоподъемность:</span>
              <span className="px-3 py-1 border border-gray-300 rounded text-sm">150 кг</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <span className="text-3xl font-bold">{product.price}</span>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={decreaseQuantity}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="w-10 text-center">{quantity}</span>
              <button 
                onClick={increaseQuantity}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex space-x-4 mb-8">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1"
            >
              <Button 
                className="w-full bg-gray-800 text-white rounded-full py-3 font-semibold"
                onClick={handleAddToCart}
              >
                В корзину
              </Button>
            </motion.div>
            
            <motion.button 
              className={`w-12 h-12 rounded-full border flex items-center justify-center ${
                isFavorite(product.id) 
                  ? 'bg-red-50 border-red-300 text-red-500' 
                  : 'border-gray-300 text-gray-400'
              }`}
              onClick={toggleFavorite}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <HeartIcon 
                className={`h-6 w-6 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : ''}`} 
              />
            </motion.button>
            
            <Link to="/compare">
              <motion.button 
                className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <BarChartIcon className="h-5 w-5 text-gray-600" />
              </motion.button>
            </Link>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3 text-gray-700 mb-2">
              <TruckIcon className="h-5 w-5 text-blue-4" />
              <span>Бесплатная доставка по России</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <InfoIcon className="h-5 w-5 text-blue-4" />
              <span>Гарантия 12 месяцев</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Табы с информацией */}
      <div className="mb-8">
        <div className="flex overflow-x-auto border-b scrollbar-hide">
          <button
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'parameters' 
                ? 'text-blue-4 border-b-2 border-blue-4' 
                : 'text-gray-600 hover:text-blue-4'
            }`}
            onClick={() => setActiveTab('parameters')}
          >
            Параметры
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'description' 
                ? 'text-blue-4 border-b-2 border-blue-4' 
                : 'text-gray-600 hover:text-blue-4'
            }`}
            onClick={() => setActiveTab('description')}
          >
            Описание
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'delivery' 
                ? 'text-blue-4 border-b-2 border-blue-4' 
                : 'text-gray-600 hover:text-blue-4'
            }`}
            onClick={() => setActiveTab('delivery')}
          >
            Доставка и оплата
          </button>
        </div>
        
        <div className="pt-6">
          {activeTab === 'parameters' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Длина доски</span>
                <span className="font-medium">{productSpecs.length}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Максимальное кол-во пассажиров</span>
                <span className="font-medium">{productSpecs.maxCapacity}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Ширина доски</span>
                <span className="font-medium">{productSpecs.width}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Объем, л.</span>
                <span className="font-medium">{productSpecs.volume}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Толщина доски</span>
                <span className="font-medium">{productSpecs.thickness}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Размер коробки</span>
                <span className="font-medium">{productSpecs.boxSize}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Гарантия</span>
                <span className="font-medium">{productSpecs.warranty}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Вес доски</span>
                <span className="font-medium">{productSpecs.boardWeight}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Максимальное давление</span>
                <span className="font-medium">{productSpecs.maxPressure}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100 md:col-span-2">
                <span className="text-gray-600">Комплектация</span>
                <span className="font-medium">{productSpecs.equipment}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Рекомендуемое кол-во пассажиров</span>
                <span className="font-medium">{productSpecs.recommendedCapacity}</span>
              </div>
            </div>
          )}
          
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p>
                {product.description || 
                  `${product.name} — это универсальная надувная SUP-доска для новичков и продвинутых, для отдыха на воде и для фитнеса.
                  
                  Доска имеет классическую конструкцию со смещенным вперед центром тяжести, что обеспечивает ей отличную устойчивость на воде. Это делает её идеальной для начинающих сапсерферов. В то же время, невысокая (15 см) толщина доски обеспечивает ей достаточную манёвренность.`
                }
              </p>
            </div>
          )}
          
          {activeTab === 'delivery' && (
            <div className="prose max-w-none">
              <h3>Доставка</h3>
              <p>
                Мы осуществляем доставку по всей России. Доставка по Москве и Санкт-Петербургу - бесплатно. 
                Доставка в другие регионы осуществляется транспортными компаниями СДЭК, DPD и Почтой России.
              </p>
              
              <h3 className="mt-6">Оплата</h3>
              <p>
                Вы можете оплатить заказ следующими способами:
              </p>
              <ul>
                <li>Банковской картой при оформлении заказа</li>
                <li>Наличными или картой при получении</li>
                <li>Безналичным переводом для юридических лиц</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Рекомендуемые товары */}
      {recommendedProducts.length > 0 && (
        <RecommendedProducts products={recommendedProducts} />
      )}
      
      <AnimatePresence>
        {showAddedToCart && (
          <AddedToCartModal 
            product={product}
            isOpen={showAddedToCart}
            onClose={() => setShowAddedToCart(false)}
          />
        )}
      </AnimatePresence>
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};