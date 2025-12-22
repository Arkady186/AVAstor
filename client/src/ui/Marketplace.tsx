import { useState } from 'react'
import { MASTERS, PORTFOLIO } from '../data/studio'
import type { Master, PortfolioItem } from '../data/studio'

type Props = {
  onOpenMaster?: (master: Master) => void
  onOpenPortfolio?: (item: PortfolioItem) => void
  onBookAppointment?: () => void
}

export function Marketplace({ onOpenMaster, onOpenPortfolio, onBookAppointment }: Props) {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  
  const featuredMasters = MASTERS.slice(0, 3)
  const featuredPortfolio = PORTFOLIO.slice(0, 6)
  const filteredPortfolio = selectedStyle 
    ? featuredPortfolio.filter(p => p.style === selectedStyle)
    : featuredPortfolio

  const styles = ['Реализм', 'Минимализм', 'Олдскул', 'Геометрия', 'Акварель', 'Японский']

  return (
    <div className="market market--white home-page">
      <header className="ink-hero">
        <div className="ink-logo">INK&ART<span className="ink-logo-accent">studio</span></div>
        <div className="ink-sub">Студия художественной татуировки · Профессиональные мастера</div>
        <div className="ink-btn-row">
          <button className="ink-btn primary" onClick={onBookAppointment}>
            Записаться на сеанс
          </button>
          <button className="ink-btn ghost">
            Консультация
          </button>
        </div>
        <div className="ink-scroll-hint">↓</div>
      </header>

      <section className="ink-section">
        <h2 className="ink-title">Наши мастера</h2>
        <p className="ink-text">
          Профессиональные тату-мастера с многолетним опытом. Каждый специализируется на своём стиле.
        </p>
        <div className="ink-masters">
          {featuredMasters.map(master => (
            <div 
              key={master.id} 
              className="ink-master-card"
              onClick={() => onOpenMaster?.(master)}
            >
              <div className="ink-master-avatar" style={{ backgroundImage: `url(${master.avatar})` }} />
              <div className="ink-master-info">
                <div className="ink-master-name">{master.name}</div>
                <div className="ink-master-spec">{master.specialization.join(', ')}</div>
                <div className="ink-master-rating">
                  ⭐ {master.rating} ({master.reviews} отзывов)
                </div>
                <div className="ink-master-price">от {master.pricePerHour.toLocaleString('ru-RU')} ₽/час</div>
              </div>
            </div>
          ))}
        </div>
        <button className="ink-btn-link" onClick={() => window.location.hash = '#catalog'}>
          Все мастера →
        </button>
      </section>

      <section className="ink-section muted">
        <h2 className="ink-title">Портфолио</h2>
        <p className="ink-text">
          Посмотрите работы наших мастеров. Каждая татуировка — произведение искусства.
        </p>
        <div className="ink-style-filters">
          {styles.map(style => (
            <button
              key={style}
              className={`ink-style-chip ${selectedStyle === style ? 'active' : ''}`}
              onClick={() => setSelectedStyle(selectedStyle === style ? null : style)}
            >
              {style}
            </button>
          ))}
        </div>
        <div className="ink-portfolio-grid">
          {filteredPortfolio.map(item => (
            <div
              key={item.id}
              className="ink-portfolio-item"
              onClick={() => onOpenPortfolio?.(item)}
            >
              <div className="ink-portfolio-img" style={{ backgroundImage: `url(${item.images[0]})` }} />
              <div className="ink-portfolio-overlay">
                <div className="ink-portfolio-title">{item.title}</div>
                <div className="ink-portfolio-master">{item.masterName}</div>
                <div className="ink-portfolio-likes">❤️ {item.likes}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ink-section">
        <h2 className="ink-title">Почему выбирают нас?</h2>
        <div className="ink-features">
          <div className="ink-feature-card">
            <div className="ink-feature-icon">🛡️</div>
            <h3>Стерильность</h3>
            <p>Строгое соблюдение всех стандартов стерилизации и безопасности</p>
          </div>
          <div className="ink-feature-card">
            <div className="ink-feature-icon">🎨</div>
            <h3>Индивидуальный подход</h3>
            <p>Разработка уникального эскиза под вашу идею и анатомию</p>
          </div>
          <div className="ink-feature-card">
            <div className="ink-feature-icon">⭐</div>
            <h3>Опытные мастера</h3>
            <p>Только профессионалы с многолетним опытом и портфолио</p>
          </div>
          <div className="ink-feature-card">
            <div className="ink-feature-icon">💳</div>
            <h3>Рассрочка</h3>
            <p>Возможность оплаты в рассрочку без переплат</p>
          </div>
        </div>
      </section>

      <section className="ink-stats">
        <div className="ink-stat">
          <div className="num">{MASTERS.length}</div>
          <div className="label">мастеров</div>
        </div>
        <div className="ink-stat">
          <div className="num">500+</div>
          <div className="label">выполненных работ</div>
        </div>
        <div className="ink-stat">
          <div className="num">4.9</div>
          <div className="label">средний рейтинг</div>
        </div>
      </section>

      <section className="ink-section">
        <h2 className="ink-title">Как записаться?</h2>
        <div className="ink-steps">
          <div className="ink-step">
            <div className="ink-step-num">1</div>
            <div className="ink-step-content">
              <h3>Выберите мастера</h3>
              <p>Просмотрите портфолио и выберите мастера, стиль которого вам подходит</p>
            </div>
          </div>
          <div className="ink-step">
            <div className="ink-step-num">2</div>
            <div className="ink-step-content">
              <h3>Запишитесь на консультацию</h3>
              <p>Обсудите идею, размер и расположение татуировки с мастером</p>
            </div>
          </div>
          <div className="ink-step">
            <div className="ink-step-num">3</div>
            <div className="ink-step-content">
              <h3>Выберите дату и время</h3>
              <p>Забронируйте удобное для вас время сеанса</p>
            </div>
          </div>
          <div className="ink-step">
            <div className="ink-step-num">4</div>
            <div className="ink-step-content">
              <h3>Приходите на сеанс</h3>
              <p>Получите качественную татуировку от профессионала</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="ink-footer">
        <div>INK&ARTstudio · Студия татуировки</div>
        <div>Работаем ежедневно с 10:00 до 22:00</div>
        <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.7 }}>
          📍 г. Москва, ул. Примерная, д. 10
        </div>
      </footer>
    </div>
  )
}
