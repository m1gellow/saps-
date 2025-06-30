import React, { useState } from 'react';
import { motion} from 'framer-motion';
import { Save, Check, } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { DeliverySettings, GeneralSettings, NotificationSettings, PaymentSettings, TAB_ITEMS } from '../../../types';
import { GeneralSettingsTab } from './components/GeneralSettingsTab';
import { DeliverySettingsTab } from './components/DeliverySettingsTab';


export const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    siteName: 'Волны&Горы',
    siteDescription: 'Продажа и аренда SUP в Екатеринбурге',
    contactEmail: 'volnyigory@mail.ru',
    contactPhone: '+7 (343) 236-63-11',
    address: 'г. Москва, р. Академический, ул.Евгения Савкова д.6',
    currency: 'RUB',
  });

  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>({
    enableFreeDelivery: true,
    freeDeliveryThreshold: 10000,
    deliveryMethods: [
      { id: 'cdek', name: 'СДЭК', enabled: true, price: 300 },
      { id: 'russian_post', name: 'Почта России', enabled: true, price: 250 },
      { id: 'yandex_taxi', name: 'Яндекс Такси', enabled: true, price: 400 },
    ],
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    paymentMethods: [
      { id: 'card', name: 'Банковская карта', enabled: true },
      { id: 'sbp', name: 'СБП', enabled: true },
      { id: 'cash', name: 'Наличными при получении', enabled: false },
    ],
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
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

  const handleDeliveryMethodPriceChange = (methodId: string, price: number) => {
    setDeliverySettings({
      ...deliverySettings,
      deliveryMethods: deliverySettings.deliveryMethods.map((method) =>
        method.id === methodId ? { ...method, price } : method,
      ),
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
          {TAB_ITEMS.map((tab) => (
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
          {activeTab === 'general' && (
            <GeneralSettingsTab 
              settings={generalSettings} 
              onChange={handleGeneralChange} 
            />
          )}

          {activeTab === 'delivery' && (
            <DeliverySettingsTab
              settings={deliverySettings}
              onToggleFreeDelivery={(checked) => 
                setDeliverySettings({...deliverySettings, enableFreeDelivery: checked})
              }
              onThresholdChange={(value) => 
                setDeliverySettings({...deliverySettings, freeDeliveryThreshold: value})
              }
              onToggleMethod={handleDeliveryMethodToggle}
              onMethodPriceChange={handleDeliveryMethodPriceChange}
            />
          )}

          {/* Аналогично для других вкладок */}
        </div>
      </div>
    </div>
  );
};

const AnimatePresence: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};