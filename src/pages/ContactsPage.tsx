import React from 'react';
import { motion } from 'framer-motion';
import { MailIcon, MapPinIcon, PhoneIcon, SendIcon, Instagram, Facebook, Youtube } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export const ContactsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Контакты</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Наши контакты</h2>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-4 bg-opacity-20 rounded-full flex items-center justify-center">
                <MapPinIcon className="w-5 h-5 text-blue-4" />
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Адрес</h3>
                <p className="text-gray-600">г. Москва, р. Академический, ул.Евгения Савкова д.6</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-4 bg-opacity-20 rounded-full flex items-center justify-center">
                <PhoneIcon className="w-5 h-5 text-blue-4" />
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Телефон</h3>
                <p className="text-gray-600">+7 (343) 236-63-11</p>
                <p className="text-gray-600">+7 961 775 7144</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-4 bg-opacity-20 rounded-full flex items-center justify-center">
                <MailIcon className="w-5 h-5 text-blue-4" />
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Email</h3>
                <p className="text-gray-600">volnyigory@mail.ru</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-700 mb-3">Мы в социальных сетях</h3>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  className="w-10 h-10 bg-blue-4 bg-opacity-20 rounded-full flex items-center justify-center text-blue-4"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(29, 197, 183, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Instagram className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="#"
                  className="w-10 h-10 bg-blue-4 bg-opacity-20 rounded-full flex items-center justify-center text-blue-4"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(29, 197, 183, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Facebook className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="#"
                  className="w-10 h-10 bg-blue-4 bg-opacity-20 rounded-full flex items-center justify-center text-blue-4"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(29, 197, 183, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Youtube className="w-5 h-5" />
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Напишите нам</h2>

          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Ваше имя
              </label>
              <Input
                id="name"
                type="text"
                className="w-full rounded-lg border-gray-300 focus:border-blue-4 focus:ring focus:ring-blue-4 focus:ring-opacity-50"
                placeholder="Иван Иванов"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                className="w-full rounded-lg border-gray-300 focus:border-blue-4 focus:ring focus:ring-blue-4 focus:ring-opacity-50"
                placeholder="example@mail.ru"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Телефон
              </label>
              <Input
                id="phone"
                type="tel"
                className="w-full rounded-lg border-gray-300 focus:border-blue-4 focus:ring focus:ring-blue-4 focus:ring-opacity-50"
                placeholder="+7 (___) ___ __ __"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Сообщение
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full rounded-lg border border-gray-300 focus:border-blue-4 focus:ring focus:ring-blue-4 focus:ring-opacity-50 p-2"
                placeholder="Ваше сообщение..."
              ></textarea>
            </div>

            <div className="pt-2">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button className="w-full h-12 bg-blue-4 hover:bg-teal-600 rounded-full text-white flex items-center justify-center gap-2">
                  <SendIcon className="w-4 h-4" />
                  Отправить сообщение
                </Button>
              </motion.div>
            </div>
          </form>
        </motion.div>
      </div>

      <motion.div
        className="w-full h-[400px] rounded-lg overflow-hidden shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2246.7875182845306!2d37.586761415342766!3d55.687151207580424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b54cf65f5c8955%3A0x694710ccd55501e!2z0YPQuy4g0JXQstCz0LXQvdC40Y8g0KHQsNCy0LrQvtCy0LAsIDYsINCc0L7RgdC60LLQsCwgMTE3NDQ3!5e0!3m2!1sru!2sru!4v1617356078107!5m2!1sru!2sru"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Карта расположения магазина"
        ></iframe>
      </motion.div>
    </div>
  );
};
