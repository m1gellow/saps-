import { ProductsGridLayout } from '../../components/ui/ProductsGridLayout';
import { SectionWrapper } from '../../components/ui/SectionWrapper';

import { Product } from '../../lib/types';

interface NewItemsSectionProps {
  products?: Product[];
  className?: string;
}

export const NewItemsSection = ({ products = [], className = '' }: NewItemsSectionProps) => {
  return (
    <SectionWrapper
      title="Новинки"
      className={className}
      aria-label="Секция новинок"
    >
      <ProductsGridLayout products={products} />
    </SectionWrapper>
  );
};