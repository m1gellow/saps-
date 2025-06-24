import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFilters } from '../lib/context/FilterContext';
import { SearchBar } from '../components/Search/SearchBar';
import { Button } from '../components/ui/button';
import { RecommendedProducts } from '../components/ProductCard/RecommendedProducts';
import { getAllProducts, getProductsByCategory } from '../lib/api/products';
import { Product } from '../lib/types';
import { FilterSideBar } from '../components/FilterSideBar/FilterSideBar';

import { SortOptions } from '../components/SortOptions/SortOptions';
import { Pagination } from '../components/Pagination/Pagination';
import { SupRentalSection } from '../sections/SupRentalSection';

export const CatalogPage: React.FC = () => {
  const { filters, toggleBrandFilter, setPriceRange, resetFilters, getFilteredPrice } = useFilters();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sliderMin, setSliderMin] = useState(filters.priceRange[0]);
  const [sliderMax, setSliderMax] = useState(filters.priceRange[1]);
  const [isLoading, setIsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  
  // Загружаем все товары при инициализации
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const productsData = await getAllProducts();
        setAllProducts(productsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Загружаем товары для текущей категории
  useEffect(() => {
    if (filters.activeCategory) {
      const fetchCategoryProducts = async () => {
        try {
          const productsData = await getProductsByCategory(filters.activeCategory);
          setCategoryProducts(productsData);
        } catch (error) {
          console.error(`Ошибка при загрузке товаров категории ${filters.activeCategory}:`, error);
        }
      };
      
      fetchCategoryProducts();
    } else {
      setCategoryProducts([]);
    }
  }, [filters.activeCategory]);
  
  // Обновление локальных слайдеров при изменении фильтров
  useEffect(() => {
    setSliderMin(filters.priceRange[0]);
    setSliderMax(filters.priceRange[1]);
  }, [filters.priceRange]);

  // Filter and sort products
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...allProducts];
      
      // Category filter
      if (filters.activeCategory) {
        filtered = filtered.filter(product => product.category === filters.activeCategory);
      }
      
      // Brand filter
      filtered = filtered.filter(product => {
        const brandFilter = filters.brands.find(b => b.name === product.brand);
        return !brandFilter || brandFilter.checked;
      });
      
      // Price filter
      filtered = filtered.filter(product => 
        product.priceValue >= filters.priceRange[0] && product.priceValue <= filters.priceRange[1]
      );
      
      // Search filter
      if (searchQuery.trim()) {
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Sort by price if selected
      if (sortOrder === 'asc') {
        filtered = filtered.sort((a, b) => a.priceValue - b.priceValue);
      } else if (sortOrder === 'desc') {
        filtered = filtered.sort((a, b) => b.priceValue - a.priceValue);
      }
      
      return filtered;
    };
    
    setFilteredProducts(applyFilters());
  }, [filters, searchQuery, sortOrder, allProducts]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortClick = (order: 'asc' | 'desc') => {
    setSortOrder(sortOrder === order ? null : order);
  };


  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Каталог товаров</h1>
      
      <SearchBar 
        onSearch={handleSearch}
        products={allProducts}
      />
        <SupRentalSection showMobileFilter={showMobileFilter} setShowMobileFilter={setShowMobileFilter}/>
        <SortOptions handleSortClick={handleSortClick} sortOrder={sortOrder}/>
     

      {/* Product grid with filter sidebar */}
      <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-8 mt-2">
        {/* Filter sidebar */}
            {showMobileFilter && (
               <FilterSideBar
                  filters={filters}
                  toggleBrandFilter={toggleBrandFilter}
                  setPriceRange={setPriceRange}
                  resetFilters={resetFilters}
                  getFilteredPrice={getFilteredPrice}
                />
            )}
           

        {/* Product grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-4"></div>
            </div>
          ) : (
            <>
              {filters.activeCategory && categoryProducts.length > 0 && (
                <RecommendedProducts 
                  title={`Популярные ${filters.activeCategory}`}
                  products={categoryProducts.slice(0, 4)}
                />
              )}

              <div className="flex-1">
                              
                <AnimatePresence>
                    {filteredProducts.length > 0 && 
                     <RecommendedProducts 
                    title="Отфильтрованные товары"
                    products={filteredProducts}
                  />
                    }
                  </AnimatePresence>
                  </div>
              
              {filteredProducts.length === 0 && !isLoading && (
                <motion.div 
                  className="py-8 text-center text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-lg">Товары не найдены. Пожалуйста, измените параметры поиска.</p>
                  <Button 
                    className="mt-4 bg-blue-4 hover:bg-blue-600 text-white" 
                    onClick={resetFilters}
                  >
                    Сбросить все фильтры
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Pagination */}
          <Pagination filteredProducts={filteredProducts}/>

      
      
      {/* Рекомендуемые товары в конце страницы */}
      {filteredProducts.length > 0 && !isLoading && allProducts.length > 10 && (
        <RecommendedProducts 
          title="Вам также может понравиться"
          products={allProducts.slice(10, 16)}
        />
      )}
    </div>
  );
};