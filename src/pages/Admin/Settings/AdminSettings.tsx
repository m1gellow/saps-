import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw, Check, AlertTriangle, Shield, Server, Database, Truck, CreditCard } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Checkbox } from '../../../components/ui/checkbox';

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

  const handleSaveSettings = () => {
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

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
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Настройки магазина</h1>
          <p className="text-sm text-gray-500 mt-1">Управление параметрами вашего интернет-магазина</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 px-4 py-2 transition-colors"
          onClick={handleSaveSettings}
        >
          <Save size={18} />
          Сохранить изменения
        </Button>
      </div>

      {/* Сообщение о сохранении */}
      <AnimatePresence>
        {showSavedMessage && (
          <motion.div
            className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center shadow-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Check size={18} className="mr-2 text-green-600" />
            <span className="font-medium">Настройки успешно сохранены</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'general', icon: Server, label: 'Общие' },
            { id: 'delivery', icon: Truck, label: 'Доставка' },
            { id: 'payment', icon: CreditCard, label: 'Оплата' },
            { id: 'notifications', icon: Shield, label: 'Уведомления' },
            { id: 'maintenance', icon: Database, label: 'Обслуживание' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={16} className="opacity-80" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Общие настройки */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Server size={20} className="text-blue-600" />
                Общие настройки
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: 'siteName', label: 'Название сайта', type: 'text' },
                  { id: 'siteDescription', label: 'Описание сайта', type: 'text' },
                  { id: 'contactEmail', label: 'Контактный email', type: 'email' },
                  { id: 'contactPhone', label: 'Контактный телефон', type: 'text' },
                ].map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                    <Input
                      type={field.type as any}
                      name={field.id}
                      value={generalSettings[field.id as keyof typeof generalSettings]}
                      onChange={handleGeneralChange}
                      className="w-full"
                    />
                  </div>
                ))}

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Адрес</label>
                  <Input
                    type="text"
                    name="address"
                    value={generalSettings.address}
                    onChange={handleGeneralChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Валюта</label>
                  <select
                    name="currency"
                    value={generalSettings.currency}
                    onChange={handleGeneralChange}
                    className="w-full h-10 pl-3 pr-10 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Truck size={20} className="text-blue-600" />
                Настройки доставки
              </h2>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-6">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="enableFreeDelivery"
                    checked={deliverySettings.enableFreeDelivery}
                    onCheckedChange={(checked) =>
                      setDeliverySettings({
                        ...deliverySettings,
                        enableFreeDelivery: !!checked,
                      })
                    }
                    className="h-5 w-5 border-gray-300 rounded text-blue-600"
                  />
                  <label htmlFor="enableFreeDelivery" className="text-sm text-gray-700">
                    Включить бесплатную доставку при сумме заказа выше порога
                  </label>
                </div>

                {deliverySettings.enableFreeDelivery && (
                  <div className="mt-3 ml-8 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Порог бесплатной доставки (₽)</label>
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

              <h3 className="text-lg font-medium text-gray-900 mb-3">Способы доставки</h3>

              <div className="space-y-3">
                {deliverySettings.deliveryMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 rounded-lg border ${
                      method.enabled ? 'border-blue-100 bg-blue-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`method-${method.id}`}
                          checked={method.enabled}
                          onCheckedChange={() => handleDeliveryMethodToggle(method.id)}
                          className="h-5 w-5 border-gray-300 rounded text-blue-600"
                        />
                        <label htmlFor={`method-${method.id}`} className="text-sm font-medium text-gray-700">
                          {method.name}
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={method.price}
                          onChange={(e) => handleDeliveryMethodPriceChange(method.id, e.target.value)}
                          className="w-24 text-right"
                          disabled={!method.enabled}
                        />
                        <span className="text-sm text-gray-500">₽</span>
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full mt-3 border-dashed">
                  + Добавить способ доставки
                </Button>
              </div>
            </div>
          )}

          {/* Настройки оплаты */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-blue-600" />
                Настройки оплаты
              </h2>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Способы оплаты</h3>

              <div className="space-y-3">
                {paymentSettings.paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 rounded-lg border ${
                      method.enabled ? 'border-blue-100 bg-blue-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`payment-${method.id}`}
                          checked={method.enabled}
                          onCheckedChange={() => handlePaymentMethodToggle(method.id)}
                          className="h-5 w-5 border-gray-300 rounded text-blue-600"
                        />
                        <label htmlFor={`payment-${method.id}`} className="text-sm font-medium text-gray-700">
                          {method.name}
                        </label>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 text-xs rounded-full ${
                          method.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {method.enabled ? 'Активно' : 'Отключено'}
                      </span>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full mt-3 border-dashed">
                  + Добавить способ оплаты
                </Button>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3 mt-6">
                <AlertTriangle size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">Интеграция с платежными системами</h4>
                  <p className="text-sm text-yellow-700">
                    Для настройки интеграции с платежными системами (Stripe, PayPal и др.) обратитесь к документации.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Настройки уведомлений */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield size={20} className="text-blue-600" />
                Настройки уведомлений
              </h2>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                {[
                  {
                    id: 'enableOrderNotifications',
                    label: 'Уведомления о новых заказах',
                    checked: notificationSettings.enableOrderNotifications,
                    field: 'enableOrderNotifications',
                  },
                  {
                    id: 'enableLowStockNotifications',
                    label: 'Уведомления о низком запасе товаров',
                    checked: notificationSettings.enableLowStockNotifications,
                    field: 'enableLowStockNotifications',
                  },
                  {
                    id: 'enableCustomerNotifications',
                    label: 'Уведомления клиентам о статусе заказа',
                    checked: notificationSettings.enableCustomerNotifications,
                    field: 'enableCustomerNotifications',
                  },
                ].map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={item.id}
                      checked={item.checked}
                      onCheckedChange={(checked) => handleNotificationChange(item.field, !!checked)}
                      className="h-5 w-5 border-gray-300 rounded text-blue-600"
                    />
                    <label htmlFor={item.id} className="text-sm text-gray-700">
                      {item.label}
                    </label>
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-200 mt-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email для уведомлений</label>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Database size={20} className="text-blue-600" />
                Техническое обслуживание
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-white rounded-xl border border-gray-200 flex flex-col items-center text-center hover:shadow-sm transition-shadow">
                  <Database size={40} className="text-blue-600 mb-3" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Резервное копирование</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Создайте резервную копию всех данных сайта, включая товары, заказы и настройки
                  </p>
                  <Button variant="outline" className="w-full">
                    Создать резервную копию
                  </Button>
                </div>

                <div className="p-5 bg-white rounded-xl border border-gray-200 flex flex-col items-center text-center hover:shadow-sm transition-shadow">
                  <RefreshCw size={40} className="text-yellow-600 mb-3" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Очистка кэша</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Очистите кэш сайта для применения всех изменений и обновления данных
                  </p>
                  <Button variant="outline" className="w-full">
                    Очистить кэш
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mt-6">
                <h3 className="text-md font-medium text-red-800 mb-2 flex items-center gap-2">
                  <AlertTriangle size={18} />
                  Опасная зона
                </h3>
                <p className="text-sm text-red-700 mb-4">
                  Эти действия могут привести к серьезным последствиям для вашего магазина. Используйте их только в
                  случае крайней необходимости.
                </p>

                <div className="flex flex-wrap gap-3">
                  {['Очистить все товары', 'Сбросить настройки', 'Очистить все заказы'].map((action) => (
                    <Button
                      key={action}
                      variant="destructive"
                      size="sm"
                      className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-300"
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AnimatePresence: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};