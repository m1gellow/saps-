import React, { useState, useEffect, useCallback, useRef } from "react";
import { NavSection } from "./sections/NavSection";
import { FooterSection } from "./sections/FooterSection";
import { MainContentSection } from "./sections/MainContentSection/MainContentSection";
import { SupRentalSection } from "./sections/SupRentalSection";
import { SearchBar } from "../../components/Search/SearchBar";
import { CartDropdown } from "../../components/Cart/CartDropdown";
import { FavoritesDropdown } from "../../components/Favorites/FavoritesDropdown";
import { FilterProvider, useFilters } from "../../lib/context/FilterContext";
import { CartProvider, useCart } from "../../lib/context/CartContext";
import { FavoritesProvider, useFavorites } from "../../lib/context/FavoritesContext";
import { ProfileProvider, useProfile } from "../../lib/context/ProfileContext";
import { AdminProvider } from "../../lib/context/AdminContext";
import { AuthProvider } from "../../lib/context/AuthContext";
import { Product } from "../../lib/types";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { Button } from "../../components/ui/button";
import { ScrollToTop } from "../../components/ui/scroll-to-top";
import { ProfileModal } from "../../components/Profile/ProfileModal";
import { LoginModal } from "../../components/Profile/LoginModal";
import { motion, AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ShoppingCartIcon, HeartIcon, FilterIcon, ChevronDownIcon } from "lucide-react";
import { CartPage } from "../../pages/CartPage";
import { FavoritesPage } from "../../pages/FavoritesPage";
import { ContactsPage } from "../../pages/ContactsPage";
import { CatalogPage } from "../../pages/CatalogPage";
import { HomePage } from "../../pages/HomePage";
import { ProductPage } from "../../pages/ProductPage";
import { ComparePage } from "../../pages/ComparePage";
import DeliveryPage from "../../pages/DeliveryPage";
import { AdminLayout } from "../../pages/Admin/AdminLayout";
import { AdminDashboard } from "../../pages/Admin/AdminDashboard";
import { AdminLogin } from "../../pages/Admin/AdminLogin";
import { AdminProducts } from "../../pages/Admin/AdminProducts";
import { AdminOrdersPage } from "../../pages/Admin/Orders";
import { AdminContent } from "../../pages/Admin/AdminContent";
import { AdminUsers } from "../../pages/Admin/AdminUsers";
import { AdminSettings } from "../../pages/Admin/AdminSettings";
import { getAllProducts } from "../../lib/api/products";
import { useMediaQuery } from "../../lib/hooks/useMediaQuery";

const AppContent = (): JSX.Element => {
  const { filters, toggleBrandFilter, setPriceRange, resetFilters } = useFilters();
  const { totalItems, totalPrice } = useCart();
  const { totalFavorites } = useFavorites();
  const { isAuthenticated, showProfileModal, setShowProfileModal } = useProfile();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showFavoritesDropdown, setShowFavoritesDropdown] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const cartButtonRef = useRef<HTMLDivElement>(null);
  const favoritesButtonRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...products];
      
      const categoryMatch = filters.activeCategory 
        ? filtered.filter(product => product.category === filters.activeCategory)
        : filtered;
      
      const brandMatch = categoryMatch.filter(product => {
        const brandFilter = filters.brands.find(b => b.name === product.brand);
        return !brandFilter || brandFilter.checked;
      });
      
      const priceMatch = brandMatch.filter(product => 
        product.priceValue >= filters.priceRange[0] && product.priceValue <= filters.priceRange[1]
      );
      
      const searchMatch = searchQuery.trim()
        ? priceMatch.filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : priceMatch;
      
      if (sortOrder === 'asc') {
        searchMatch.sort((a, b) => a.priceValue - b.priceValue);
      } else if (sortOrder === 'desc') {
        searchMatch.sort((a, b) => b.priceValue - a.priceValue);
      }
      
      return searchMatch;
    };
    
    setFilteredProducts(applyFilters());
  }, [filters, searchQuery, sortOrder, products]);

  const toggleCartDropdown = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setShowCartDropdown(prev => !prev);
    if (showFavoritesDropdown) setShowFavoritesDropdown(false);
  }, [showFavoritesDropdown]);

  const toggleFavoritesDropdown = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setShowFavoritesDropdown(prev => !prev);
    if (showCartDropdown) setShowCartDropdown(false);
  }, [showCartDropdown]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortClick = (order: 'asc' | 'desc') => {
    setSortOrder(sortOrder === order ? null : order);
  };

  useEffect(() => {
    setShowCartDropdown(false);
    setShowFavoritesDropdown(false);
    setShowMobileMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cartButtonRef.current?.contains(e.target as Node) || 
          favoritesButtonRef.current?.contains(e.target as Node)) {
        return;
      }
      
      if (!cartButtonRef.current?.contains(e.target as Node)) {
        setShowCartDropdown(false);
      }
      
      if (!favoritesButtonRef.current?.contains(e.target as Node)) {
        setShowFavoritesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden bg-gray-50">
      <div className="relative">
        <NavSection 
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
        />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <FooterSection />

        {/* Shopping Cart and Wishlist Buttons - Desktop */}
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
          <div className="flex flex-col gap-4">
            <div 
              ref={cartButtonRef}
              className="relative cart-button"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  className="w-[52px] h-[52px] bg-gray-1 rounded-[26px] flex items-center justify-center shadow-lg"
                  onClick={toggleCartDropdown}
                >
                  <ShoppingCartIcon className="w-5 h-5 text-white" />
                </Button>
              </motion.div>
              <div className="absolute w-5 h-5 top-0 right-0 bg-white rounded-full shadow-[0px_0px_4px_#00000040] flex items-center justify-center">
                <span className="text-black font-bold text-[10px]">{totalItems}</span>
              </div>
            </div>

            <div 
              ref={favoritesButtonRef}
              className="relative favorites-button"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="outline"
                  className="w-[52px] h-[52px] rounded-[26px] border-[#828282] bg-white flex items-center justify-center"
                  onClick={toggleFavoritesDropdown}
                >
                  <HeartIcon className="w-5 h-5 text-gray-1" />
                </Button>
              </motion.div>
              <div className="absolute w-5 h-5 top-0 right-0 bg-gray-1 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">{totalFavorites}</span>
              </div>
            </div>
          </div>

          {totalItems > 0 && (
            <motion.div 
              className="absolute top-[18px] left-[-70px]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-[72px] h-[22px] bg-blue-4 rounded-[15px] shadow-[0px_5px_10px_#1960c640] flex items-center justify-center">
                <span className="text-white text-xs px-1.5">{totalPrice.toLocaleString()}р.</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Mobile Cart Buttons */}
        <div className="fixed bottom-4 right-4 flex gap-3 lg:hidden z-20">
          <div 
            ref={cartButtonRef}
            className="relative cart-button"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button 
                className="w-[56px] h-[56px] bg-gray-1 rounded-full flex items-center justify-center shadow-lg"
                onClick={toggleCartDropdown}
              >
                <ShoppingCartIcon className="w-6 h-6 text-white" />
                <div className="absolute w-5 h-5 top-0 right-0 bg-white rounded-full shadow-[0px_0px_4px_#00000040] flex items-center justify-center">
                  <span className="text-black font-bold text-[10px]">{totalItems}</span>
                </div>
              </Button>
            </motion.div>
          </div>

          <div 
            ref={favoritesButtonRef}
            className="relative favorites-button"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="outline"
                className="w-[56px] h-[56px] rounded-full border-[#828282] bg-white flex items-center justify-center shadow-md"
                onClick={toggleFavoritesDropdown}
              >
                <HeartIcon className="w-6 h-6 text-gray-1" />
                <div className="absolute w-5 h-5 top-0 right-0 bg-gray-1 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-[10px]">{totalFavorites}</span>
                </div>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Overlay */}
        <AnimatePresence>
          {(showCartDropdown || showFavoritesDropdown) && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowCartDropdown(false);
                setShowFavoritesDropdown(false);
              }}
            />
          )}
        </AnimatePresence>

        {/* Centered Dropdowns */}
        <AnimatePresence>
          {showCartDropdown && (
            <CartDropdown 
              isOpen={showCartDropdown}
              onClose={() => setShowCartDropdown(false)}
              className="fixed inset-0 m-auto w-[90vw] max-w-md max-h-[80vh] h-fit z-50"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showFavoritesDropdown && (
            <FavoritesDropdown 
              isOpen={showFavoritesDropdown}
              onClose={() => setShowFavoritesDropdown(false)}
              className="fixed inset-0 m-auto w-[90vw] max-w-md max-h-[80vh] h-fit z-50"
            />
          )}
        </AnimatePresence>

        {/* Profile Modals */}
        <ProfileModal 
          isOpen={showProfileModal && isAuthenticated} 
          onClose={() => setShowProfileModal(false)} 
        />
        
        <LoginModal 
          isOpen={showProfileModal && !isAuthenticated} 
          onClose={() => setShowProfileModal(false)} 
        />

        {/* Scroll to Top Button */}
        <ScrollToTop />
      </div>
    </div>
  );
};

export const Frame = (): JSX.Element => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <FilterProvider>
              <ProfileProvider>
                <AdminProvider>
                  <AppContent />
                </AdminProvider>
              </ProfileProvider>
            </FilterProvider>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};