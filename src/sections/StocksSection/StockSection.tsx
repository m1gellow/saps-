import { motion } from 'framer-motion';

import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { InfoCard } from '../../components/ui/InfoCard';




export const StockSection = () => {
  return (
    <SectionWrapper 
      title="Акции" 
      layout="info-cards"
      containerClassName="max-w-7xl mx-auto"
    >
      <InfoCard
        title="На природу с комфортом и драйвом!"
        description="SUP-доски для озёр, рек и моря — выбери свою!"
        img={'/items/Sup.png'}
      />
      <div className="flex flex-col gap-5 sm:gap-6 md:gap-8">
        <InfoCard
          size="small"
          title="Уже есть SUP? Не забудьте про комплектующие!"
          img={'/items/Sup2.png'}
        />
        <InfoCard
          size="small"
          title="Закажи SUP с доставкой"
          img={'/items/jacket.png'}
        />
      </div>
    </SectionWrapper>
  );
};
