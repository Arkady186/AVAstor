export function Marketplace() {
  return (
    <div className="market market--white home-page">
      <header className="feelday-hero">
        <div className="feelday-logo">FEELDAY</div>
        <div className="feelday-sub">Студия художественной татуировки · Казань, ул. Четаева 20</div>
        <div className="feelday-btn-row">
          <button className="feelday-btn primary">Проконсультироваться</button>
          <button className="feelday-btn ghost">Оставить заявку</button>
        </div>
        <div className="feelday-scroll-hint">↓</div>
      </header>

      <section className="feelday-section">
        <h2 className="feelday-title">Какие услуги мы предоставляем?</h2>
        <p className="feelday-text">
          Разработка тату-эскиза с учётом всех пожеланий, 3D-визуализация на ваших фото.
          Консультация бесплатна — сориентируем по цене тату за 6 минут.
        </p>
        <div className="feelday-services">
          <div className="feelday-card">
            <h3>Разработка эскиза</h3>
            <p>Индивидуальные эскизы под вашу идею, стиль и анатомию.</p>
          </div>
          <div className="feelday-card">
            <h3>3D-визуализация</h3>
            <p>Покажем, как тату будет смотреться на вашем теле до сеанса.</p>
          </div>
          <div className="feelday-card">
            <h3>Обучение тату</h3>
            <p>Курс с официальным сертификатом, от 20 000 ₽. Практика на моделях.</p>
          </div>
        </div>
      </section>

      <section className="feelday-section muted">
        <h2 className="feelday-title">Как узнать стоимость тату?</h2>
        <p className="feelday-text">
          Пришлите часть тела, эскиз и примерный размер, или просто опишите свою идею.
          В ответ администратор задаст несколько уточняющих вопросов и подберёт мастера под ваш бюджет и стиль.
        </p>
      </section>

      <section className="feelday-stats">
        <div className="feelday-stat">
          <div className="num">7</div>
          <div className="label">мастеров</div>
        </div>
        <div className="feelday-stat">
          <div className="num">10&nbsp;000+</div>
          <div className="label">положительных отзывов</div>
        </div>
        <div className="feelday-stat">
          <div className="num">5</div>
          <div className="label">студий</div>
        </div>
      </section>

      <section className="feelday-section">
        <h2 className="feelday-title">Почему именно FEELDAY?</h2>
        <ul className="feelday-list">
          <li>Стерильно и безопасно — соблюдаем все стандарты стерилизации.</li>
          <li>Тату любой сложности — от мини до реализма и больших проектов.</li>
          <li>Запись в день обращения — есть дежурные мастера без очереди.</li>
          <li>Рассрочка 0% от 6 до 12 месяцев.</li>
          <li>Обучение с нуля с официальным сертификатом.</li>
        </ul>
      </section>

      <section className="feelday-section">
        <h2 className="feelday-title">Наши филиалы</h2>
        <div className="feelday-grid">
          <div className="feelday-card small">Казань, ул. Четаева 20</div>
          <div className="feelday-card small">Чебоксары, просп. Максима Горького, 26</div>
          <div className="feelday-card small">Йошкар-Ола, Первомайская 80</div>
          <div className="feelday-card small">Новочебоксарск, 10-й Пятилетки, 46А</div>
        </div>
      </section>

      <footer className="feelday-footer">
        <div>Студия FEELDAY Tattoo · с 2017 года</div>
        <div>Казань, Четаева, д.20</div>
      </footer>
    </div>
  )
}
