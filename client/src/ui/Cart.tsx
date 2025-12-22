import { useState } from 'react'
import type { Appointment } from '../data/studio'

type CartProps = {
  appointments: Appointment[]
  onCancel?: (id: string) => void
}

export function Cart({ appointments, onCancel }: CartProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all')

  const filteredAppointments = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status === filter)

  const getStatusLabel = (status: Appointment['status']) => {
    switch (status) {
      case 'pending': return 'Ожидает подтверждения'
      case 'confirmed': return 'Подтверждена'
      case 'completed': return 'Завершена'
      case 'cancelled': return 'Отменена'
    }
  }

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'pending': return '#f39c12'
      case 'confirmed': return '#2ecc71'
      case 'completed': return '#95a5a6'
      case 'cancelled': return '#e74c3c'
    }
  }

  return (
    <div className="cart market market--white cart-page">
      <div className="cart-header-section">
        <h2 className="cart-page-title">Мои записи</h2>
        <div className="cart-filters">
          <button
            className={`cart-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Все
          </button>
          <button
            className={`cart-filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Ожидают
          </button>
          <button
            className={`cart-filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            Подтверждены
          </button>
          <button
            className={`cart-filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Завершены
          </button>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="cart-empty">
          {filter === 'all' 
            ? 'У вас пока нет записей'
            : `Нет записей со статусом "${getStatusLabel(filter as any)}"`}
        </div>
      ) : (
        <div className="cart-items">
          {filteredAppointments.map(appointment => {
            const date = new Date(appointment.date)
            const dateStr = date.toLocaleDateString('ru-RU', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })

            return (
              <div key={appointment.id} className="cart-item appointment-item">
                <div className="appointment-status" style={{ backgroundColor: getStatusColor(appointment.status) }}>
                  {getStatusLabel(appointment.status)}
                </div>
                <div className="appointment-content">
                  <div className="appointment-service">{appointment.serviceTitle}</div>
                  <div className="appointment-master">Мастер: {appointment.masterName}</div>
                  <div className="appointment-date">
                    📅 {dateStr} в {appointment.time}
                  </div>
                  <div className="appointment-duration">⏱️ {appointment.duration} минут</div>
                  {appointment.price > 0 && (
                    <div className="appointment-price">
                      💰 {appointment.price.toLocaleString('ru-RU')} ₽
                    </div>
                  )}
                  {appointment.notes && (
                    <div className="appointment-notes">
                      <strong>Примечания:</strong> {appointment.notes}
                    </div>
                  )}
                  {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                    <button
                      className="appointment-cancel"
                      onClick={() => onCancel?.(appointment.id)}
                    >
                      Отменить запись
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
