import React, { useState, useEffect } from "react";
import { MainContentSection } from "../screens/Frame/sections/MainContentSection/MainContentSection";
import { SupRentalSection } from "../screens/Frame/sections/SupRentalSection";
import { SearchBar } from "../components/Search/SearchBar";
import { ProductCard } from "../components/ProductCard/ProductCard";
import { useFilters } from "../lib/context/FilterContext";
import { Button } from "../components/ui/button";
import { FilterIcon, ChevronDownIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../lib/context/CartContext";
import { RecommendedProducts } from "../components/ProductCard/RecommendedProducts";
import { getAllProducts } from "../lib/api/products";
import { Product } from "../lib/types";
import { FilterSideBar } from "../components/FilterSideBar/FilterSideBar";
import { SortOptions } from "../components/SortOptions/SortOptions";
import { Pagination } from "../components/Pagination/Pagination";



export const HomePage: React.FC = () => {
  const { filters, toggleBrandFilter, setPriceRange, resetFilters, getFilteredPrice } = useFilters();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);

  // Загрузка продуктов при монтировании компонента
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const products = await getAllProducts();
        setAllProducts(products);
        
        // Популярные товары (первые 6)
        setPopularProducts(products.slice(0, 6));
        
        // Новые поступления (следующие 4)
        setNewProducts(products.slice(6, 10));
        
        setIsLoading(false);
      } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

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
    <>
      <MainContentSection />
      
      {/* Main content */}
      <div className="container mx-auto mt-[6rem] px-4 lg:px-6 2xl:px-0">

        <SearchBar 
          onSearch={handleSearch}
          products={allProducts}
        />
        

        <SupRentalSection showMobileFilter={showMobileFilter} setShowMobileFilter={setShowMobileFilter}/>
        <SortOptions handleSortClick={handleSortClick} sortOrder={sortOrder}/>

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
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-4"></div>
              </div>
            ) : (
              <>
                {/* Популярные товары */}
                {popularProducts.length > 0 && (
                  <RecommendedProducts 
                    title="Популярные товары"
                    products={popularProducts}
                  />
                )}

                {/* Отфильтрованные товары */}
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

                {/* Новые поступления */}
                {newProducts.length > 0 && (
                  <RecommendedProducts 
                    title="Новые поступления"
                    products={newProducts}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Pagination */}
             <Pagination filteredProducts={filteredProducts}/>
             </div>
    </>
  );
};


