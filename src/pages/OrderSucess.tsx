import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export const OrderSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
            }}
            className="bg-green-100 p-4 rounded-full"
          >
            <CheckCircle className="h-16 w-16 text-green-600" strokeWidth={1.5} />
          </motion.div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">Заказ оформлен!</h1>
        <p className="text-gray-600 mb-6">Спасибо за ваш заказ. Мы уже начали его обработку.</p>

        <div className="mb-8">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 4.5, ease: 'linear' }}
              className="h-full bg-green-500"
            />
          </div>
        </div>

        <p className="text-sm text-gray-500">Автоматический переход через 5 секунд...</p>

        <button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          Вернуться на главную
        </button>
      </motion.div>
    </div>
  );
};
