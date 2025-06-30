import { Link } from 'react-router-dom';
import { useCart } from '../../lib/context/CartContext';
import { Grid2x2Plus, Heart, Menu, ShoppingBag, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import cn from 'classnames';

export const NavSection = (): JSX.Element => {
  const { totalPrice } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const copyToClipBoard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="text-white m-[20px] relative">
      <div className="bg-skyblue border-[2px] border-blue rounded-t-[8px]">
        <div className="container flex justify-center md:justify-between items-center gap-[42.5px]">
          <div className="flex items-center gap-[40px]">
            <Link to="/" className="flex items-center">
              <img alt="Logo" src={'/Logo.png'} className="max-w-[60px] max-h-[80px]" />
            </Link>

            <div>
              <Link to="/catalog">
                <button
                  className="
                    bg-blue
                    hover:bg-blue-700 
                    active:bg-blue-800 
                    focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                    flex items-center gap-2.5 
                    px-4 py-2.5 
                    rounded-lg
                    text-white 
                    font-medium
                    transition-all duration-200 ease-in-out
                    shadow-md hover:shadow-lg
                    transform hover:-translate-y-0.5 active:translate-y-0
                    border border-blue-700
                    group
                  "
                >
                  <Grid2x2Plus
                    className="
                      w-5 h-5
                      transition-transform duration-200
                      group-hover:scale-110
                    "
                  />
                  <span className="pr-7">Каталог</span>
                </button>
              </Link>
            </div>
          </div>

          <div className="lg:flex hidden">
            <ul className="text-[#333333] font-bold flex items-center justify-center gap-[50px]">
              <li>
                <Link to={'/'}>Главная</Link>
              </li>
              <li>
                <Link to={'/contacts'}>Контакты</Link>
              </li>
              <li>
                <Link to={'/cart'}>Корзина</Link>
              </li>
              <li>
                <button className={cn(`${isCopied && 'text-blue'}`)} onClick={() => copyToClipBoard('+7 961 775 7144')}>
                  {isCopied ? 'Copied!' : '+7 961 775 7144 '}
                </button>
              </li>
            </ul>
          </div>

          <div className="md:flex hidden items-center justify-center gap-[20px]">
              <Link to={'/favorites'}>
              <div className="gap-[8px] flex items-center">
                <Heart color="#333333" />
              </div>
            </Link>
            <Link to={'/cart'}>
              <div className="gap-[8px] flex items-center">
                <ShoppingBag color="#333333" />
                <button className="bg-blue lg:flex hidden gap-[10px] p-[5px] font-light rounded-[8px]">
                  {totalPrice} р.
                </button>
              </div>
            </Link>
          </div>

          <button onClick={toggleMenu} className="md:hidden ">
            {isMenuOpen ? <X color="#333333" size={24} /> : <Menu color="#333333" size={24} />}
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white z-50 shadow-lg rounded-b-lg border border-blue">
          <ul className="py-4 px-6 space-y-4  text-[#333333] font-bold ">
            <li>
              <Link to={'/'} onClick={toggleMenu}>
                Главная
              </Link>
            </li>
            <li>
              <Link to={'/contacts'}  onClick={toggleMenu}>
                Контакты
              </Link>
            </li>
            <li>
              <Link to={'/cart'} onClick={toggleMenu}>
                Корзина
              </Link>
            </li>
            <li>
              <button className={cn(`${isCopied && 'text-blue'}`)} onClick={() => copyToClipBoard('+7 961 775 7144')}>
                {isCopied ? 'Copied!' : '+7 961 775 7144 '}
              </button>
            </li>
          </ul>
        </div>
      )}

      <div className="bg-blue py-[16px] rounded-b-[8px]">
        <div>
          <ul className="text-white font-semibold uppercase flex flex-wrap items-center justify-center gap-[20px]">
            <li>
              <Link to={'/catalog'}>SUP</Link>
            </li>
            <li>
              <Link to={'/catalog'}>Комплектующие</Link>
            </li>
            <li>
              <Link to={'/catalog'}>Аренда</Link>
            </li>
            <li>
              <Link to={'/catalog'}>Товары для туризма и отдыха</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
