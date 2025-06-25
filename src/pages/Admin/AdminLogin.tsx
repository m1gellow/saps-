import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '../../lib/context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { MailIcon, LockIcon, AlertCircleIcon, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export const AdminLogin = () => {
  const { adminLogin, isLoading } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Пожалуйста, введите email и пароль');
      return;
    }

    setError('');

    try {
      const success = await adminLogin({ email, password });

      if (success) {
        navigate('/admin');
      } else {
        setError('Неверный email или пароль');
      }
    } catch (err) {
      setError('Произошла ошибка при входе');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Вход в админ-панель</h2>
            <p className="text-gray-600 mt-2">Введите учетные данные для доступа к панели администратора</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center"
            >
              <AlertCircleIcon className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 py-2 rounded-md border-gray-300 focus:border-blue focus:ring focus:ring-blue focus:ring-opacity-50"
                  placeholder="admin@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Пароль
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 py-2 rounded-md border-gray-300 focus:border-blue focus:ring focus:ring-blue focus:ring-opacity-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-2 bg-blue hover:bg-teal-600 text-white font-medium rounded-md transition-colors flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Вход...
                </>
              ) : (
                'Войти в систему'
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>Для входа используйте:</p>
            <p className="font-semibold mt-1">Email: yugoslaviagrill96@gmail.com</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};