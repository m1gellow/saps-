import React from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, X } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { formatDate, getStatusBadgeClass } from '../utils/formatters';
import { Order } from '../../../../lib/types';

interface ViewOrderModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onEditStatus: () => void;
}

export const ViewOrderModal: React.FC<ViewOrderModalProps> = ({
  order,
  isOpen,
  onClose,
  onEditStatus
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Заказ {order.id}
            </h2>
            <p className="text-sm text-gray-500">
              {formatDate(order.date)}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Скачать</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <Printer size={16} />
              <span className="hidden sm:inline">Печать</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500"
            >
              <X size={18} />
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Информация о клиенте</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-800 font-medium">{order.customer}</p>
                <p className="text-gray-600 text-sm">{order.email}</p>
                <p className="text-gray-600 text-sm">{order.phone}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Доставка</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-800">{order.address}</p>
                {order.notes && (
                  <p className="text-gray-600 text-sm mt-2">
                    <span className="font-medium">Примечание:</span> {order.notes}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Платежная информация</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-600 text-sm">Способ оплаты:</p>
                <p className="text-gray-800 font-medium">{order.paymentMethod}</p>
                <p className="text-gray-600 text-sm mt-2">Статус:</p>
                <p className="text-gray-800 font-medium">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <h3 className="text-sm font-medium text-gray-500 mb-3">Товары заказа</h3>
          <div className="bg-gray-50 rounded-md overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Товар
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Цена
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Кол-во
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Итого
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items && order.items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center">
                      {item.price.toLocaleString()} ₽
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium text-right">
                      {(item.price * item.quantity).toLocaleString()} ₽
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end">
            <div className="w-full max-w-xs">
              <div className="flex justify-between py-2 text-gray-600">
                <span>Сумма:</span>
                <span>{order.amount.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between py-2 text-gray-600">
                <span>Доставка:</span>
                <span>Бесплатно</span>
              </div>
              <div className="flex justify-between py-3 text-lg font-semibold border-t border-gray-200">
                <span>Итого:</span>
                <span>{order.amount.toLocaleString()} ₽</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="mr-2"
          >
            Закрыть
          </Button>
          <Button
            className="bg-blue-4 hover:bg-teal-600 text-white"
            onClick={onEditStatus}
          >
            Изменить статус
          </Button>
        </div>
      </motion.div>
    </div>
  );
};