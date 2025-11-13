type ProfileProps = {
  displayName?: string | null
  username?: string | null
  photoUrl?: string | null
}

const viewedProducts = [
  { id: 'v1', title: 'Сумка двухцветная', price: 1782, originalPrice: 6046, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop', discount: 68 },
  { id: 'v2', title: 'Сумка черная', price: 2155, originalPrice: 12500, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=400&auto=format&fit=crop', discount: 81 },
  { id: 'v3', title: 'Сумка женская', price: 2550, originalPrice: 9000, image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?q=80&w=400&auto=format&fit=crop', discount: 72 },
]

export function Profile({ displayName, username, photoUrl }: ProfileProps) {
  const fallback = 'https://avatars.githubusercontent.com/u/9919?s=200&v=4'
  const avatar = photoUrl || (username ? `https://t.me/i/userpic/160/${username}.jpg` : fallback)
  return (
    <div className="profile market market--white profile-page">
      <div className="profile-top">
        <img className="profile-avatar" src={avatar} alt="avatar" onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallback }} />
        <div className="profile-name-section">
          <div className="profile-name">{displayName || 'Гость'}</div>
          <div className="profile-settings">Данные и настройки &gt;</div>
        </div>
      </div>

      <section className="profile-banners">
        <div className="profile-banner club">
          <div className="banner-text">клуб</div>
          <div className="banner-badge">6</div>
          <div className="banner-dot">2</div>
        </div>
        <div className="profile-banner discount">
          <div className="banner-text">Скидка &gt;</div>
          <div className="banner-text-small">до 40 %</div>
        </div>
        <div className="profile-banner payment">
          <div className="banner-text">Оплата при получении</div>
          <div className="banner-text-small">до 500 000 ₽</div>
        </div>
      </section>

      <section className="profile-bank">
        <div className="bank-info">
          <div className="bank-amount">7 ₽ &gt;</div>
          <div className="bank-label">avastore Банк</div>
        </div>
        <button className="bank-topup">Пополнить</button>
      </section>

      <section className="profile-contest">
        <div className="contest-info">
          <div className="contest-diamond">1</div>
          <div className="contest-text">Выиграйте квартиру &gt;</div>
          <div className="contest-subtext">Итоги подведены — победители известны!</div>
        </div>
        <button className="contest-btn">К результатам</button>
      </section>

      <section className="profile-orders">
        <div className="order-section">
          <div className="order-title">Заказы</div>
          <div className="order-subtitle">Ближайшие: не ожидаются</div>
          <div className="order-qr">Получите товары по QR-коду или номеру телефона и коду 06784</div>
          <div className="order-qr-code">[QR]</div>
        </div>
        <div className="order-section">
          <div className="order-title">Покупки</div>
          <div className="order-subtitle">Здесь можно купить что-то заново</div>
        </div>
        <div className="order-section">
          <div className="order-title">Лист ожидания</div>
          <div className="order-subtitle">В наличии: 0/0</div>
        </div>
        <div className="order-section">
          <div className="order-title">Отложенные</div>
        </div>
        <div className="order-section">
          <div className="order-title">Лотерейные билеты</div>
        </div>
      </section>

      <section className="profile-viewed">
        <h2 className="section-title">Вы смотрели</h2>
        <div className="viewed-scroll">
          {viewedProducts.map(p => (
            <div className="viewed-card" key={p.id}>
              <button className="viewed-heart">♡</button>
              <div className="viewed-img" style={{ backgroundImage: `url(${p.image})` }} />
              <div className="viewed-badge">-{p.discount}% АКЦИЯ 11.11</div>
              <div className="viewed-price">
                <span className="viewed-new">{p.price.toLocaleString('ru-RU')} ₽</span>
                {p.originalPrice && <span className="viewed-old">{p.originalPrice.toLocaleString('ru-RU')} ₽</span>}
              </div>
              <div className="viewed-wallet">с avastore Кошельком</div>
            </div>
          ))}
        </div>
      </section>

      <section className="profile-services">
        <h2 className="section-title">Сервисы</h2>
        <div className="services-grid">
          <button className="service-tile"><span className="service-icon">🎵</span>wibes</button>
          <button className="service-tile"><span className="service-icon">✈️</span>Travel</button>
          <button className="service-tile"><span className="service-icon">💊</span>Еаптека</button>
          <button className="service-tile"><span className="service-icon">💄</span>РИВ ГОШ</button>
          <button className="service-tile"><span className="service-icon">📦</span>Pec</button>
        </div>
      </section>
    </div>
  )
}
