import React from 'react';
import { motion } from 'framer-motion';
import { MailIcon, MapPinIcon, PhoneIcon, SendIcon, Instagram, Facebook, Youtube } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export const ContactsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Заголовок с анимацией */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Свяжитесь с нами</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Мы всегда рады помочь вам с выбором SUP-доски и ответить на все ваши вопросы
        </p>
      </motion.div>

      {/* Основной контент */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Контактная информация */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">
            Наши контакты
          </h2>

          <div className="space-y-8">
            {/* Адрес */}
            <motion.div 
              className="flex items-start gap-6 group"
              whileHover={{ x: 5 }}
            >
              <div className="flex-shrink-0 w-14 h-14 bg-blue/10 rounded-xl flex items-center justify-center group-hover:bg-blue/20 transition-colors">
                <MapPinIcon className="w-6 h-6 text-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Адрес магазина</h3>
                <p className="text-gray-600">г. Москва, р. Академический, ул.Евгения Савкова д.6</p>
                <p className="text-blue text-sm mt-2 cursor-pointer hover:underline">
                  Посмотреть на карте →
                </p>
              </div>
            </motion.div>

            {/* Телефоны */}
            <motion.div 
              className="flex items-start gap-6 group"
              whileHover={{ x: 5 }}
            >
              <div className="flex-shrink-0 w-14 h-14 bg-blue/10 rounded-xl flex items-center justify-center group-hover:bg-blue/20 transition-colors">
                <PhoneIcon className="w-6 h-6 text-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Телефоны</h3>
                <div className="space-y-1">
                  <a href="tel:+73432366311" className="block text-gray-600 hover:text-blue transition-colors">
                    +7 (343) 236-63-11
                  </a>
                  <a href="tel:+79617757144" className="block text-gray-600 hover:text-blue transition-colors">
                    +7 961 775 7144
                  </a>
                </div>
                <p className="text-gray-400 text-sm mt-2">Ежедневно с 9:00 до 21:00</p>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div 
              className="flex items-start gap-6 group"
              whileHover={{ x: 5 }}
            >
              <div className="flex-shrink-0 w-14 h-14 bg-blue/10 rounded-xl flex items-center justify-center group-hover:bg-blue/20 transition-colors">
                <MailIcon className="w-6 h-6 text-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Электронная почта</h3>
                <a 
                  href="mailto:volnyigory@mail.ru" 
                  className="text-gray-600 hover:text-blue transition-colors"
                >
                  volnyigory@mail.ru
                </a>
                <p className="text-gray-400 text-sm mt-2">Отвечаем в течение 24 часов</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Форма обратной связи */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">
            Напишите нам
          </h2>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Ваше имя
                </label>
                <Input
                  id="name"
                  type="text"
                  className="w-full rounded-xl border-gray-300 focus:border-blue focus:ring-2 focus:ring-blue/20 h-12"
                  placeholder="Иван Иванов"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон
                </label>
                <Input
                  id="phone"
                  type="tel"
                  className="w-full rounded-xl border-gray-300 focus:border-blue focus:ring-2 focus:ring-blue/20 h-12"
                  placeholder="+7 (___) ___ __ __"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                className="w-full rounded-xl border-gray-300 focus:border-blue focus:ring-2 focus:ring-blue/20 h-12"
                placeholder="example@mail.ru"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Сообщение
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full rounded-xl border border-gray-300 focus:border-blue focus:ring-2 focus:ring-blue/20 p-4"
                placeholder="Расскажите, чем мы можем вам помочь..."
              ></textarea>
            </div>

            <div className="flex items-center">
              <input
                id="consent"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue focus:ring-blue"
              />
              <label htmlFor="consent" className="ml-2 block text-sm text-gray-600">
                Я согласен на обработку персональных данных
              </label>
            </div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pt-2"
            >
              <Button 
                type="submit" 
                className="w-full h-14 bg-blue hover:bg-blue/90 text-white rounded-xl text-lg font-medium"
              >
                <SendIcon className="w-5 h-5 mr-2" />
                Отправить сообщение
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>

      {/* Карта */}
      <motion.div
        className="w-full h-[500px] rounded-2xl overflow-hidden shadow-xl relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue/10 to-white/30 z-10 pointer-events-none"></div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2246.7875182845306!2d37.586761415342766!3d55.687151207580424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b54cf65f5c8955%3A0x694710ccd55501e!2z0YPQuy4g0JXQstCz0LXQvdC40Y8g0KHQsNCy0LrQvtCy0LAsIDYsINCc0L7RgdC60LLQsCwgMTE3NDQ3!5e0!3m2!1sru!2sru!4v1617356078107!5m2!1sru!2sru"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          className="absolute inset-0"
          title="Карта расположения магазина"
        ></iframe>
        <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-md px-4 py-3">
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-blue" />
            <span className="font-medium text-gray-900">ул.Евгения Савкова д.6</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};