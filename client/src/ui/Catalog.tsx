import { useState } from 'react'
import { MASTERS, SERVICES, PORTFOLIO } from '../data/studio'
import type { Master, Service, PortfolioItem } from '../data/studio'

type Props = {
  onOpenMaster?: (master: Master) => void
  onOpenService?: (service: Service) => void
  onOpenPortfolio?: (item: PortfolioItem) => void
  onBookAppointment?: () => void
}

export function Catalog({ onOpenMaster, onOpenService, onOpenPortfolio, onBookAppointment }: Props) {
  const [activeTab, setActiveTab] = useState<'masters' | 'services' | 'portfolio'>('masters')
  const [query, setQuery] = useState('')

  const filteredMasters = MASTERS.filter(m => 
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.specialization.some(s => s.toLowerCase().includes(query.toLowerCase()))
  )

  const filteredServices = SERVICES.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.description.toLowerCase().includes(query.toLowerCase())
  )

  const filteredPortfolio = PORTFOLIO.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.style.toLowerCase().includes(query.toLowerCase()) ||
    p.masterName.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="market market--white catalog-page">
      <div className="catalog-header">
        <div className="catalog-tabs">
          <button
            className={`catalog-tab ${activeTab === 'masters' ? 'active' : ''}`}
            onClick={() => setActiveTab('masters')}
          >
            Мастера
          </button>
          <button
            className={`catalog-tab ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            Услуги
          </button>
          <button
            className={`catalog-tab ${activeTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            Портфолио
          </button>
        </div>
        <div className="catalog-search">
          <span className="ico search" />
          <input
            placeholder="Поиск..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>

      <main className="catalog-content">
        {activeTab === 'masters' && (
          <div className="catalog-masters">
            {filteredMasters.map(master => (
              <div
                key={master.id}
                className="catalog-master-card"
                onClick={() => onOpenMaster?.(master)}
              >
                <div className="catalog-master-avatar" style={{ backgroundImage: `url(${master.avatar})` }} />
                <div className="catalog-master-info">
                  <div className="catalog-master-name">{master.name}</div>
                  <div className="catalog-master-spec">{master.specialization.join(', ')}</div>
                  <div className="catalog-master-rating">⭐ {master.rating} ({master.reviews})</div>
                  <div className="catalog-master-price">от {master.pricePerHour.toLocaleString('ru-RU')} ₽/час</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="catalog-services-grid">
            {filteredServices.map(service => (
              <div
                key={service.id}
                className="catalog-service-card"
                onClick={() => onOpenService?.(service)}
              >
                <div className="catalog-service-img" style={{ backgroundImage: `url(${service.image})` }} />
                <div className="catalog-service-info">
                  <div className="catalog-service-category">{service.category}</div>
                  <div className="catalog-service-title">{service.title}</div>
                  <div className="catalog-service-desc">{service.description}</div>
                  <div className="catalog-service-meta">
                    <span>{service.duration} мин</span>
                    {service.price > 0 ? (
                      <span className="catalog-service-price">{service.price.toLocaleString('ru-RU')} ₽</span>
                    ) : (
                      <span className="catalog-service-price">Бесплатно</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="catalog-portfolio-grid">
            {filteredPortfolio.map(item => (
              <div
                key={item.id}
                className="catalog-portfolio-item"
                onClick={() => onOpenPortfolio?.(item)}
              >
                <div className="catalog-portfolio-img" style={{ backgroundImage: `url(${item.images[0]})` }} />
                <div className="catalog-portfolio-overlay">
                  <div className="catalog-portfolio-title">{item.title}</div>
                  <div className="catalog-portfolio-master">{item.masterName}</div>
                  <div className="catalog-portfolio-likes">❤️ {item.likes}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <div className="catalog-fab" onClick={onBookAppointment}>
        <span>📅</span>
        <span>Записаться</span>
      </div>
    </div>
  )
}
