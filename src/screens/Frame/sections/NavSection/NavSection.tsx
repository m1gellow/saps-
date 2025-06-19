import { AnimatePresence, motion } from "framer-motion";
import { HeartIcon, MenuIcon, PhoneIcon, ShoppingCartIcon, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../../../lib/context/CartContext";
import { useFavorites } from "../../../../lib/context/FavoritesContext";

export const NavSection = ({ showMobileMenu, setShowMobileMenu }: {showMobileMenu: boolean, setShowMobileMenu: (arg1: boolean) => void}): JSX.Element => {
  const { totalItems } = useCart();
  const { totalFavorites } = useFavorites();
  // const { setShowProfileModal, isAuthenticated } = useProfile();
  const location = useLocation();

  // Navigation menu items
  const navItems = [
    { label: "Главная", href: "/", active: location.pathname === "/" },
    { label: "Каталог", href: "/catalog", active: location.pathname === "/catalog" },
    { label: "Контакты", href: "/contacts", active: location.pathname === "/contacts" },
    { label: "Корзина", href: "/cart", active: location.pathname === "/cart" },  
  ];

  // Анимация для мобильного меню
  const menuVariants = {
    open: { 
      opacity: 1, 
      height: "auto",
      transition: { 
        duration: 0.3,
      }
    },
    closed: { 
      opacity: 0, 
      height: 0,
    }
  };

  const itemVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -20 }
  };

  return (
    <header className="w-full h-auto min-h-[52px] bg-[#333333]">
        
      {/* Logo */}
      <div className="container  mx-auto px-4 relative flex justify-between items-center">
        
        <Link to="/" className="flex items-center  ">
          <img
            className="h-16 w-16"
            alt="Logo"
            src="/1--1--2.png"
          />
          <div className="font-extrabold italic text-white text-lg tracking-[0] leading-5">
            Волны&amp;Горы
          </div>
        </Link>

        {/* Center  */}
        <nav className="hidden md:flex items-center gap-[25px]">
          {navItems.map((item, index) => (
            <div
              key={index}
            >
              <Link
                to={item.href}
                className={`w-fit font-normal text-[15px] tracking-[0] leading-normal transition-colors ${
                  item.active ? "text-blue-4 underline" : "text-[#ffffff] hover:text-blue-4"
                }`}
              >
                {item.label}
              </Link>
            </div>
          ))}
        </nav>

        
        {/* Right */}
        <div className="flex gap-6 ">
           <div 
          className="hidden md:flex items-center gap-2.5"
        >
          <PhoneIcon className="w-[14.01px] h-3.5 text-white" />
          <span className="w-fit font-normal text-[#ffffff] text-sm tracking-[0] leading-normal">
            +7 961 775 7144
          </span>

        </div>

          
        <div className="hidden md:flex items-end gap-[15px]">
          <div 
            className="relative w-[29px] h-6 cursor-pointer"
          >
            <Link to="/cart" className="block">
              <div className="relative w-[31px] h-6">
                <ShoppingCartIcon className="w-6 h-6 text-white" />
                <div className="absolute w-4 h-4 top-0 right-0">
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <div className="text-gray-1 font-bold text-[8px]">
                      {totalItems}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div 
            className="relative w-[29px] h-6 cursor-pointer"
          >
            <Link to="/favorites" className="block">
              <div className="relative w-[31px] h-6">
                <HeartIcon className="w-6 h-6 text-white" />
                <div className="absolute w-4 h-4 top-0 right-0">
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <div className="text-gray-1 font-bold text-[8px]">
                      {totalFavorites}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        </div>
        
  

        {/* Mobile menu button */}
        <motion.button 
          className="md:hidden flex flex-col items-center justify-center gap-1 p-2"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          whileTap={{ scale: 0.95 }}
        >
          {showMobileMenu ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MenuIcon className="w-6 h-6 text-white" />
          )}
        </motion.button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="md:hidden overflow-hidden absolute w-full bg-blue-4 z-50"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="px-4 py-3">
              <nav className="flex flex-col space-y-3">
                {navItems.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                  >
                    <Link
                      to={item.href}
                      className="w-fit font-normal text-[15px] py-2 block text-white"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div 
                  className="flex items-center gap-2.5 py-2"
                  variants={itemVariants}
                >
                  <PhoneIcon className="w-[14.01px] h-3.5 text-white" />
                  <span className="w-fit font-medium text-white text-sm">
                    +7 961 775 7144
                  </span>
                </motion.div>
                <motion.div 
                  className="flex justify-between items-center py-2"
                  variants={itemVariants}
                >
                 
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};


