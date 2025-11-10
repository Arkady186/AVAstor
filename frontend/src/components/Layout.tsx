import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="layout">
      <main className="main-content">{children}</main>
      <nav className="bottom-nav">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Главная</span>
        </Link>
        <Link to="/products" className={`nav-item ${location.pathname === '/products' ? 'active' : ''}`}>
          <span className="nav-icon">🛍️</span>
          <span className="nav-label">Каталог</span>
        </Link>
        <Link to="/cart" className={`nav-item ${location.pathname === '/cart' ? 'active' : ''}`}>
          <span className="nav-icon">🛒</span>
          <span className="nav-label">Корзина</span>
        </Link>
        <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
          <span className="nav-icon">👤</span>
          <span className="nav-label">Профиль</span>
        </Link>
      </nav>
    </div>
  );
}

