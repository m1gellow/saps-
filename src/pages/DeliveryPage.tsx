import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../lib/context/CartContext';

const DeliveryPage = () => {
  const { totalPrice } = useCart();
  const navigate = useNavigate();

  // State for form inputs
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [address, setAddress] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // State for delivery method
  const [deliveryMethod, setDeliveryMethod] = useState('cdek');

  // State for payment method
  const [paymentMethod, setPaymentMethod] = useState('card');

  // State for card payment
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Process order
    alert('Заказ успешно оформлен!');
    navigate('/');
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Handle card number input
  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    setCardNumber(formatCardNumber(value));
  };

  // Format expiry date
  const handleExpiryDateChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 2) {
      setExpiryDate(value);
    } else {
      setExpiryDate(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Хлебные крошки */}
      <div className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-4">
          Главная
        </Link>
        <span className="mx-2">›</span>
        <Link to="/cart" className="hover:text-blue-4">
          Корзина
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Доставка</span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Левая колонка - информация о доставке */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Способ доставки</h2>

          <div className="flex flex-wrap gap-4 mb-8">
            <button
              type="button"
              className={`py-3 px-6 rounded-lg border ${
                deliveryMethod === 'cdek' ? 'border-blue-4 bg-blue-50' : 'border-gray-200'
              } flex items-center justify-center transition-colors`}
              onClick={() => setDeliveryMethod('cdek')}
            >
              <span className="font-medium">СДЭК</span>
              {deliveryMethod === 'cdek' && <CheckIcon className="ml-2 h-4 w-4 text-blue-4" />}
            </button>

            <button
              type="button"
              className={`py-3 px-6 rounded-lg border ${
                deliveryMethod === 'russianPost' ? 'border-blue-4 bg-blue-50' : 'border-gray-200'
              } flex items-center justify-center transition-colors`}
              onClick={() => setDeliveryMethod('russianPost')}
            >
              <span className="font-medium">Почта РФ</span>
              {deliveryMethod === 'russianPost' && <CheckIcon className="ml-2 h-4 w-4 text-blue-4" />}
            </button>

            <button
              type="button"
              className={`py-3 px-6 rounded-lg border ${
                deliveryMethod === 'yandexTaxi' ? 'border-blue-4 bg-blue-50' : 'border-gray-200'
              } flex items-center justify-center transition-colors`}
              onClick={() => setDeliveryMethod('yandexTaxi')}
            >
              <span className="font-medium">Яндекс такси по РФ и Екатеринбургу</span>
              {deliveryMethod === 'yandexTaxi' && <CheckIcon className="ml-2 h-4 w-4 text-blue-4" />}
            </button>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-6">Адрес доставки</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg"
              />

              <Input
                type="tel"
                placeholder="+7 999 456 89 84"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="rounded-lg"
              />
            </div>

            <Input
              placeholder="ФИО"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-lg"
            />

            <Input
              placeholder="Город"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="rounded-lg"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  required
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-4 appearance-none"
                >
                  <option value="" disabled selected>
                    Область, край
                  </option>
                  <option value="moscow">Москва</option>
                  <option value="spb">Санкт-Петербург</option>
                  <option value="ekb">Свердловская область</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>

              <Input
                placeholder="Индекс"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
                className="rounded-lg"
              />
            </div>

            <Input
              placeholder="Адрес"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="rounded-lg"
            />

            <Textarea
              placeholder="Дополнительная информация"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="min-h-[100px] rounded-lg"
            />
          </div>
        </div>

        {/* Правая колонка - способ оплаты */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Способ оплаты</h2>

          <div className="flex flex-wrap gap-4 mb-8">
            <button
              type="button"
              className={`py-3 px-6 rounded-lg border ${
                paymentMethod === 'card' ? 'border-blue-4 bg-blue-50' : 'border-gray-200'
              } flex items-center justify-center transition-colors`}
              onClick={() => setPaymentMethod('card')}
            >
              <div className="flex items-center">
                <img src="/visa.svg" alt="Visa" className="h-8" />
                <img src="/mastercard.svg" alt="Mastercard" className="h-8 ml-2" />
              </div>
              {paymentMethod === 'card' && <CheckIcon className="ml-2 h-4 w-4 text-blue-4" />}
            </button>

            <button
              type="button"
              className={`py-3 px-6 rounded-lg border ${
                paymentMethod === 'sbp' ? 'border-blue-4 bg-blue-50' : 'border-gray-200'
              } flex items-center justify-center transition-colors`}
              onClick={() => setPaymentMethod('sbp')}
            >
              <img src="/sbp.svg" alt="СБП" className="h-8" />
              {paymentMethod === 'sbp' && <CheckIcon className="ml-2 h-4 w-4 text-blue-4" />}
            </button>
          </div>

          {paymentMethod === 'card' && (
            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-4">Введите данные карты</p>

              <div className="space-y-4">
                <Input
                  placeholder="Номер карты"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  required
                  className="rounded-lg"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="MM / ГГ"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    maxLength={5}
                    required
                    className="rounded-lg"
                  />

                  <Input
                    placeholder="CVC"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    maxLength={3}
                    type="password"
                    required
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Итоги заказа */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <h3 className="font-semibold text-gray-800 mb-4">Итог</h3>

            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Товары</span>
              <span className="font-medium">{totalPrice.toLocaleString()} ₽</span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Доставка</span>
              <span className="font-medium">Бесплатно</span>
            </div>

            <div className="flex justify-between pt-2 mt-2 border-t border-gray-100">
              <span className="font-semibold">Итого</span>
              <span className="font-bold text-lg">{totalPrice.toLocaleString()} ₽</span>
            </div>
          </div>

          <Button type="submit" className="w-full bg-gray-800 text-white rounded-full py-4 font-medium">
            ОПЛАТИТЬ
          </Button>

          <p className="text-xs text-center text-gray-500 mt-3">
            Я согласен с <span className="text-blue-4 underline cursor-pointer">условиями покупки</span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default DeliveryPage;
