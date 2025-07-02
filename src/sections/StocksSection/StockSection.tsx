
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { InfoCard } from '../../components/ui/InfoCard';
import JacketSale from '../../../public/JacketSale.png';

export const StockSection = () => {
  return (
    <SectionWrapper title="Акции" layout="info-cards" containerClassName="max-w-7xl mx-auto">
      <InfoCard title="-15 % на одежду для туризма" img={'/JacketSale.png'} badgeDate="до 26 июня" />
      <div className="flex flex-col gap-5 sm:gap-6 md:gap-8">
        <InfoCard size="small" title="Уже есть SUP? Не забудьте про комплектующие!" badgeDate="до 26 июня" />
        <InfoCard size="small" title="Подпишитесь на наш Телеграмм" button />
      </div>
    </SectionWrapper>
  );
};
