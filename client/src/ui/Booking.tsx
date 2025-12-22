import { useState } from 'react'
import { MASTERS, SERVICES } from '../data/studio'
import type { Master, Service, Appointment } from '../data/studio'

type Props = {
  onClose: () => void
  onConfirm: (appointment: Omit<Appointment, 'id' | 'status'>) => void
}

export function Booking({ onClose, onConfirm }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedMaster, setSelectedMaster] = useState<Master | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [notes, setNotes] = useState<string>('')

  // Генерируем доступные даты (следующие 14 дней)
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 1)
    return date.toISOString().split('T')[0]
  })

  // Генерируем доступные времена (10:00 - 20:00, каждый час)
  const availableTimes = Array.from({ length: 11 }, (_, i) => {
    const hour = 10 + i
    return `${hour.toString().padStart(2, '0')}:00`
  })

  const handleNext = () => {
    if (step === 1 && selectedMaster && selectedService) {
      setStep(2)
    } else if (step === 2 && selectedDate && selectedTime) {
      setStep(3)
    }
  }

  const handleConfirm = () => {
    if (selectedMaster && selectedService && selectedDate && selectedTime) {
      onConfirm({
        masterId: selectedMaster.id,
        masterName: selectedMaster.name,
        serviceId: selectedService.id,
        serviceTitle: selectedService.title,
        date: selectedDate,
        time: selectedTime,
        duration: selectedService.duration,
        price: selectedService.price,
        notes,
      })
      onClose()
    }
  }

  return (
    <div className="pd">
      <div className="pd__overlay" onClick={onClose} />
      <div className="pd__sheet booking-sheet">
        <header className="pd__header">
          <button className="back" onClick={onClose}>Назад</button>
          <div className="ttl">Запись на сеанс</div>
        </header>

        <div className="booking-steps">
          <div className={`booking-step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`booking-step ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className={`booking-step ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        {step === 1 && (
          <div className="booking-content">
            <h3 className="booking-section-title">Выберите мастера</h3>
            <div className="booking-masters">
              {MASTERS.filter(m => m.available).map(master => (
                <div
                  key={master.id}
                  className={`booking-master-card ${selectedMaster?.id === master.id ? 'selected' : ''}`}
                  onClick={() => setSelectedMaster(master)}
                >
                  <div className="booking-master-avatar" style={{ backgroundImage: `url(${master.avatar})` }} />
                  <div className="booking-master-info">
                    <div className="booking-master-name">{master.name}</div>
                    <div className="booking-master-spec">{master.specialization.join(', ')}</div>
                    <div className="booking-master-rating">⭐ {master.rating} ({master.reviews})</div>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="booking-section-title" style={{ marginTop: '24px' }}>Выберите услугу</h3>
            <div className="booking-services">
              {SERVICES.map(service => (
                <div
                  key={service.id}
                  className={`booking-service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
                  onClick={() => setSelectedService(service)}
                >
                  <div className="booking-service-info">
                    <div className="booking-service-title">{service.title}</div>
                    <div className="booking-service-desc">{service.description}</div>
                    <div className="booking-service-meta">
                      <span>{service.duration} мин</span>
                      {service.price > 0 && (
                        <span className="booking-service-price">{service.price.toLocaleString('ru-RU')} ₽</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="btn-primary wide"
              onClick={handleNext}
              disabled={!selectedMaster || !selectedService}
              style={{ marginTop: '24px' }}
            >
              Далее
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="booking-content">
            <h3 className="booking-section-title">Выберите дату и время</h3>
            
            <div className="booking-dates">
              <div className="booking-dates-label">Дата</div>
              <div className="booking-dates-grid">
                {availableDates.map(date => {
                  const d = new Date(date)
                  const dayName = d.toLocaleDateString('ru-RU', { weekday: 'short' })
                  const dayNum = d.getDate()
                  const month = d.toLocaleDateString('ru-RU', { month: 'short' })
                  
                  return (
                    <button
                      key={date}
                      className={`booking-date-btn ${selectedDate === date ? 'selected' : ''}`}
                      onClick={() => setSelectedDate(date)}
                    >
                      <div className="booking-date-day">{dayName}</div>
                      <div className="booking-date-num">{dayNum}</div>
                      <div className="booking-date-month">{month}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="booking-times">
              <div className="booking-times-label">Время</div>
              <div className="booking-times-grid">
                {availableTimes.map(time => (
                  <button
                    key={time}
                    className={`booking-time-btn ${selectedTime === time ? 'selected' : ''}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="booking-actions">
              <button className="btn-secondary" onClick={() => setStep(1)}>Назад</button>
              <button
                className="btn-primary"
                onClick={handleNext}
                disabled={!selectedDate || !selectedTime}
              >
                Далее
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="booking-content">
            <h3 className="booking-section-title">Подтверждение записи</h3>
            
            <div className="booking-summary">
              <div className="booking-summary-item">
                <span>Мастер:</span>
                <span className="booking-summary-value">{selectedMaster?.name}</span>
              </div>
              <div className="booking-summary-item">
                <span>Услуга:</span>
                <span className="booking-summary-value">{selectedService?.title}</span>
              </div>
              <div className="booking-summary-item">
                <span>Дата:</span>
                <span className="booking-summary-value">
                  {selectedDate && new Date(selectedDate).toLocaleDateString('ru-RU', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </span>
              </div>
              <div className="booking-summary-item">
                <span>Время:</span>
                <span className="booking-summary-value">{selectedTime}</span>
              </div>
              <div className="booking-summary-item">
                <span>Длительность:</span>
                <span className="booking-summary-value">{selectedService?.duration} минут</span>
              </div>
              <div className="booking-summary-item">
                <span>Стоимость:</span>
                <span className="booking-summary-price">
                  {selectedService?.price ? `${selectedService.price.toLocaleString('ru-RU')} ₽` : 'Бесплатно'}
                </span>
              </div>
            </div>

            <div className="booking-notes">
              <label>Дополнительные пожелания (необязательно)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Опишите вашу идею, размер, расположение татуировки..."
                rows={4}
              />
            </div>

            <div className="booking-actions">
              <button className="btn-secondary" onClick={() => setStep(2)}>Назад</button>
              <button className="btn-primary" onClick={handleConfirm}>
                Подтвердить запись
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

