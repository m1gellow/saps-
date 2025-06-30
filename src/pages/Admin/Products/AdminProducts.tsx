import React, { useState, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Filter, ChevronDown, Check, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  getAllProducts,
  getAllCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../../lib/api/products';
import { Product } from '../../../lib/types';
import { supabase } from '../../../lib/supabase';

export const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState({ field: 'id', direction: 'asc' });
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState(false);

  const productsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([getAllProducts(), getAllCategories()]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.id.toString().includes(searchTerm),
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    filtered.sort((a, b) => {
      const fieldA = sortBy.field === 'price' ? a.priceValue : a[sortBy.field as keyof Product];
      const fieldB = sortBy.field === 'price' ? b.priceValue : b[sortBy.field as keyof Product];

      if (sortBy.direction === 'asc') {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, products, sortBy]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleNewProduct = () => {
    setSelectedProduct({
      id: 0,
      name: '',
      brand: '',
      price: '',
      priceValue: 0,
      image: '',
      category: '',
      inStock: true,
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;

    setIsLoading(true);
    try {
      const { success, error } = await deleteProduct(selectedProduct.id);

      if (success) {
        setProducts(products.filter((p) => p.id !== selectedProduct.id));
        setIsDeleteModalOpen(false);
        toast.success('Товар успешно удален');
      } else {
        console.error('Ошибка при удалении товара:', error);
        toast.error('Ошибка при удалении товара');
      }
    } catch (error) {
      console.error('Ошибка при удалении товара:', error);
      toast.error('Ошибка при удалении товара');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (field: string) => {
    setSortBy((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSaveProduct = async (formData: Product) => {
    setIsLoading(true);

    try {
      if (formData.id) {
        const { success, error } = await updateProduct(formData.id, formData);
        if (success) {
          const updatedProducts = await getAllProducts();
          setProducts(updatedProducts);
          toast.success('Товар успешно обновлен');
        } else {
          console.error('Ошибка при обновлении товара:', error);
          toast.error('Ошибка при обновлении товара');
        }
      } else {
        const { data, error } = await createProduct(formData);
        if (data) {
          const updatedProducts = await getAllProducts();
          setProducts(updatedProducts);
          toast.success('Товар успешно добавлен');
        } else {
          console.error('Ошибка при создании товара:', error);
          toast.error('Ошибка при создании товара');
        }
      }
    } catch (error) {
      console.error('Ошибка при сохранении товара:', error);
      toast.error('Ошибка при сохранении товара');
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPaginationRange = () => {
    const totalVisiblePages = 5;
    const half = Math.floor(totalVisiblePages / 2);

    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + totalVisiblePages - 1, totalPages);

    if (end - start + 1 < totalVisiblePages) {
      start = Math.max(end - totalVisiblePages + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Управление товарами</h1>
          <p className="text-sm text-gray-500 mt-1">
            Всего товаров: {products.length} | Отфильтровано: {filteredProducts.length}
          </p>
        </div>
        <Button
          className="bg-blue  text-white rounded-lg flex items-center gap-2 px-4 py-2 shadow-sm transition-colors"
          onClick={handleNewProduct}
        >
          <Plus size={18} className="stroke-[2.5]" />
          <span>Добавить товар</span>
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <Input
              placeholder="Поиск по названию, бренду или ID..."
              className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <select
                className="w-full h-10 pl-3 pr-10 appearance-none rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Все категории</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown size={18} className="text-gray-400" />
              </div>
            </div>

            <Button
              variant={activeFilter ? 'default' : 'outline'}
              className="h-10 px-4 gap-2 transition-colors"
              onClick={() => setActiveFilter(!activeFilter)}
            >
              <Filter size={18} className="stroke-[2.5]" />
              <span className="hidden sm:inline">Фильтры</span>
            </Button>
          </div>
        </div>

        {activeFilter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 pt-4 border-t border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Сортировка</label>
                <select
                  className="w-full rounded-lg border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  value={sortBy.field}
                  onChange={(e) => setSortBy({ ...sortBy, field: e.target.value })}
                >
                  <option value="id">ID</option>
                  <option value="name">Название</option>
                  <option value="brand">Бренд</option>
                  <option value="price">Цена</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Направление</label>
                <select
                  className="w-full rounded-lg border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  value={sortBy.direction}
                  onChange={(e) => setSortBy({ ...sortBy, direction: e.target.value as 'asc' | 'desc' })}
                >
                  <option value="asc">По возрастанию</option>
                  <option value="desc">По убыванию</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                <select
                  className="w-full rounded-lg border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  value="all"
                  onChange={() => {}}
                >
                  <option value="all">Все статусы</option>
                  <option value="inStock">В наличии</option>
                  <option value="outOfStock">Нет в наличии</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-3">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <span className="text-gray-600">Загружаем данные о товарах...</span>
            <span className="text-sm text-gray-400">Пожалуйста, подождите</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      { field: 'id', label: 'ID' },
                      { field: '', label: 'Изображение' },
                      { field: 'name', label: 'Название' },
                      { field: 'brand', label: 'Бренд' },
                      { field: 'price', label: 'Цена' },
                      { field: '', label: 'Категория' },
                      { field: '', label: 'Статус' },
                      { field: '', label: 'Действия' },
                    ].map((header, idx) => (
                      <th
                        key={idx}
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.field ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                        onClick={header.field ? () => handleSortChange(header.field) : undefined}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{header.label}</span>
                          {sortBy.field === header.field && <span>{sortBy.direction === 'asc' ? '↑' : '↓'}</span>}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            #{product.id}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-10 w-10 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                                }}
                              />
                            ) : (
                              <ImageIcon size={20} className="text-gray-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          {product.description && (
                            <div className="text-xs text-gray-500 truncate max-w-xs">{product.description}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.brand}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <span className="text-blue-600">{product.price}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.inStock ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {product.inStock ? 'В наличии' : 'Нет в наличии'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              className="p-2 text-blue-600 hover:text-blue-800 transition-colors rounded-lg hover:bg-blue-50"
                              onClick={() => handleEditProduct(product)}
                              title="Редактировать"
                            >
                              <Edit size={18} className="stroke-[2]" />
                            </button>
                            <button
                              className="p-2 text-rose-500 hover:text-rose-700 transition-colors rounded-lg hover:bg-rose-50"
                              onClick={() => handleDeleteProduct(product)}
                              title="Удалить"
                            >
                              <Trash2 size={18} className="stroke-[2]" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                          <Search size={40} className="text-gray-300" />
                          <p className="text-lg font-medium">Товары не найдены</p>
                          <p className="text-sm max-w-md">
                            Попробуйте изменить параметры поиска или фильтрации, или добавьте новый товар
                          </p>
                          <Button
                            variant="outline"
                            className="mt-3 gap-2"
                            onClick={() => {
                              setSearchTerm('');
                              setSelectedCategory('all');
                            }}
                          >
                            <X size={16} />
                            Сбросить фильтры
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredProducts.length > 0 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-gray-50/50">
                <div className="flex-1 flex justify-between sm:hidden">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="gap-1"
                  >
                    <ChevronDown size={16} className="rotate-90" />
                    Назад
                  </Button>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="gap-1"
                  >
                    Вперед
                    <ChevronDown size={16} className="-rotate-90" />
                  </Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Показано{' '}
                      <span className="font-medium">
                        {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)}
                      </span>{' '}
                      из <span className="font-medium">{filteredProducts.length}</span> товаров
                    </p>
                  </div>
                  <div>
                    <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className="inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Первая страница"
                      >
                        <span className="sr-only">Первая</span>«
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Предыдущая страница"
                      >
                        <span className="sr-only">Предыдущая</span>‹
                      </button>

                      {getPaginationRange().map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-blue-600 border-blue-600 text-white'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Следующая страница"
                      >
                        <span className="sr-only">Следующая</span>›
                      </button>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Последняя страница"
                      >
                        <span className="sr-only">Последняя</span>»
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && selectedProduct && (
          <ProductFormModal
            product={selectedProduct}
            categories={categories}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveProduct}
            isLoading={isLoading}
          />
        )}

        {isDeleteModalOpen && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Подтвердите удаление</h3>
                  <p className="text-gray-600 mt-1">
                    Вы уверены, что хотите удалить товар <span className="font-medium">"{selectedProduct.name}"</span>?
                  </p>
                  <p className="text-sm text-rose-600 mt-2">Это действие нельзя отменить!</p>
                </div>
                <button
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isLoading}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Отмена
                </Button>
                <Button variant="destructive" onClick={confirmDelete} disabled={isLoading} className="gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Удаление...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      <span>Удалить</span>
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ProductFormModalProps {
  product: Product;
  categories: any[];
  onClose: () => void;
  onSave: (formData: Product) => void;
  isLoading: boolean;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, categories, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState<Product>(product);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Проверка типа файла
      const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
      if (!ALLOWED_TYPES.includes(selectedFile.type)) {
        setErrors({ ...errors, image: 'Допустимые форматы: JPG, PNG, WEBP' });
        return;
      }

      // Проверка размера файла (макс. 5MB)
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (selectedFile.size > MAX_FILE_SIZE) {
        setErrors({ ...errors, image: 'Максимальный размер файла 5MB' });
        return;
      }

      setFile(selectedFile);
      setErrors({ ...errors, image: '' });

      // Превью изображения
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    setIsUploading(true);

    try {
      const { error: uploadError } = await supabase.storage.from('item-images').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('item-images').getPublicUrl(filePath);

      return publicUrl;
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'price') {
      const sanitizedValue = value.replace(/[^0-9\s\u0420\u0440Pp.]/g, '');
      const priceValue = parseFloat(sanitizedValue.replace(/[^\d.]/g, '')) || 0;

      setFormData({
        ...formData,
        [name]: sanitizedValue,
        priceValue: priceValue,
      });
    } else if (name === 'inStock') {
      setFormData({
        ...formData,
        [name]: (e as React.ChangeEvent<HTMLInputElement>).target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Название товара обязательно';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Название должно содержать минимум 3 символа';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Бренд обязателен';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Цена обязательна';
    } else if (formData.priceValue <= 0) {
      newErrors.price = 'Цена должна быть больше нуля';
    }

    if (!formData.category) {
      newErrors.category = 'Категория обязательна';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let imageUrl = formData.image;

      // Если выбрано новое изображение, загружаем его
      if (file) {
        try {
          imageUrl = await uploadImage(file);
        } catch (error) {
          console.error('Ошибка загрузки изображения:', error);
          setErrors({ ...errors, image: 'Не удалось загрузить изображение' });
          return;
        }
      }

      // Сохраняем товар с обновленным URL изображения
      const productToSave = {
        ...formData,
        image: imageUrl,
      };

      onSave(productToSave);
    } catch (error) {
      console.error('Ошибка при сохранении товара:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {product.id ? 'Редактирование товара' : 'Добавление нового товара'}
          </h2>
          <button
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
            onClick={onClose}
            disabled={isLoading || isUploading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Изображение товара
                <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="relative h-48 w-48 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    {imagePreview || formData.image ? (
                      <img
                        src={imagePreview || formData.image}
                        alt="Превью товара"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-xs text-gray-500">Изображение товара</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="product-image"
                        className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
                          isUploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <input
                          type="file"
                          id="product-image"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                          disabled={isUploading}
                        />
                        Выбрать файл
                      </label>
                      <p className="mt-1 text-xs text-gray-500">JPG, PNG или WEBP. Макс. размер 5MB.</p>
                      {errors.image && <p className="mt-1 text-xs text-rose-500">{errors.image}</p>}
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h4 className="text-xs font-medium text-blue-800 mb-2">Рекомендации по изображению</h4>
                      <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                        <li>Используйте качественные изображения</li>
                        <li>Оптимальный размер 800x800 пикселей</li>
                        <li>Фон должен быть нейтральным</li>
                        <li>Избегайте водяных знаков</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название товара
                <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Например: Смартфон iPhone 13 Pro"
                className={errors.name ? 'border-rose-300 focus:ring-rose-300' : ''}
              />
              {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Бренд
                <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Например: Apple"
                className={errors.brand ? 'border-rose-300 focus:ring-rose-300' : ''}
              />
              {errors.brand && <p className="mt-1 text-xs text-rose-500">{errors.brand}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Цена
                <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Например: 89 990 Р."
                className={errors.price ? 'border-rose-300 focus:ring-rose-300' : ''}
              />
              {errors.price && <p className="mt-1 text-xs text-rose-500">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Категория
                <span className="text-rose-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full rounded-lg border ${
                  errors.category ? 'border-rose-300 focus:ring-rose-300' : 'border-gray-300 focus:ring-blue-500'
                } py-2 px-3 shadow-sm focus:outline-none focus:border-transparent`}
              >
                <option value="">Выберите категорию</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-rose-500">{errors.category}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Товар в наличии</span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Описание товара</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Подробное описание товара, характеристики, особенности..."
              ></textarea>
              <p className="mt-1 text-xs text-gray-500">
                Необязательное поле, но рекомендуется для лучшего описания товара
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isLoading || isUploading}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              disabled={isLoading || isUploading}
            >
              {isLoading || isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isUploading ? 'Загрузка изображения...' : 'Сохранение...'}</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Сохранить товар</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
