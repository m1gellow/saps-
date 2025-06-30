import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, ChevronDown, X, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { getAllProducts, getAllCategories } from '../../../lib/api/products';
import { ProductFormModal } from './components/ProductFormModal';
import { ProductsTable } from './components/ProductsTable';
import { Pagination } from './components/Pagination';
import { Product } from '../../../lib/types';
import { Category, SortConfig } from '../../../types';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { filterProducts, sortProducts } from '../../../utils/products';


export const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortConfig>({ field: 'id', direction: 'asc' });
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeFilter, setActiveFilter] = useState(false);

  const productsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ]);
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

  const filteredProducts = sortProducts(
    filterProducts(products, searchTerm, selectedCategory),
    sortBy
  );

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

  const handleSortChange = (field: string) => {
    setSortBy((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
          className="bg-blue-600 text-white rounded-lg flex items-center gap-2 px-4 py-2 shadow-sm transition-colors"
          onClick={handleNewProduct}
        >
          <Plus size={18} className="stroke-[2.5]" />
          <span>Добавить товар</span>
        </Button>
      </div>

      {/* Фильтры и поиск */}
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

      {/* Таблица товаров */}
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
              <ProductsTable
                products={currentProducts}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            </div>

            {filteredProducts.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredProducts.length}
                itemsPerPage={productsPerPage}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>

      {/* Модальные окна */}
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
          <DeleteConfirmationModal
            product={selectedProduct}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};