import { supabase } from '../supabase';
import { Product } from '../types';

// Получение всех товаров
export async function getAllProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('id', { ascending: true });

    if (error) {
      throw error;
    }

    return data.map((product) => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: `${product.price} P.`,
      priceValue: product.price,
      image: product.image,
      favoriteIcon: '/group-213.png', // заглушка, можно удалить это поле
      category: product.categories.name,
      inStock: product.in_stock,
      description: product.description,
    }));
  } catch (error) {
    console.error('Ошибка при получении товаров:', error);
    return [];
  }
}

// Получение товаров по категории
export async function getProductsByCategory(categoryName: string): Promise<Product[]> {
  try {
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryName)
      .single();

    if (categoryError) {
      throw categoryError;
    }

    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('category_id', categoryData.id)
      .order('id', { ascending: true });

    if (error) {
      throw error;
    }

    return data.map((product) => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: `${product.price} P.`,
      priceValue: product.price,
      image: product.image,
      favoriteIcon: '/group-213.png', // заглушка
      category: product.categories.name,
      inStock: product.in_stock,
      description: product.description,
    }));
  } catch (error) {
    console.error(`Ошибка при получении товаров по категории ${categoryName}:`, error);
    return [];
  }
}

// Получение товара по ID
export async function getProductById(id: number): Promise<Product | null> {
  try {
    const { data, error } = await supabase.from('products').select('*, categories(name)').eq('id', id).single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      brand: data.brand,
      price: `${data.price} P.`,
      priceValue: data.price,
      image: data.image,
      favoriteIcon: '/group-213.png', // заглушка
      category: data.categories.name,
      inStock: data.in_stock,
      description: data.description,
    };
  } catch (error) {
    console.error(`Ошибка при получении товара с ID ${id}:`, error);
    return null;
  }
}

// Получение рекомендуемых товаров
async function getRecommendedProducts(currentProductId?: number, limit: number = 4): Promise<Product[]> {
  try {
    let query = supabase.from('products').select('*, categories(name)').order('id', { ascending: false }).limit(limit);

    // Если указан ID текущего товара, исключаем его из рекомендаций
    if (currentProductId) {
      query = query.neq('id', currentProductId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data.map((product) => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: `${product.price} P.`,
      priceValue: product.price,
      image: product.image,
      favoriteIcon: '/group-213.png', // заглушка
      category: product.categories.name,
      inStock: product.in_stock,
      description: product.description,
    }));
  } catch (error) {
    console.error('Ошибка при получении рекомендуемых товаров:', error);
    return [];
  }
}

// Создание нового товара (для админ-панели)
export async function createProduct(
  productData: Omit<Product, 'id' | 'favoriteIcon'>,
): Promise<{ data: Product | null; error: any }> {
  try {
    // Сначала получаем ID категории по имени
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', productData.category)
      .single();

    if (categoryError) {
      throw categoryError;
    }

    // Форматируем данные для вставки
    const dataToInsert = {
      name: productData.name,
      brand: productData.brand,
      price: productData.priceValue,
      image: productData.image,
      category_id: categoryData.id,
      in_stock: productData.inStock,
      description: productData.description || null,
    };

    // Вставляем новый товар
    const { data, error } = await supabase
      .from('products')
      .insert([dataToInsert])
      .select('*, categories(name)')
      .single();

    if (error) {
      throw error;
    }

    // Преобразуем полученные данные в формат Product
    const newProduct: Product = {
      id: data.id,
      name: data.name,
      brand: data.brand,
      price: `${data.price} P.`,
      priceValue: data.price,
      image: data.image,
      favoriteIcon: '/group-213.png', // заглушка
      category: data.categories.name,
      inStock: data.in_stock,
      description: data.description,
    };

    return { data: newProduct, error: null };
  } catch (error) {
    console.error('Ошибка при создании товара:', error);
    return { data: null, error };
  }
}

// Обновление товара (для админ-панели)
export async function updateProduct(
  id: number,
  productData: Partial<Omit<Product, 'id' | 'favoriteIcon'>>,
): Promise<{ success: boolean; error: any }> {
  try {
    let categoryId;

    // Если категория изменилась, получаем ее ID
    if (productData.category) {
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', productData.category)
        .single();

      if (categoryError) {
        throw categoryError;
      }

      categoryId = categoryData.id;
    }

    // Форматируем данные для обновления
    const dataToUpdate: any = {};

    if (productData.name !== undefined) dataToUpdate.name = productData.name;
    if (productData.brand !== undefined) dataToUpdate.brand = productData.brand;
    if (productData.priceValue !== undefined) dataToUpdate.price = productData.priceValue;
    if (productData.image !== undefined) dataToUpdate.image = productData.image;
    if (categoryId !== undefined) dataToUpdate.category_id = categoryId;
    if (productData.inStock !== undefined) dataToUpdate.in_stock = productData.inStock;
    if (productData.description !== undefined) dataToUpdate.description = productData.description;

    // Обновляем товар
    const { error } = await supabase.from('products').update(dataToUpdate).eq('id', id);

    if (error) {
      throw error;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error(`Ошибка при обновлении товара с ID ${id}:`, error);
    return { success: false, error };
  }
}

// Удаление товара (для админ-панели)
export async function deleteProduct(id: number): Promise<{ success: boolean; error: any }> {
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      throw error;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error(`Ошибка при удалении товара с ID ${id}:`, error);
    return { success: false, error };
  }
}

// Получение всех категорий
export async function getAllCategories() {
  try {
    const { data, error } = await supabase.from('categories').select('*').order('name');

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    return [];
  }
}
