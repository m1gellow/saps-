
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { Product } from '../../lib/types';
import { NewProductCard } from '../../components/ProductCard/NewProductCard';




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