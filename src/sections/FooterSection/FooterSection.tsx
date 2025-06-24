import { MailIcon, MapPinIcon, PhoneIcon, SendIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const FooterSection = (): JSX.Element => {
  // Navigation links data
  const navLinks = [
    { title: 'Главная', href: '/' },
    { title: 'Каталог', href: '/catalog' },
    { title: 'Контакты', href: '/contacts' },
    { title: 'Корзина', href: '/cart' },
  ];

  // Contact information data
  const contactInfo = [
    {
      icon: <MapPinIcon className="w-4 h-5 text-blue-4" />,
      text: 'г. Москва, р. Академический, ул.Евгения Савкова д.6',
    },
    {
      icon: <PhoneIcon className="w-4 h-4 text-blue-4" />,
      text: '+7 (343) 236-63-11',
    },
    {
      icon: <MailIcon className="w-4 h-4 text-blue-4" />,
      text: 'volnyigory@mail.ru',
    },
  ];

  return (
    <footer className="relative w-full mt-8 md:mt-16 bg-gray-50">
      <div className="relative">
        {/* Волнистая форма для фона */}
        <svg className="w-full h-24 fill-blue-4 opacity-20" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,0 C320,100 420,0 740,50 C1060,100 1360,0 1440,0 L1440,100 L0,100 Z"></path>
        </svg>

        {/* Main footer content */}
        <div className="w-full bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
              {/* Navigation links */}
              <motion.div
                className="flex flex-col items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="font-semibold text-xl text-gray-1 mb-2">Навигация</h3>
                {navLinks.map((link, index) => (
                  <motion.div key={index} whileHover={{ x: 3 }}>
                    <Link
                      to={link.href}
                      className="font-normal text-gray-600 hover:text-blue-4 transition-colors text-[15px]"
                    >
                      {link.title}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {/* Logo */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <img className="w-[120px] h-[120px] object-contain" alt="Волны и Горы" src="/1--1--2.png" />
                <h2 className="font-extrabold italic text-gray-1 text-2xl mt-2">Волны&amp;Горы</h2>
                <p className="text-gray-500 text-sm text-center mt-2">Лучшие SUP доски для активного отдыха на воде</p>
              </motion.div>

              {/* Contact information */}
              <motion.div
                className="flex flex-col items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="font-semibold text-xl text-gray-1 mb-2">Контакты</h3>
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-[35px] h-[35px] bg-[#17ccc533] rounded-full flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div className="font-normal text-gray-600 text-[15px]">{item.text}</div>
                  </div>
                ))}
              </motion.div>

              {/* Contact form */}
              <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="font-semibold text-xl text-gray-1 mb-2">Заказать подбор доски</h3>
                <p className="text-gray-600 text-sm text-center">Оставьте свой номер телефона и мы вам перезвоним</p>

                <div className="relative w-full">
                  <Input
                    className="h-12 rounded-full pl-4 pr-12 border-gray-300 focus:border-blue-4 focus:ring focus:ring-blue-4 focus:ring-opacity-50"
                    placeholder="Ваш телефон"
                    type="tel"
                  />
                  <Button
                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 bg-blue-4"
                    size="icon"
                  >
                    <SendIcon className="w-4 h-4 text-white" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Checkbox id="terms" className="w-4 h-4 rounded-sm data-[state=checked]:bg-blue-4 border-gray-300" />
                  <label htmlFor="terms" className="text-xs text-gray-500">
                    <span>Я согласен на обработку моих </span>
                    <span className="text-blue-4 underline cursor-pointer">персональных данных</span>
                  </label>
                </div>
              </motion.div>
            </div>

            {/* Copyright */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center text-gray-500 text-sm">
              <p>© 2025 Волны&amp;Горы. Все права защищены.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
