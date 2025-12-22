import type { Master } from '../data/studio'

type Props = {
  master: Master
  onClose: () => void
  onBook: (master: Master) => void
}

export function MasterDetail({ master, onClose, onBook }: Props) {
  return (
    <div className="pd">
      <div className="pd__overlay" onClick={onClose} />
      <div className="pd__sheet master-detail-sheet">
        <header className="pd__header">
          <button className="back" onClick={onClose}>Назад</button>
          <div className="ttl">{master.name}</div>
        </header>

        <div className="master-detail-content">
          <div className="master-detail-avatar" style={{ backgroundImage: `url(${master.avatar})` }} />
          
          <div className="master-detail-info">
            <div className="master-detail-rating">
              ⭐ {master.rating} ({master.reviews} отзывов)
            </div>
            <div className="master-detail-exp">Опыт: {master.experience} лет</div>
            <div className="master-detail-price">от {master.pricePerHour.toLocaleString('ru-RU')} ₽/час</div>
          </div>

          <div className="master-detail-section">
            <h3>Специализация</h3>
            <div className="master-detail-specs">
              {master.specialization.map(spec => (
                <span key={spec} className="master-detail-spec">{spec}</span>
              ))}
            </div>
          </div>

          <div className="master-detail-section">
            <h3>О мастере</h3>
            <p className="master-detail-bio">{master.bio}</p>
          </div>

          <div className="master-detail-section">
            <h3>Портфолио</h3>
            <div className="master-detail-portfolio">
              {master.portfolio.map((img, i) => (
                <div key={i} className="master-detail-portfolio-item">
                  <img src={img} alt={`Работа ${i + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary wide" onClick={() => { onBook(master); onClose(); }}>
            Записаться к мастеру
          </button>
        </div>
      </div>
    </div>
  )
}

