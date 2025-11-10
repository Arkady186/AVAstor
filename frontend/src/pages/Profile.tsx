import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';
import api from '../utils/api';
import type { User } from '../services/auth';
import './Profile.css';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    try {
      const userData = await getCurrentUser();
      setUser(userData);

      // Load orders
      const ordersResponse = await api.get('/orders');
      if (ordersResponse.data.success) {
        setOrders(ordersResponse.data.data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  if (loading) {
    return (
      <div className="profile">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="profile">
      <h1>Профиль</h1>

      {user && (
        <div className="profile-info">
          <div className="profile-avatar">
            {user.first_name?.[0] || '👤'}
          </div>
          <h2>
            {user.first_name} {user.last_name}
          </h2>
          {user.username && (
            <p className="profile-username">@{user.username}</p>
          )}
        </div>
      )}

      <div className="profile-section">
        <h3>Мои заказы</h3>
        {orders.length === 0 ? (
          <div className="empty-orders">
            <p>У вас пока нет заказов</p>
            <Link to="/products" className="btn btn-primary">
              Перейти к каталогу
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-item">
                <div className="order-header">
                  <span className="order-id">Заказ #{order.id}</span>
                  <span className={`order-status status-${order.status}`}>
                    {order.status === 'pending' && 'Ожидает'}
                    {order.status === 'processing' && 'В обработке'}
                    {order.status === 'shipped' && 'Отправлен'}
                    {order.status === 'delivered' && 'Доставлен'}
                    {order.status === 'cancelled' && 'Отменен'}
                  </span>
                </div>
                <div className="order-info">
                  <span className="order-date">
                    {new Date(order.created_at).toLocaleDateString('ru-RU')}
                  </span>
                  <span className="order-total">{order.total_amount} ₽</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="profile-actions">
        <button className="btn btn-secondary" onClick={handleLogout}>
          Выйти
        </button>
      </div>
    </div>
  );
}

