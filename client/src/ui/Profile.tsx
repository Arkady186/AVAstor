type ProfileProps = {
  displayName?: string | null
  username?: string | null
  photoUrl?: string | null
}

export function Profile({ displayName, username, photoUrl }: ProfileProps) {
  const fallback = 'https://avatars.githubusercontent.com/u/9919?s=200&v=4'
  const avatar = photoUrl || (username ? `https://t.me/i/userpic/160/${username}.jpg` : fallback)
  return (
    <div className="profile market market--white">
      <header className="profile__header">
        <img className="avatar" src={avatar} alt="avatar" onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallback }} />
        <div className="profile__meta">
          <div className="name">{displayName || 'Гость'}</div>
          <div className="username">{username ? '@' + username : 'не авторизован'}</div>
        </div>
      </header>

      <section className="tiles">
        <button className="tile"><span className="ti bonus" />7% Скидка</button>
        <button className="tile"><span className="ti money" />Финансы</button>
        <button className="tile"><span className="ti truck" />Доставки</button>
        <button className="tile"><span className="ti heart" />Отложенные</button>
        <button className="tile"><span className="ti list" />Лист ожидания</button>
        <button className="tile"><span className="ti bag" />Покупки</button>
        <button className="tile"><span className="ti play" />Видео</button>
        <button className="tile"><span className="ti card" />Мои способы оплаты</button>
        <button className="tile"><span className="ti star" />Любимые бренды</button>
        <button className="tile"><span className="ti qa" />Отзывы и вопросы</button>
        <button className="tile"><span className="ti device" />Активные сеансы</button>
        <button className="tile"><span className="ti point" />Пункты самовывоза</button>
        <button className="tile"><span className="ti city" />Город: Москва</button>
        <button className="tile"><span className="ti flag" />Страна: Россия</button>
      </section>
    </div>
  )
}


