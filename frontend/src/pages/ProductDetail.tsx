import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../services/products';
import { addToCart } from '../services/cart';
import type { Product } from '../services/products';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  async function loadProduct() {
    if (!id) return;
    
    setLoading(true);
    try {
      const productData = await getProduct(parseInt(id));
      setProduct(productData);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart() {
    if (!product) return;

    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Ошибка при добавлении в корзину');
    } finally {
      setAddingToCart(false);
    }
  }

  if (loading) {
    return (
      <div className="product-detail">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail">
        <div className="error">Товар не найден</div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="product-images">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.name} />
        ) : (
          <div className="no-image">📦</div>
        )}
      </div>

      <div className="product-content">
        <h1 className="product-title">{product.name}</h1>

        {product.description && (
          <div className="product-description">
            <h3>Описание</h3>
            <p>{product.description}</p>
          </div>
        )}

        <div className="product-price-section">
          {product.old_price && (
            <span className="old-price">{product.old_price} ₽</span>
          )}
          <span className="current-price">{product.price} ₽</span>
        </div>

        {product.rating > 0 && (
          <div className="product-rating">
            ⭐ {product.rating.toFixed(1)} ({product.reviews_count} отзывов)
          </div>
        )}

        <div className="product-stock">
          {product.stock > 0 ? (
            <span className="in-stock">В наличии ({product.stock} шт.)</span>
          ) : (
            <span className="out-of-stock">Нет в наличии</span>
          )}
        </div>

        {product.stock > 0 && (
          <div className="product-actions">
            <div className="quantity-selector">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>

            <button
              className="btn btn-primary add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? 'Добавление...' : 'Добавить в корзину'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

