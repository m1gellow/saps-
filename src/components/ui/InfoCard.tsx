import cn from 'classnames';

type InfoCardType = 'small' | 'normal';

interface InfoCardProps {
  size?: InfoCardType;
  title: string;
  img?: string;
  description?: string;
  badgeDate?: string;
}

export const InfoCard = ({ size = 'normal', title, img, description, badgeDate }: InfoCardProps) => {
  return (
    <div
      className={cn(
        'relative bg-skyblue rounded-xl overflow-hidden',
        'flex flex-col',
        size === 'small' ? 'min-h-[260px]' : 'min-h-[400px]',
        'md:flex-row md:h-full'
      )}
    >
      {/* Текстовый контент */}
      <div
        className={cn(
          'relative z-10 p-5 md:p-8 flex flex-col justify-between',
          'md:w-1/2',
          size === 'small' ? 'md:min-h-[260px]' : 'md:min-h-[560px]'
        )}
      >
        <div className='flex flex-col gap-[20px]'>
          {badgeDate && (
            <button className="bg-blue font-bold text-white w-max gap-[10px] p-[5px] rounded-[8px]">
              {badgeDate}
            </button>
          )}

          <h1 className="font-bold text-blue text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-3 md:mb-4">
            {title}
          </h1>
          {description && (
            <p className="font-medium text-gray-800 text-base sm:text-lg md:text-xl">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Изображение - переработанный блок */}
      <div
        className={cn(
          'relative flex-1',
          'min-h-[200px] md:min-h-0',
          'flex items-center justify-center', // Центрируем изображение
          'bg-gray-100' // Фон на случай если изображение не загрузится
        )}
      >
        {img && (
          <img
            src={img}
            alt={title}
            className={cn(
              'w-full h-full object-contain', // Используем object-contain вместо object-cover
              'md:absolute md:inset-0', // Абсолютное позиционирование только на десктопе
              'transition-transform duration-300 hover:scale-105',
              size === 'small' ? 'md:object-left' : 'md:object-center'
            )}
          />
        )}
      </div>
    </div>
  );
};