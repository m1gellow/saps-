import { useState } from 'react';
import cn from 'classnames';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
const categories = [
  { name: 'SUP', id: 1, image: '/items/Sup.png' },
  { name: 'Комплектующие', id: 2, image: '/items/Sup2.png' },
  { name: 'Насосы', id: 3, image: '/items/jacket.png' },
  { name: 'Гермомешки и сумки', id: 4, image: '/items/Sup.png' },
  { name: 'Спасательные жилеты', id: 5, image: '/items/jacket.png' },
  { name: 'Одежда', id: 6, image: '/items/Sup2.png' },
];

const CategoryCard = ({
  name,
  active,
  setActive,
  id,
  image,
}: {
  name: string;
  id: number;
  active: number;
  setActive: (id: number) => void;
  image: string;
}) => {
  return (
    <div
      onClick={() => setActive(id)}
      className={cn(
        'bg-skyblue rounded-lg overflow-hidden',
        'h-[180px] w-[180px] flex-shrink-0',
        'flex flex-col',
        active === id ? 'border-[2px] border-blue shadow-md' : 'border border-gray-200',
      )}
    >
      <div className="p-3 flex-1 flex flex-col ">
        <h2 className="text-gray-800 font-bold text-sm md:text-base text-center mb-2">{name}</h2>
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <img
            src={image}
            alt={name}
            className="absolute object-contain w-[120px] h-[120px] p-2"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/default-category.jpg';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const SupRentalSection = () => {
  const [active, setActive] = useState(1);

  return (
    <SectionWrapper title="Подборки" className="px-4 lg:px-8">
      <div className="flex overflow-x-auto pb-6 gap-4 md:gap-6 scrollbar-hide px-2">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            name={category.name}
            id={category.id}
            active={active}
            setActive={setActive}
            image={category.image}
          />
        ))}
      </div>
    </SectionWrapper>
  );
};
