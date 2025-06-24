import cn from 'classnames';

type InfoCardType = 'small' | 'normal';

interface InfoCardProps {
  size?: InfoCardType;
  title: string;
  img?: string;
  description?: string;
}

export const InfoCard = ({ size = 'normal', title, img, description }: InfoCardProps) => {
  return (
    <div
      className={cn(
        'relative bg-skyblue rounded-xl overflow-hidden',
        'flex flex-col md:flex-row',
        size === 'small' ? 'min-h-[260px] md:h-[260px]' : 'min-h-[400px] md:h-[560px]',
      )}
    >
      {/* Текстовый контент */}
      <div className="relative z-10 p-5 md:p-8 flex flex-col justify-between h-full md:w-1/2">
        <div>
          <h1 className="font-bold text-blue text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-3 md:mb-4">{title}</h1>
          {description && <p className="font-medium text-gray-800 text-base sm:text-lg md:text-xl">{description}</p>}
        </div>
      </div>

      {/* Изображение */}
      <div className={cn('relative h-full min-h-[200px] md:min-h-0', 'md:w-1/2', 'flex items-center justify-center')}>
        {img && (
          <img
            src={img}
            alt="Sup"
            className={cn(
              'absolute h-full w-full object-cover',
              'transform scale-[0.8] md:scale-[0.7] lg:scale-[0.8]',
              'md:object-left lg:object-center',
              size === 'small' && 'md:scale-[0.6] lg:scale-[0.6]',
            )}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent md:bg-gradient-to-r md:from-white/50 md:to-transparent" />
      </div>
    </div>
  );
};