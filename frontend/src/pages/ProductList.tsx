import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/products';
import type { Product, ProductFilters } from '../services/products';
import './ProductList.css';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 20,
    sort: 'created_at',
    order: 'DESC',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    loadProducts();
  }, [filters]);

  async function loadProducts() {
    setLoading(true);
    try {
      const response = await getProducts(filters);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setFilters({ ...filters, search: e.target.value || undefined, page: 1 });
  }

  if (loading && products.length === 0) {
    return (
      <div className="product-list">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="product-list">
      <header className="product-list-header">
        <h1>Каталог товаров</h1>
        <input
          type="text"
          placeholder="Поиск товаров..."
          className="search-input"
          onChange={handleSearch}
        />
      </header>

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

      {products.length === 0 && !loading && (
        <div className="empty-state">
          <p>Товары не найдены</p>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            disabled={pagination.page === 1}
            onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
          >
            Назад
          </button>
          <span>
            Страница {pagination.page} из {pagination.pages}
          </span>
          <button
            disabled={pagination.page === pagination.pages}
            onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  );
}

