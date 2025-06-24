import { motion } from 'framer-motion';
import cn from 'classnames';

type InfoCardType = 'small' | 'normal';

interface InfoCardProps {
  size?: InfoCardType;
  title: string;
  img?: string;
  description?: string;
}

const InfoCard = ({ size = 'normal', title, img, description }: InfoCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        'bg-skyblue rounded-xl overflow-hidden',
        'flex flex-col md:flex-row items-start',
        'shadow-md hover:shadow-lg transition-all duration-300',
        size === 'small' ? 'min-h-[200px] sm:h-[260px]' : 'min-h-[400px] md:h-[560px]',
        'border border-blue-100',
      )}
    >
      <div
        className={cn(
          'p-5 sm:p-6 md:p-8 flex flex-col',
          size === 'small' ? 'w-full md:w-1/2' : 'w-full md:w-1/2 lg:w-2/5',
          'justify-between h-full',
        )}
      >
        <div>
          <h1 className="font-bold text-blue-600 text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight mb-2 sm:mb-4">
            {title}
          </h1>
          {description && <p className="font-medium text-gray-800 text-base sm:text-lg md:text-xl">{description}</p>}
        </div>
      </div>

      <div
        className={cn(
          'relative w-full h-full min-h-[200px]',
          size === 'small' ? 'md:w-1/2' : 'md:w-1/2 lg:w-3/5',
          'flex items-center justify-center',
        )}
      >
        {img && (
          <motion.img
            src={img}
            alt="Sup"
            className={cn(
              'object-contain object-center',
              'w-full h-full md:w-auto md:h-full',
              size === 'small' ? 'scale-75 md:scale-90' : 'scale-90 md:scale-100',
              'transition-transform duration-300 hover:scale-95',
            )}
          />
        )}
      </div>
    </motion.div>
  );
};

export const MainContentSection = (): JSX.Element => {
  return (
    <section className="relative w-full mt-8 sm:mt-10 md:mt-12 lg:mt-16 px-4 sm:px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
        <InfoCard
          title="На природу с комфортом и драйвом!"
          description="SUP-доски для озёр, рек и моря — выбери свою!"
          img={'/Sup.png'}
        />

        <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
          <InfoCard size="small" title="Аренда SUP" description="Попробуйте перед покупкой" img={'/Sup.png'} />
          <InfoCard size="small" title="Аксессуары" description="Все для комфортного катания" img={'/Sup.png'} />
        </div>
      </div>
    </section>
  );
};
