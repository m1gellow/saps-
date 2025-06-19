
import { useEffect, useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "../ui/button";



interface FilterSideBarProps {
  filters: {
    brands: Array<{ name: string; checked: boolean }>;
    priceRange: [number, number];
    activeCategory: string | null;
  };
  toggleBrandFilter: (brandName: string) => void;
  setPriceRange: (range: [number, number]) => void;
  resetFilters: () => void;
  getFilteredPrice: (isMin: boolean) => string;
}


export const FilterSideBar: React.FC<FilterSideBarProps> = ({
  filters,
  toggleBrandFilter,
  setPriceRange,
  resetFilters,
  getFilteredPrice
}) => {
  const [sliderMin, setSliderMin] = useState(filters.priceRange[0]);
  const [sliderMax, setSliderMax] = useState(filters.priceRange[1]);

  // Обновление локальных слайдеров при изменении фильтров
  useEffect(() => {
    setSliderMin(filters.priceRange[0]);
    setSliderMax(filters.priceRange[1]);
  }, [filters.priceRange]);

  const handlePriceRangeChange = () => {
    setPriceRange([sliderMin, sliderMax]);
  };

  // Расчет процентного значения для стиля прогресс-бара слайдера
  const minPercent = ((sliderMin - 0) / (50000 - 0)) * 100;
  const maxPercent = ((sliderMax - 0) / (50000 - 0)) * 100;

  // Calculate slider track style
  const getTrackStyle = () => {
    return {
      background: `linear-gradient(to right, #e5e7eb ${minPercent}%, #17ccc5 ${minPercent}%, #17ccc5 ${maxPercent}%, #e5e7eb ${maxPercent}%)`
    };
  };



  return (
    <AnimatePresence>
      <motion.div 
        className={`flex-shrink-0 mb-6 lg:mb-0 block`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <div className="w-full bg-white p-4 md:p-6 rounded-lg shadow-md">
            {/* Price filter */}
            <div className="mb-8">
              <h3 className="text-center font-semibold text-gray-1 text-xl mb-4">
                Цена
              </h3>
              
              <div className="px-2 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="relative">
                    <span className="absolute text-xs text-gray-500 -top-5 left-0">От</span>
                    <input 
                      type="text" 
                      className="w-24 p-2 text-sm border border-gray-300 rounded-md text-center focus:border-blue-4 focus:ring focus:ring-blue-4 focus:ring-opacity-30" 
                      value={getFilteredPrice(true)} 
                      onChange={(e) => {
                        const value = parseInt(e.target.value.replace(/\D/g, ''));
                        if (!isNaN(value)) {
                          setSliderMin(value);
                        }
                      }}
                      onBlur={handlePriceRangeChange}
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute text-xs text-gray-500 -top-5 left-0">До</span>
                    <input 
                      type="text" 
                      className="w-24 p-2 text-sm border border-gray-300 rounded-md text-center focus:border-blue-4 focus:ring focus:ring-blue-4 focus:ring-opacity-30" 
                      value={getFilteredPrice(false)} 
                      onChange={(e) => {
                        const value = parseInt(e.target.value.replace(/\D/g, ''));
                        if (!isNaN(value)) {
                          setSliderMax(value);
                        }
                      }}
                      onBlur={handlePriceRangeChange}
                    />
                  </div>
                </div>
              
                {/* Slider track */}
                <div className="relative w-full h-2 mt-8 mb-4">
                  <div 
                    className="absolute w-full h-2 bg-gray-200 rounded-lg"
                    style={getTrackStyle()}
                  ></div>
                  
                  {/* Min thumb */}
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="100"
                    value={sliderMin}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value < sliderMax) {
                        setSliderMin(value);
                      }
                    }}
                    onMouseUp={handlePriceRangeChange}
                    onTouchEnd={handlePriceRangeChange}
                    className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto z-10"
                    style={{ 
                      WebkitAppearance: 'none',
                      appearance: 'none' 
                    }}
                  />
                  
                  {/* Max thumb */}
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="100"
                    value={sliderMax}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value > sliderMin) {
                        setSliderMax(value);
                      }
                    }}
                    onMouseUp={handlePriceRangeChange}
                    onTouchEnd={handlePriceRangeChange}
                    className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto z-10"
                    style={{ 
                      WebkitAppearance: 'none',
                      appearance: 'none'
                    }}
                  />
                </div>
              </div>

              <div className="relative mb-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0 ₽</span>
                  <span>25 000 ₽</span>
                  <span>50 000 ₽</span>
                </div>
              </div>
            </div>

            {/* Brand filter */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-1 text-xl mb-4">
                Бренд
              </h3>

              <div className="flex flex-col gap-[10px] ml-3">
                {filters.brands.map((brand, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => toggleBrandFilter(brand.name)}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative">
                      {brand.checked ? (
                        <div className="w-5 h-5 bg-[#17ccc533] rounded-[3px] border border-solid border-[#17ccc5] flex items-center justify-center">
                          <svg className="w-3 h-3 text-blue-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 bg-gray-100 rounded-[3px] border border-gray-300 hover:border-blue-4 transition-colors" />
                      )}
                    </div>
                    <span className="font-normal text-[#333333] text-[15px]">
                      {brand.name}
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="flex items-center gap-[7px] mt-4 ml-0.5 cursor-pointer text-blue-4"
                whileHover={{ x: 3 }}
              >
                <ChevronDownIcon className="w-4 h-4" />
                <span className="font-light text-[13px] underline">
                  еще
                </span>
              </motion.div>
            </div>

            {/* Filter buttons */}
            <div className="flex gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  className="px-5 h-[37px] bg-blue-4 rounded-[53px] text-white text-[15px] font-semibold shadow-lg"
                  onClick={handlePriceRangeChange}
                >
                  Применить
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="px-5 h-[37px] rounded-[53px] text-gray-1 text-[15px] font-semibold border-[#333333]"
                  onClick={resetFilters}
                >
                  Сбросить
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};