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
        'flex flex-col',
        size === 'small' ? 'min-h-[260px]' : 'min-h-[400px]',
        'md:flex-row md:h-full'
      )}
    >
      {/* Текстовый контент */}
      <div className={cn(
        "relative z-10 p-5 md:p-8 flex flex-col justify-between",
        "md:w-1/2",
        size === 'small' ? "md:min-h-[260px]" : "md:min-h-[560px]"
      )}>
        <div>
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

      {/* Изображение */}
      <div className={cn(
        "relative",
        "flex-1", // Занимает оставшееся пространство
        "min-h-[200px] md:min-h-0",
        "overflow-hidden"
      )}>
        {img && (
     
            <img
              src={img}
              alt={title}
              className={cn(
                "hidden md:block absolute inset-0  object-cover",
                "transition-transform duration-300 hover:scale-105",
                size === 'small' ? "object-left" : "object-center"
              )}
            />
  
        )}
      </div>
    </div>
  );
};