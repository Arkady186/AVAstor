import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authenticateWithTelegram } from '../services/auth';
import { getProducts } from '../services/products';
import type { Product } from '../services/products';
import './Home.css';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        // Authenticate with Telegram
        await authenticateWithTelegram();
        
        // Load featured products
        const response = await getProducts({ limit: 8, sort: 'created_at', order: 'DESC' });
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error initializing:', error);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  if (loading) {
    return (
      <div className="home">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="home">
      <header className="home-header">
        <h1>🛍️ AvaStore</h1>
        <p>Добро пожаловать в наш маркетплейс!</p>
      </header>

      <section className="featured-products">
        <h2>Популярные товары</h2>
        <div className="products-grid">
          {products.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`} className="product-card">
              <div className="product-image">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <div className="no-image">📦</div>
                )}
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price">
                  {product.old_price && (
                    <span className="old-price">{product.old_price} ₽</span>
                  )}
                  <span className="current-price">{product.price} ₽</span>
                </div>
                {product.rating > 0 && (
                  <div className="product-rating">
                    ⭐ {product.rating.toFixed(1)} ({product.reviews_count})
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="home-actions">
        <Link to="/products" className="btn btn-primary">
          Смотреть все товары
        </Link>
      </div>
    </div>
  );
}

