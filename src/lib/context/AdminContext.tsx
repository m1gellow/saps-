import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';

interface AdminUser {
  username: string;
  name: string;
  role: 'admin' | 'manager';
}

interface AdminContextType {
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  adminLogin: (credentials: { email: string; password: string }) => Promise<boolean>;
  adminLogout: () => void;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // При инициализации проверяем наличие сессии админа
  useEffect(() => {
    const checkAdminSession = async () => {
      setIsLoading(true);

      try {
        // Проверяем, есть ли у пользователя сессия
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          // Проверяем, является ли пользователь администратором
          const { data: adminData, error: adminError } = await supabase
            .from('admins')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (adminError) {
            console.error('Ошибка при получении данных администратора:', adminError);
            setIsAdminAuthenticated(false);
            setAdminUser(null);
            return;
          }

          if (adminData) {
            setAdminUser({
              username: adminData.username,
              name: adminData.name,
              role: adminData.role as 'admin' | 'manager',
            });
            setIsAdminAuthenticated(true);

            // Обновляем время последнего входа
            await supabase.from('admins').update({ last_login: new Date().toISOString() }).eq('id', session.user.id);
          } else {
            setIsAdminAuthenticated(false);
            setAdminUser(null);
          }
        }
      } catch (error) {
        console.error('Ошибка при проверке сессии администратора:', error);
        setIsAdminAuthenticated(false);
        setAdminUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminSession();
  }, []);

  // Проверка доступа к административным страницам
  useEffect(() => {
    if (location.pathname.startsWith('/admin') && !location.pathname.includes('/admin/login')) {
      if (!isAdminAuthenticated && !isLoading) {
        navigate('/admin/login', { replace: true });
      }
    }
  }, [location.pathname, isAdminAuthenticated, navigate, isLoading]);

  // Вход администратора
  const adminLogin = async (credentials: { email: string; password: string }): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Напрямую пытаемся войти с email и паролем
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (signInError) {
        console.error('Ошибка при входе:', signInError);
        return false;
      }

      // Проверяем, является ли пользователь администратором
      const userId = data.user?.id;
      if (!userId) {
        return false;
      }

      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('id', userId)
        .single();

      if (adminError || !adminData) {
        console.error('Администратор не найден:', adminError);
        // Выходим из системы, так как пользователь не является администратором
        await supabase.auth.signOut();
        return false;
      }

      // Устанавливаем данные администратора
      setAdminUser({
        username: adminData.username,
        name: adminData.name,
        role: adminData.role as 'admin' | 'manager',
      });
      setIsAdminAuthenticated(true);

      // Обновляем время последнего входа
      await supabase.from('admins').update({ last_login: new Date().toISOString() }).eq('id', userId);

      return true;
    } catch (error) {
      console.error('Ошибка при входе администратора:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Выход администратора
  const adminLogout = async () => {
    setIsLoading(true);

    try {
      await supabase.auth.signOut();
      setAdminUser(null);
      setIsAdminAuthenticated(false);
      navigate('/admin/login');
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        isAdminAuthenticated,
        adminUser,
        adminLogin,
        adminLogout,
        isLoading,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
