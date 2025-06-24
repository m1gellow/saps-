import { Link } from 'react-router-dom';
import { useCart } from '../../lib/context/CartContext';
import { Grid2x2Plus, Menu, ShoppingBag, UserRound } from 'lucide-react';

export const NavSection = (): JSX.Element => {
  const { totalItems } = useCart();

  return (
    <div className="text-white m-[20px]">
      <div className="bg-skyblue border-[2px]   border-blue rounded-t-[8px]">
        <div className="container flex md:justify-center justify-between items-center gap-[42.5px]">
          <div className="flex items-center gap-[40px]">
            <Link to="/" className="flex items-center">
              <img alt="Logo" src={'/Logo.png'} className="max-w-[60px] max-h-[80px]" />
            </Link>

            <div>
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
            </div>
          </div>

          <div className="lg:flex hidden">
            <ul className="text-[#333333]  font-bold flex items-center justify-center gap-[20px]">
              <li>
                <Link to={'/'}>Главная</Link>
              </li>
              <li>
                <Link to={'/'}>Покупателю</Link>
              </li>
              <li>
                <Link to={'/'}>Акции</Link>
              </li>
              <li>
                <Link to={'/'}>Доставка и оплата</Link>
              </li>
              <li>
                <Link to={'/'}>Контакты</Link>
              </li>
              <li>
                <Link to={'/'}>+7 961 775 7144</Link>
              </li>
            </ul>
          </div>

          <div className="md:flex hidden items-center justify-center gap-[20px]">
            <UserRound color="#333333" />
            <div className="gap-[8px] flex items-center">
              <ShoppingBag color="#333333" />
              <button className="bg-blue lg:flex hidden gap-[10px] p-[5px] font-light rounded-[8px]">3 000P</button>
            </div>
            
          </div>
          <Menu className='md:hidden' color="#333333"/>
        </div>
      </div>

      <div className="bg-blue py-[16px] rounded-b-[8px]">
        <div>
          <ul className="text-white  font-semibold uppercase flex flex-wrap items-center justify-center gap-[20px]">
            <li>
              <Link to={'/'}>SUP</Link>
            </li>
            <li>
              <Link to={'/'}>Комплектующие</Link>
            </li>
            <li>
              <Link to={'/'}>Аренда</Link>
            </li>
            <li>
              <Link to={'/'}>Товары для туризма и отдыха</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
