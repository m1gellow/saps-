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
      icon: <MapPinIcon className="w-4 h-5 text-blue" />,
      text: 'г. Москва, р. Академический, ул.Евгения Савкова д.6',
    },
    {
      icon: <PhoneIcon className="w-4 h-4 text-blue" />,
      text: '+7 (343) 236-63-11',
    },
    {
      icon: <MailIcon className="w-4 h-4 text-blue" />,
      text: 'volnyigory@mail.ru',
    },
  ];

  return (
    <footer className="relative w-full mt-16 bg-gray-50 border-t border-gray-100">
      {/* Main footer content */}
      <div className="w-full bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Navigation links */}
            <motion.div
              className="flex flex-col items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Навигация</h3>
              {navLinks.map((link, index) => (
                <motion.div key={index} whileHover={{ x: 3 }}>
                  <Link
                    to={link.href}
                    className="font-normal text-gray-600 hover:text-blue transition-colors text-sm"
                  >
                    {link.title}
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Logo */}
            <motion.div
              className="flex flex-col items-center md:items-start"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <img className="w-24 h-24 object-contain" alt="Волны и Горы" src="/Logo.png" />
              <h2 className="font-bold text-gray-900 text-xl mt-2">Волны&amp;Горы</h2>
              <p className="text-gray-500 text-sm text-center md:text-left mt-2">
                Лучшие SUP доски для активного отдыха на воде
              </p>
            </motion.div>

            {/* Contact information */}
            <motion.div
              className="flex flex-col items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Контакты</h3>
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue/10 rounded-full flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div className="font-normal text-gray-600 text-sm">{item.text}</div>
                </div>
              ))}
            </motion.div>

            {/* Contact form */}
            <motion.div
              className="flex flex-col items-center md:items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Заказать подбор доски</h3>
              <p className="text-gray-600 text-sm text-center md:text-left">
                Оставьте свой номер телефона и мы вам перезвоним
              </p>

              <div className="relative w-full">
                <Input
                  className="h-12 rounded-lg pl-4 pr-12 border-gray-300 focus:border-blue focus:ring-2 focus:ring-blue focus:ring-opacity-50"
                  placeholder="Ваш телефон"
                  type="tel"
                />
                <Button
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg w-10 h-10 bg-blue hover:bg-blue/90"
                  size="icon"
                >
                  <SendIcon className="w-4 h-4 text-white" />
                </Button>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Checkbox 
                  id="terms" 
                  className="w-4 h-4 rounded-sm data-[state=checked]:bg-blue border-gray-300" 
                />
                <label htmlFor="terms" className="text-xs text-gray-500">
                  <span>Я согласен на обработку моих </span>
                  <span className="text-blue underline cursor-pointer">персональных данных</span>
                </label>
              </div>
            </motion.div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-6 border-t border-gray-100 text-center text-gray-500 text-sm">
            <p>© 2025 Волны&amp;Горы. Все права защищены.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};