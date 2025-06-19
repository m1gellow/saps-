import { supabase } from "../supabase";
import { Order } from "../types";

// Получение всех заказов для админ-панели
export async function getAdminOrders() {
  try {
    // Получаем заказы
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersError) {
      throw ordersError;
    }

    // Преобразуем формат данных для фронтенда
    const formattedOrders = await Promise.all(
      ordersData.map(async (order) => {
        // Получаем товары заказа
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select('*, products(*)')
          .eq('order_id', order.id);
          
        if (itemsError) {
          console.error(`Ошибка при получении позиций для заказа ${order.id}:`, itemsError);
          return null;
        }

        // Форматируем товары заказа
        const items = orderItems.map(item => ({
          id: item.id,
          name: item.products.name,
          price: item.price,
          quantity: item.quantity
        }));

        return {
          id: `ORD-${order.id}`,
          customer: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone,
          date: order.created_at,
          status: order.status,
          amount: order.total_amount,
          paymentMethod: order.payment_method,
          items,
          address: order.delivery_address,
          notes: order.notes
        };
      })
    );

    // Удаляем null элементы (в случае ошибок)
    const orders = formattedOrders.filter(order => order !== null) as Order[];
    
    return { orders, error: null };
  } catch (error) {
    console.error('Ошибка при получении заказов для админ-панели:', error);
    return { orders: [], error };
  }
}

// Получение заказа по ID
async function getAdminOrderById(orderId: string) {
  try {
    // Извлекаем числовой ID заказа из формата "ORD-XXX"
    const numericId = parseInt(orderId.replace('ORD-', ''), 10);
    if (isNaN(numericId)) {
      throw new Error(`Некорректный ID заказа: ${orderId}`);
    }

    // Получаем заказ
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', numericId)
      .single();

    if (orderError) {
      throw orderError;
    }

    // Получаем товары заказа
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*, products(*)')
      .eq('order_id', numericId);
      
    if (itemsError) {
      throw itemsError;
    }

    // Форматируем товары заказа
    const items = orderItems.map(item => ({
      id: item.id,
      name: item.products.name,
      price: item.price,
      quantity: item.quantity
    }));

    // Формируем объект заказа
    const order: Order = {
      id: `ORD-${orderData.id}`,
      customer: orderData.customer_name,
      email: orderData.customer_email,
      phone: orderData.customer_phone,
      date: orderData.created_at,
      status: orderData.status,
      amount: orderData.total_amount,
      paymentMethod: orderData.payment_method,
      items,
      address: orderData.delivery_address,
      notes: orderData.notes
    };

    return { order, error: null };
  } catch (error) {
    console.error(`Ошибка при получении заказа с ID ${orderId}:`, error);
    return { order: null, error };
  }
}

// Обновление статуса заказа
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    // Извлекаем числовой ID заказа из формата "ORD-XXX"
    const numericId = parseInt(orderId.replace('ORD-', ''), 10);
    if (isNaN(numericId)) {
      throw new Error(`Некорректный ID заказа: ${orderId}`);
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status: status })
      .eq('id', numericId)
      .select();

    if (error) {
      throw error;
    }

    return { success: true, data, error: null };
  } catch (error) {
    console.error(`Ошибка при обновлении статуса заказа ${orderId}:`, error);
    return { success: false, data: null, error };
  }
}

// Получение статистики для дашборда администратора
export async function getAdminDashboardStats() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayIso = today.toISOString();

    // Получаем количество новых заказов за сегодня
    const { count: newOrdersToday, error: newOrdersError } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: false })
      .gte('created_at', todayIso);

    if (newOrdersError) throw newOrdersError;

    // Получаем выручку за сегодня
    const { data: todayRevenue, error: revenueError } = await supabase
      .from('orders')
      .select('total_amount')
      .gte('created_at', todayIso)
      .not('status', 'eq', 'Отменен');

    if (revenueError) throw revenueError;

    const revenueToday = todayRevenue.reduce((sum, order) => sum + order.total_amount, 0);

    // Получаем количество товаров с низким запасом
    const { data: lowStockItems, error: lowStockError } = await supabase
      .from('products')
      .select('id, name, in_stock')
      .eq('in_stock', false)
      .limit(5);

    if (lowStockError) throw lowStockError;

    // Получаем последние заказы
    const { data: recentOrders, error: recentOrdersError } = await supabase
      .from('orders')
      .select('id, customer_name, created_at, status, total_amount')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentOrdersError) throw recentOrdersError;

    const formattedRecentOrders = recentOrders.map(order => ({
      id: `ORD-${order.id}`,
      customer: order.customer_name,
      date: formatRelativeTime(order.created_at),
      status: order.status,
      amount: `${order.total_amount.toLocaleString()} ₽`
    }));

    return { 
      newOrdersToday: newOrdersToday || 0, 
      revenueToday, 
      lowStockItems, 
      recentOrders: formattedRecentOrders,
      error: null 
    };
  } catch (error) {
    console.error('Ошибка при получении статистики для дашборда:', error);
    return { 
      newOrdersToday: 0, 
      revenueToday: 0, 
      lowStockItems: [], 
      recentOrders: [],
      error 
    };
  }
}

// Форматирование относительного времени (например: "2 часа назад")
function formatRelativeTime(isoDate: string) {
  const date = new Date(isoDate);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'только что';
  if (diffInMinutes < 60) return `${diffInMinutes} мин. назад`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ч. назад`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Вчера';
  if (diffInDays < 7) return `${diffInDays} дн. назад`;

  return date.toLocaleDateString('ru-RU');
}

// Получение пользователей для панели администратора
export async function getAdminUsers() {
  try {
    // Получаем профили пользователей
    const { data: userProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');

    if (profilesError) throw profilesError;

    // Получаем администраторов для определения ролей
    const { data: admins, error: adminsError } = await supabase
      .from('admins')
      .select('id, role');

    if (adminsError) throw adminsError;

    // Формируем список пользователей с ролями
    const users = userProfiles.map(profile => {
      const adminInfo = admins.find(admin => admin.id === profile.id);
      return {
        id: profile.id,
        name: profile.name || 'Пользователь',
        email: profile.email,
        role: adminInfo ? adminInfo.role : 'customer',
        lastLogin: profile.created_at, // Используем дату создания как заглушку
        status: 'active'
      };
    });

    return { users, error: null };
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    return { users: [], error };
  }
}