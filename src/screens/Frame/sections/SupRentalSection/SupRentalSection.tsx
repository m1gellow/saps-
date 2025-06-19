import { Menu, ArrowDown  } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { useFilters } from "../../../../lib/context/FilterContext";
import { motion } from "framer-motion";


export const SupRentalSection = ({showMobileFilter, setShowMobileFilter}: {showMobileFilter: boolean, setShowMobileFilter: (arg1: boolean) => void}): JSX.Element => {
  const { filters, setActiveCategory, toggleFiltersVisibility } = useFilters();


  
  return (
    <div className="w-full py-4 md:py-6 px-4 lg:px-12 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-center md:items-center gap-3 md:gap-0">
        <motion.div 
          className="flex items-center justify-between mb-3 md:mb-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
              <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 md:mr-4 hover:bg-gray-100"
            onClick={() => setShowMobileFilter(!showMobileFilter)}
          >
            <Menu color="gray" />
          </Button>

          <h3 className="font-semibold text-gray-1 text-lg md:text-xl mr-4 md:mr-8 font-['Nunito_Sans',Helvetica] whitespace-nowrap">
            Фильтры
          </h3>


          </div>
          <div className="flex items-center">
              <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 md:mr-4 hover:bg-gray-100"
            onClick={toggleFiltersVisibility}
          >
            <ArrowDown  color="gray" />
          </Button>
               <h3 className="font-semibold text-gray-1 text-lg md:text-xl mr-4 md:mr-8 font-['Nunito_Sans',Helvetica] whitespace-nowrap">
            По группам
          </h3>
          </div>
        
        
        </motion.div>

        <div className={`flex flex-wrap gap-2 md:flex md:gap-3 lg:gap-4 overflow-x-auto pb-2 md:pb-0 transition-all duration-300 ${filters.showFilters ? 'block' : 'hidden md:flex'}`}>
          {filters.categories.map((category, index) => (
            <div
              key={category}
            >
              <Button
                variant="outline"
                className={`h-[35px] md:h-[38px] px-3 md:px-4 py-1 md:py-2 rounded-full text-sm md:text-base font-medium whitespace-nowrap  ${
                  category === filters.activeCategory
                    ? "bg-blue-4 text-[#333333] border-blue-4 shadow-md"
                    : "bg-[#aaaaaa1a] text-[#333333] border-[#aaaaaa40] hover:border-blue-4 "
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};