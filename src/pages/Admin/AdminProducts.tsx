import React, { useState, useEffect, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Filter, ChevronDown, Check, X, Image, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { getAllProducts, getAllCategories, createProduct, updateProduct, deleteProduct } from '../../lib/api/products';
import { Product } from '../../lib/types';
import { supabase } from '../../lib/supabase';

// Инициализация Supabase клиента

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

  const productsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
        const categoriesData = await getAllCategories();
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
      } else {
        console.error('Ошибка при удалении товара:', error);
        alert('Ошибка при удалении товара. Пожалуйста, попробуйте снова.');
      }
    } catch (error) {
      console.error('Ошибка при удалении товара:', error);
      alert('Ошибка при удалении товара. Пожалуйста, попробуйте снова.');
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
        } else {
          console.error('Ошибка при обновлении товара:', error);
          alert('Ошибка при обновлении товара. Пожалуйста, попробуйте снова.');
        }
      } else {
        const { data, error } = await createProduct(formData);
        if (data) {
          const updatedProducts = await getAllProducts();
          setProducts(updatedProducts);
        } else {
          console.error('Ошибка при создании товара:', error);
          alert('Ошибка при создании товара. Пожалуйста, попробуйте снова.');
        }
      }
    } catch (error) {
      console.error('Ошибка при сохранении товара:', error);
      alert('Ошибка при сохранении товара. Пожалуйста, попробуйте снова.');
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800">Товары</h1>
        <Button
          className="bg-blue text-white rounded-lg flex items-center gap-2 px-4 py-2"
          onClick={handleNewProduct}
        >
          <Plus size={16} />
          Добавить товар
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <Input
              placeholder="Поиск товаров..."
              className="pl-10 w-full rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="relative">
              <select
                className="w-full h-10 pl-3 pr-10 appearance-none rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            <Button variant="outline" className="h-10 px-4 border-gray-300 text-gray-700 gap-2">
              <Filter size={18} />
              <span className="hidden sm:inline">Фильтры</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin mr-2" />
            <span className="text-gray-600">Загрузка данных...</span>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('id')}
                >
                  <div className="flex items-center space-x-1">
                    <span>ID</span>
                    {sortBy.field === 'id' && <span>{sortBy.direction === 'asc' ? '↑' : '↓'}</span>}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Изображение
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Название</span>
                    {sortBy.field === 'name' && <span>{sortBy.direction === 'asc' ? '↑' : '↓'}</span>}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('brand')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Бренд</span>
                    {sortBy.field === 'brand' && <span>{sortBy.direction === 'asc' ? '↑' : '↓'}</span>}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('price')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Цена</span>
                    {sortBy.field === 'price' && <span>{sortBy.direction === 'asc' ? '↑' : '↓'}</span>}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категория
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{product.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-10 w-10 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                      <img src={product.image} alt={product.name} className="h-full object-contain" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {product.inStock ? 'В наличии' : 'Нет в наличии'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors rounded-full hover:bg-blue-50"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-1 text-red-500 hover:text-red-700 transition-colors rounded-full hover:bg-red-50"
                        onClick={() => handleDeleteProduct(product)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}

              {currentProducts.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                    Товары не найдены. Измените критерии поиска или добавьте новый товар.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {filteredProducts.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Пред.
              </Button>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                След.
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Показано <span className="font-medium">{currentProducts.length}</span> из{' '}
                  <span className="font-medium">{filteredProducts.length}</span> товаров
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Предыдущая</span>
                    &laquo;
                  </button>

                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        currentPage === index + 1
                          ? 'z-10 bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      } text-sm font-medium`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Следующая</span>
                    &raquo;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg max-w-md w-full p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Подтвердите удаление</h3>
            <p className="text-gray-600 mb-4">
              Вы уверены, что хотите удалить товар "{selectedProduct.name}"? Это действие нельзя отменить.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                className="border-gray-300 text-gray-700"
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white flex items-center space-x-2"
                onClick={confirmDelete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Удаление...</span>
                  </>
                ) : (
                  <span>Удалить</span>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Проверка типа файла
      const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
      if (!ALLOWED_TYPES.includes(selectedFile.type)) {
        alert('Недопустимый тип файла. Разрешены только JPG, PNG и GIF.');
        return;
      }

      // Проверка размера файла (макс. 5MB)
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (selectedFile.size > MAX_FILE_SIZE) {
        alert('Файл слишком большой. Максимальный размер 5MB.');
        return;
      }

      setFile(selectedFile);
      
      // Превью изображения
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData({
            ...formData,
            image: event.target.result as string
          });
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('item-image')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('item-image')
      .getPublicUrl(filePath);

    return publicUrl;
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
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Бренд обязателен';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Цена обязательна';
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

    setIsUploading(true);

    try {
      let imageUrl = formData.image;

      // Если выбрано новое изображение, загружаем его
      if (file) {
        try {
          imageUrl = await uploadImage(file);
        } catch (error) {
          console.error('Ошибка загрузки изображения:', error);
          alert('Не удалось загрузить изображение. Пожалуйста, попробуйте снова.');
          return;
        }
      }

      // Сохраняем товар с обновленным URL изображения
      const productToSave = {
        ...formData,
        image: imageUrl
      };

      onSave(productToSave);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {product.id ? 'Редактирование товара' : 'Добавление товара'}
          </h2>
          <button 
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500" 
            onClick={onClose} 
            disabled={isLoading || isUploading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Изображение товара</label>
              <div className="flex items-center">
                <div className="mr-4 h-24 w-24 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border border-gray-200">
                  {formData.image ? (
                    <img 
                      src={formData.image.startsWith('data:') ? formData.image : `${formData.image}?${Date.now()}`} 
                      alt={formData.name} 
                      className="h-full w-full object-contain" 
                    />
                  ) : (
                    <Image size={32} className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="file"
                      id="product-image"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploading}
                    />
                    <label 
                      htmlFor="product-image" 
                      className={`block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      Выбрать файл
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {file ? file.name : 'JPG, PNG или GIF. Макс. размер 5MB.'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Название товара</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'border-red-300' : ''}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Бренд</label>
              <Input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={errors.brand ? 'border-red-300' : ''}
              />
              {errors.brand && <p className="mt-1 text-xs text-red-500">{errors.brand}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Цена</label>
              <Input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="14 000 Р."
                className={errors.price ? 'border-red-300' : ''}
              />
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full rounded-md border ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                } py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="">Выберите категорию</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">В наличии</span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Описание товара</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите описание товара..."
              ></textarea>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700"
              disabled={isLoading || isUploading}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="bg-blue  text-white flex items-center space-x-2"
              disabled={isLoading || isUploading}
            >
              {(isLoading || isUploading) ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isUploading ? 'Загрузка...' : 'Сохранение...'}</span>
                </>
              ) : (
                <span>Сохранить</span>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};