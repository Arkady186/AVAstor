import { useState } from 'react'
import type { PortfolioItem } from '../data/studio'

type Props = {
  item: PortfolioItem
  onClose: () => void
}

export function PortfolioDetail({ item, onClose }: Props) {
  const [currentImage, setCurrentImage] = useState(0)

  return (
    <div className="pd">
      <div className="pd__overlay" onClick={onClose} />
      <div className="pd__sheet portfolio-detail-sheet">
        <header className="pd__header">
          <button className="back" onClick={onClose}>Назад</button>
          <div className="ttl">{item.title}</div>
        </header>

        <div className="portfolio-detail-content">
          <div className="portfolio-detail-gallery">
            <div className="portfolio-detail-main-img">
              <img src={item.images[currentImage]} alt={item.title} />
            </div>
            {item.images.length > 1 && (
              <div className="portfolio-detail-thumbs">
                {item.images.map((img, i) => (
                  <button
                    key={i}
                    className={`portfolio-detail-thumb ${currentImage === i ? 'active' : ''}`}
                    onClick={() => setCurrentImage(i)}
                  >
                    <img src={img} alt={`${item.title} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="portfolio-detail-info">
            <div className="portfolio-detail-title">{item.title}</div>
            <div className="portfolio-detail-meta">
              <span className="portfolio-detail-style">{item.style}</span>
              <span className="portfolio-detail-master">Мастер: {item.masterName}</span>
            </div>
            {item.description && (
              <div className="portfolio-detail-desc">{item.description}</div>
            )}
            <div className="portfolio-detail-likes">❤️ {item.likes} лайков</div>
          </div>
        </div>
      </div>
    </div>
  )
}

