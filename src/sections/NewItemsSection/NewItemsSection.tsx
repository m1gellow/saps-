import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { Product } from '../../lib/types';
import { NewProductCard } from '../../components/ProductCard/NewProductCard';
import { useMemo } from 'react';

interface NewItemsSectionProps {
  products?: Product[];
  className?: string;
}

export const NewItemsSection = ({ products = [], className = '' }: NewItemsSectionProps) => {
  const [firstFourProducts, fifthProduct] = useMemo(() => {
    return [products.slice(0, 4), products[4]];
  }, [products]);

  return (
    <SectionWrapper
      title="Новинки"
      layout="grid-2-1"
      className={`px-4 lg:px-8 ${className}`}
      innerContainerClassName="grid md:grid-cols-2 grid-cols-1 gap-6 md:gap-8 max-w-7xl mx-auto"
      aria-label="Секция новинок"
    >
      {/* Первые 4 карточки - сетка 2x2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full">
        {firstFourProducts.length > 0 ? (
          firstFourProducts.map((product) => (
            <div key={product.id} className="h-full flex justify-center">
              <NewProductCard 
                product={product} 
                className="h-full w-full max-w-[260px] sm:max-w-none"
              />
            </div>
          ))
        ) : (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={`placeholder-${index}`} className="h-full flex justify-center">
              <NewProductCard 
                className="h-full w-full max-w-[260px] sm:max-w-none"
              />
            </div>
          ))
        )}
      </div>

      {/* Пятая карточка - крупная */}
      <div className="h-full flex justify-center">
        {fifthProduct ? (
          <NewProductCard 
            product={fifthProduct} 
            isLarge 
            className="h-full w-full max-w-[320px] md:max-w-none"
          />
        ) : (
          <NewProductCard 
            isLarge 
            className="h-full w-full max-w-[320px] md:max-w-none"
          />
        )}
      </div>
    </SectionWrapper>
  );
};