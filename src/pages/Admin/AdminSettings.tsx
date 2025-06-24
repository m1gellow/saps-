import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw, Check, AlertTriangle, Shield, Server, Database, Truck, CreditCard } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';

export const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // Демонстрационные настройки
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Волны&Горы',
    siteDescription: 'Продажа и аренда SUP в Екатеринбурге',
    contactEmail: 'volnyigory@mail.ru',
    contactPhone: '+7 (343) 236-63-11',
    address: 'г. Москва, р. Академический, ул.Евгения Савкова д.6',
    currency: 'RUB',
  });

  const [deliverySettings, setDeliverySettings] = useState({
    enableFreeDelivery: true,
    freeDeliveryThreshold: 10000,
    deliveryMethods: [
      { id: 'cdek', name: 'СДЭК', enabled: true, price: 300 },
      { id: 'russian_post', name: 'Почта России', enabled: true, price: 250 },
      { id: 'yandex_taxi', name: 'Яндекс Такси', enabled: true, price: 400 },
    ],
  });

  const [paymentSettings, setPaymentSettings] = useState({
    paymentMethods: [
      { id: 'card', name: 'Банковская карта', enabled: true },
      { id: 'sbp', name: 'СБП', enabled: true },
      { id: 'cash', name: 'Наличными при получении', enabled: false },
    ],
  });

  const [notificationSettings, setNotificationSettings] = useState({
    enableOrderNotifications: true,
    enableLowStockNotifications: true,
    notificationEmail: 'volnyigory@mail.ru',
    enableCustomerNotifications: true,
  });

  // Обработка сохранения настроек
  const handleSaveSettings = () => {
    // В реальном приложении здесь был бы API-запрос
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  // Обработка изменения полей настроек
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: value,
    });
  };

  const handleDeliveryMethodToggle = (methodId: string) => {
    setDeliverySettings({
      ...deliverySettings,
      deliveryMethods: deliverySettings.deliveryMethods.map((method) =>
        method.id === methodId ? { ...method, enabled: !method.enabled } : method,
      ),
    });
  };

  const handleDeliveryMethodPriceChange = (methodId: string, price: string) => {
    setDeliverySettings({
      ...deliverySettings,
      deliveryMethods: deliverySettings.deliveryMethods.map((method) =>
        method.id === methodId ? { ...method, price: parseInt(price) || 0 } : method,
      ),
    });
  };

  const handlePaymentMethodToggle = (methodId: string) => {
    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: paymentSettings.paymentMethods.map((method) =>
        method.id === methodId ? { ...method, enabled: !method.enabled } : method,
      ),
    });
  };

  const handleNotificationChange = (field: string, value: boolean | string) => {
    setNotificationSettings({
      ...notificationSettings,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Настройки</h1>
        <Button
          className="bg-blue-4 hover:bg-teal-600 text-white rounded-full flex items-center gap-2"
          onClick={handleSaveSettings}
        >
          <Save size={16} />
          Сохранить изменения
        </Button>
      </div>

      {/* Сообщение о сохранении */}
      <AnimatePresence>
        {showSavedMessage && (
          <motion.div
            className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-md flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Check size={18} className="mr-2" />
            Настройки успешно сохранены
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap flex items-center ${
              activeTab === 'general' ? 'text-blue-4 border-b-2 border-blue-4' : 'text-gray-600 hover:text-blue-4'
            }`}
            onClick={() => setActiveTab('general')}
          >
            <Server size={16} className="mr-2" />
            Общие
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap flex items-center ${
              activeTab === 'delivery' ? 'text-blue-4 border-b-2 border-blue-4' : 'text-gray-600 hover:text-blue-4'
            }`}
            onClick={() => setActiveTab('delivery')}
          >
            <Truck size={16} className="mr-2" />
            Доставка
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap flex items-center ${
              activeTab === 'payment' ? 'text-blue-4 border-b-2 border-blue-4' : 'text-gray-600 hover:text-blue-4'
            }`}
            onClick={() => setActiveTab('payment')}
          >
            <CreditCard size={16} className="mr-2" />
            Оплата
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap flex items-center ${
              activeTab === 'notifications' ? 'text-blue-4 border-b-2 border-blue-4' : 'text-gray-600 hover:text-blue-4'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            <Shield size={16} className="mr-2" />
            Уведомления
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap flex items-center ${
              activeTab === 'maintenance' ? 'text-blue-4 border-b-2 border-blue-4' : 'text-gray-600 hover:text-blue-4'
            }`}
            onClick={() => setActiveTab('maintenance')}
          >
            <Database size={16} className="mr-2" />
            Техническое обслуживание
          </button>
        </div>

        <div className="p-6">
          {/* Общие настройки */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Общие настройки</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Название сайта</label>
                  <Input type="text" name="siteName" value={generalSettings.siteName} onChange={handleGeneralChange} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Описание сайта</label>
                  <Input
                    type="text"
                    name="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={handleGeneralChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Контактный email</label>
                  <Input
                    type="email"
                    name="contactEmail"
                    value={generalSettings.contactEmail}
                    onChange={handleGeneralChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Контактный телефон</label>
                  <Input
                    type="text"
                    name="contactPhone"
                    value={generalSettings.contactPhone}
                    onChange={handleGeneralChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
                  <Input type="text" name="address" value={generalSettings.address} onChange={handleGeneralChange} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Валюта</label>
                  <select
                    name="currency"
                    value={generalSettings.currency}
                    onChange={handleGeneralChange}
                    className="w-full h-10 pl-3 pr-10 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-4"
                  >
                    <option value="RUB">Российский рубль (₽)</option>
                    <option value="USD">Доллар США ($)</option>
                    <option value="EUR">Евро (€)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Настройки доставки */}
          {activeTab === 'delivery' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Настройки доставки</h2>

              <div className="p-4 bg-gray-50 rounded-md border border-gray-200 mb-6">
                <div className="flex items-center mb-4">
                  <Checkbox
                    id="enableFreeDelivery"
                    checked={deliverySettings.enableFreeDelivery}
                    onCheckedChange={(checked) =>
                      setDeliverySettings({
                        ...deliverySettings,
                        enableFreeDelivery: !!checked,
                      })
                    }
                    className="h-4 w-4 border-gray-300 rounded"
                  />
                  <label htmlFor="enableFreeDelivery" className="ml-2 text-sm text-gray-700">
                    Включить бесплатную доставку при сумме заказа выше порога
                  </label>
                </div>

                {deliverySettings.enableFreeDelivery && (
                  <div className="ml-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Порог бесплатной доставки (₽)
                    </label>
                    <Input
                      type="number"
                      value={deliverySettings.freeDeliveryThreshold}
                      onChange={(e) =>
                        setDeliverySettings({
                          ...deliverySettings,
                          freeDeliveryThreshold: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full md:w-1/3"
                    />
                  </div>
                )}
              </div>

              <h3 className="text-md font-medium text-gray-700 mb-3">Способы доставки</h3>

              <div className="space-y-4">
                {deliverySettings.deliveryMethods.map((method) => (
                  <div key={method.id} className="p-4 bg-white rounded-md border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Checkbox
                          id={`method-${method.id}`}
                          checked={method.enabled}
                          onCheckedChange={() => handleDeliveryMethodToggle(method.id)}
                          className="h-4 w-4 border-gray-300 rounded"
                        />
                        <label htmlFor={`method-${method.id}`} className="ml-2 text-sm font-medium text-gray-700">
                          {method.name}
                        </label>
                      </div>
                      <div className="flex items-center">
                        <label className="text-sm text-gray-600 mr-2">Стоимость:</label>
                        <Input
                          type="number"
                          value={method.price}
                          onChange={(e) => handleDeliveryMethodPriceChange(method.id, e.target.value)}
                          className="w-24 text-right"
                          disabled={!method.enabled}
                        />
                        <span className="ml-2 text-sm text-gray-600">₽</span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="p-4 bg-gray-50 rounded-md border border-dashed border-gray-300 text-center">
                  <button className="text-blue-4 text-sm font-medium hover:underline">
                    + Добавить новый способ доставки
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Настройки оплаты */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Настройки оплаты</h2>

              <h3 className="text-md font-medium text-gray-700 mb-3">Способы оплаты</h3>

              <div className="space-y-4">
                {paymentSettings.paymentMethods.map((method) => (
                  <div key={method.id} className="p-4 bg-white rounded-md border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Checkbox
                          id={`payment-${method.id}`}
                          checked={method.enabled}
                          onCheckedChange={() => handlePaymentMethodToggle(method.id)}
                          className="h-4 w-4 border-gray-300 rounded"
                        />
                        <label htmlFor={`payment-${method.id}`} className="ml-2 text-sm font-medium text-gray-700">
                          {method.name}
                        </label>
                      </div>

                      <div
                        className={`px-2 py-1 text-xs rounded-full ${
                          method.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {method.enabled ? 'Активно' : 'Отключено'}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="p-4 bg-gray-50 rounded-md border border-dashed border-gray-300 text-center">
                  <button className="text-blue-4 text-sm font-medium hover:underline">
                    + Добавить новый способ оплаты
                  </button>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
                <AlertTriangle size={20} className="text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">Интеграция с платежными системами</h4>
                  <p className="text-sm text-yellow-700">
                    Для настройки интеграции с платежными системами (Stripe, PayPal и др.) обратитесь к документации или
                    в техническую поддержку.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Настройки уведомлений */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Настройки уведомлений</h2>

              <div className="p-4 bg-gray-50 rounded-md border border-gray-200 space-y-4">
                <div className="flex items-center">
                  <Checkbox
                    id="enableOrderNotifications"
                    checked={notificationSettings.enableOrderNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('enableOrderNotifications', !!checked)}
                    className="h-4 w-4 border-gray-300 rounded"
                  />
                  <label htmlFor="enableOrderNotifications" className="ml-2 text-sm text-gray-700">
                    Уведомления о новых заказах
                  </label>
                </div>

                <div className="flex items-center">
                  <Checkbox
                    id="enableLowStockNotifications"
                    checked={notificationSettings.enableLowStockNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('enableLowStockNotifications', !!checked)}
                    className="h-4 w-4 border-gray-300 rounded"
                  />
                  <label htmlFor="enableLowStockNotifications" className="ml-2 text-sm text-gray-700">
                    Уведомления о низком запасе товаров
                  </label>
                </div>

                <div className="flex items-center">
                  <Checkbox
                    id="enableCustomerNotifications"
                    checked={notificationSettings.enableCustomerNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('enableCustomerNotifications', !!checked)}
                    className="h-4 w-4 border-gray-300 rounded"
                  />
                  <label htmlFor="enableCustomerNotifications" className="ml-2 text-sm text-gray-700">
                    Отправлять уведомления клиентам о статусе заказа
                  </label>
                </div>

                <div className="pt-3 border-t border-gray-200 mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email для уведомлений администрации
                  </label>
                  <Input
                    type="email"
                    value={notificationSettings.notificationEmail}
                    onChange={(e) => handleNotificationChange('notificationEmail', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Техническое обслуживание */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Техническое обслуживание</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
                  <Database size={40} className="text-blue-4 mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Резервное копирование</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Создайте резервную копию всех данных сайта, включая товары, заказы и настройки
                  </p>
                  <Button variant="outline" className="mt-auto">
                    Создать резервную копию
                  </Button>
                </div>

                <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
                  <RefreshCw size={40} className="text-yellow-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Очистка кэша</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Очистите кэш сайта для применения всех изменений и обновления данных
                  </p>
                  <Button variant="outline" className="mt-auto">
                    Очистить кэш
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-md mt-6">
                <h3 className="text-md font-medium text-red-800 mb-2">Опасная зона</h3>
                <p className="text-sm text-red-700 mb-4">
                  Эти действия могут привести к серьезным последствиям для вашего магазина. Используйте их только в
                  случае крайней необходимости.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-300"
                  >
                    Очистить все товары
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-300"
                  >
                    Сбросить настройки
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-300"
                  >
                    Очистить все заказы
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Хелпер для AnimatePresence
const AnimatePresence: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
