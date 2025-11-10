import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeFromCart } from '../services/cart';
import api from '../utils/api';
import type { CartItem } from '../services/cart';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    setLoading(true);
    try {
      const items = await getCart();
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateQuantity(itemId: number, newQuantity: number) {
    if (newQuantity < 1) {
      await handleRemove(itemId);
      return;
    }

    try {
      await updateCartItem(itemId, newQuantity);
      await loadCart();
    } catch (error) {
      console.error('Error updating cart:', error);
      alert('Ошибка при обновлении корзины');
    }
  }

  async function handleRemove(itemId: number) {
    try {
      await removeFromCart(itemId);
      await loadCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Ошибка при удалении из корзины');
    }
  }

  async function handleCreateOrder() {
    if (cartItems.length === 0) return;

    setCreatingOrder(true);
    try {
      const response = await api.post('/orders', {
        shipping_address: 'Адрес будет указан при оформлении',
        payment_method: 'cash',
      });

      if (response.data.success) {
        navigate('/profile');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert(error.response?.data?.error || 'Ошибка при создании заказа');
    } finally {
      setCreatingOrder(false);
    }
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="cart">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart">
        <h1>Корзина</h1>
        <div className="empty-cart">
          <p>Ваша корзина пуста</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            Перейти к каталогу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1>Корзина</h1>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              {item.images && item.images.length > 0 ? (
                <img src={item.images[0]} alt={item.name} />
              ) : (
                <div className="no-image">📦</div>
              )}
            </div>

            <div className="cart-item-info">
              <h3 className="cart-item-name">{item.name}</h3>
              <div className="cart-item-price">
                {item.old_price && (
                  <span className="old-price">{item.old_price} ₽</span>
                )}
                <span className="current-price">{item.price} ₽</span>
              </div>

              <div className="cart-item-actions">
                <div className="quantity-selector">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => handleRemove(item.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span>Итого:</span>
          <span className="total-price">{total} ₽</span>
        </div>

        <button
          className="btn btn-primary checkout-btn"
          onClick={handleCreateOrder}
          disabled={creatingOrder}
        >
          {creatingOrder ? 'Оформление...' : 'Оформить заказ'}
        </button>
      </div>
    </div>
  );
}

