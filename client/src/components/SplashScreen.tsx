import './SplashScreen.css'

export function SplashScreen() {
  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="splash-basketball">🏀</div>
        <div className="splash-title">BASKETBALL</div>
        <div className="splash-subtitle">Tilt your phone to play</div>
        <div className="splash-loading">
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

