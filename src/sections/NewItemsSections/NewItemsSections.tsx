import { ChartColumnStacked, Heart, ShoppingBag, Star } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../lib/context/CartContext';
import { useFavorites } from '../../lib/context/FavoritesContext';
import { AddedToCartModal } from '../../components/ProductCard/AddedToCartModal';
import { SectionWrapper } from '../../components/ui/SectionWrapper';

const NewProductCard = ({ product }: { product?: any }) => {
  const [quantity, setQuantity] = useState(1);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    addToCart(product || {}, quantity);
    setShowAddedToCart(true);
  };

  const toggleFavorite = () => {
    if (product?.id) {
      if (isFavorite(product.id)) {
        removeFromFavorites(product.id);
      } else {
        addToFavorites(product);
      }
    }
  };

  const formatPrice = (price: string) => {
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <>
      <div
        className="flex flex-col gap-3 w-full"
      >
        <div className="aspect-[4/3] overflow-hidden rounded-lg relative">
          <div  className="flex items-center  jus h-full">
            <img
              src={product?.image || '/ProductCardItem.png'}
              alt={product?.name || 'SUP Board'}
              className=" scale-50 object-cover hover:opacity-90 transition-opacity"
            />
          </div>

          <button
            className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-white transition-colors"
            onClick={toggleFavorite}
            aria-label={product?.id && isFavorite(product.id) ? 'Удалить из избранного' : 'Добавить в избранное'}
          >
            <Heart
              className={`w-5 h-5 ${product?.id && isFavorite(product.id) ? 'text-rose-500 fill-rose-500' : 'text-gray-400 hover:text-rose-400'}`}
            />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Heart
              size={18}
              color="#003153"
              className="hover:opacity-80 cursor-pointer transition-opacity"
              onClick={toggleFavorite}
            />
            <ShoppingBag
              size={18}
              color="#003153"
              className="hover:opacity-80 cursor-pointer transition-opacity"
              onClick={handleAddToCart}
            />
            <ChartColumnStacked
              size={18}
              color="#003153"
              className="hover:opacity-80 cursor-pointer transition-opacity"
            />
          </div>

          <h3 className="text-gray-400 text-xs font-normal">{product?.brand || 'GQ'}</h3>
          <Link to={`/product/${50}`}>
            <h2 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
              {product?.name || 'AQUATONE Wave All-round SUP'}
            </h2>
          </Link>

          <div className="flex items-center">
            <div className="flex mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">(24)</span>
          </div>

          <div className="flex items-center justify-between mt-1">
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-base">
                {product?.price ? formatPrice(product.price) + '₽' : '14 000₽'}
              </span>
              <span className="text-xs font-light text-gray-400 line-through">
                {product?.oldPrice ? formatPrice(product.oldPrice) + '₽' : '12 000₽'}
              </span>
            </div>
            <div className="flex items-center bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
              <button
                onClick={decrement}
                className="text-white hover:bg-slate-700 transition-colors flex items-center justify-center w-6 h-6"
              >
                <svg width="8" height="2" viewBox="0 0 16 2" fill="none">
                  <path d="M0 1h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>

              <div className="bg-white px-2 py-0.5 min-w-[24px] flex items-center justify-center border-x border-slate-200">
                <span className="text-slate-800 font-medium text-xs">{quantity}</span>
              </div>

              <button
                onClick={increment}
                className="text-white hover:bg-slate-700 transition-colors flex items-center justify-center w-6 h-6"
              >
                <svg width="8" height="8" viewBox="0 0 16 16" fill="none">
                  <path d="M8 0v16M0 8h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddedToCartModal
        product={product || { name: 'AQUATONE Wave All-round SUP', image: '/ProductCardItem.png' }}
        isOpen={showAddedToCart}
        onClose={() => setShowAddedToCart(false)}
      />
    </>
  );
};

export const NewItemsSections = ({ products = [] }: { products?: any[] }) => {
  return (
    <SectionWrapper
      title="Новинки"
      layout="grid-2-1"
      className="px-4 lg:px-8"
      innerContainerClassName="grid md:grid-cols-2 grid-cols-1 gap-[40px]"
    >
      <div className="grid md:grid-cols-2 grid-cols-1 gap-[40px]">
        {products.slice(0, 4).map((product, index) => (
          <NewProductCard key={index} product={product} />
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
      <div className="flex justify-center">
        <div className="max-w-[350px] w-full">
          {products.length > 4 ? <NewProductCard product={products[4]} /> : <NewProductCard />}
        </div>
      </div>
    </SectionWrapper>
  );
};
