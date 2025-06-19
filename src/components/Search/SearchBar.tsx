import React, { useState, useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { fuzzySearch } from "../../lib/levenshtein";
import { Product } from "../../lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { SearchIcon, XIcon } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  products?: Product[];
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, products = [] }) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Обработка клика вне поля поиска для скрытия подсказок
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    // Фильтрация продуктов по запросу с использованием нечеткого поиска
    const filtered = products.filter(product => 
      fuzzySearch(query, product.name, 2) || 
      fuzzySearch(query, product.brand, 1)
    ).slice(0, 5); // Ограничиваем до 5 предложений

    setSuggestions(filtered);
    setFocusedIndex(-1);
  }, [query, products]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    if (newQuery.trim()) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      onSearch("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: Product) => {
    setQuery(suggestion.name);
    onSearch(suggestion.name);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;
    
    // Навигация по списку предложений с помощью клавиатуры
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex(prev => 
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[focusedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-[563px] mx-auto mt-4 mb-6" ref={searchRef}>
      <div className="relative">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Input
              ref={inputRef}
              className="h-[43px] pl-11 pr-10 rounded-[50px] border border-solid border-[#0000004c] w-full focus:border-blue-4 focus:ring focus:ring-blue-4 focus:ring-opacity-50 transition-all"
              placeholder="Поиск по названию или бренду"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => query.trim() && setShowSuggestions(true)}
              autoComplete="off"
            />
            <div className="absolute w-[27px] h-[27px] top-[7px] left-[9px] bg-blue-4 bg-opacity-20 rounded-[13.5px] border border-solid border-blue-4 flex items-center justify-center">
              <SearchIcon className="w-3.5 h-3.5 text-gray-700" />
            </div>
            
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Выпадающие подсказки */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div 
              className="absolute z-20 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ul>
                {suggestions.map((suggestion, index) => (
                  <motion.li 
                    key={suggestion.id} 
                    className={`px-4 py-2 cursor-pointer transition-colors ${
                      index !== suggestions.length - 1 ? 'border-b border-gray-100' : ''
                    } ${index === focusedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    whileHover={{ backgroundColor: "rgba(23, 204, 197, 0.1)" }}
                  >
                    <div className="flex items-center">
                      <img 
                        src={suggestion.image} 
                        alt={suggestion.name} 
                        className="w-8 h-8 object-contain mr-2"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-800">{suggestion.name}</div>
                        <div className="text-xs text-gray-500">{suggestion.brand}</div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};