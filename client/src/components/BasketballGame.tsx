import { useEffect, useRef, useState, useCallback } from 'react'
import './BasketballGame.css'

interface Ball {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

export function BasketballGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [isShooting, setIsShooting] = useState(false)
  const [orientation, setOrientation] = useState({ beta: 0, gamma: 0 })
  const [permissionRequested, setPermissionRequested] = useState(false)
  const [showPermissionButton, setShowPermissionButton] = useState(false)
  const ballRef = useRef<Ball>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 20,
  })
  const animationFrameRef = useRef<number>()
  const lastShakeTime = useRef<number>(0)
  const handleShootRef = useRef<() => void>()
  const lastAccelerationYRef = useRef<number>(0)

  const CANVAS_WIDTH = 400
  const CANVAS_HEIGHT = 600
  const HOOP_X = CANVAS_WIDTH / 2
  const HOOP_Y = 100
  const HOOP_WIDTH = 80
  const HOOP_HEIGHT = 10
  const GRAVITY = 0.5
  const FRICTION = 0.98
  const BOUNCE = 0.7

  const checkCollision = useCallback((ball: Ball): boolean => {
    // Проверка попадания в кольцо
    const dx = ball.x - HOOP_X
    const dy = ball.y - HOOP_Y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // Попадание в кольцо (мяч проходит через центр кольца)
    // Увеличена зона попадания для более легкого засчитывания
    if (distance < HOOP_WIDTH / 2 + 5 && ball.y > HOOP_Y - 10 && ball.y < HOOP_Y + 20) {
      return true
    }
    return false
  }, [])

  const resetBall = useCallback(() => {
    ballRef.current = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 100,
      vx: 0,
      vy: 0,
      radius: 20,
    }
  }, [])

  useEffect(() => {
    resetBall()
  }, [resetBall])

  const handleShoot = useCallback(() => {
    if (isShooting) return
    
    setIsShooting(true)
    const ball = ballRef.current
    
    // Мяч всегда подбрасывается вертикально вверх
    const upwardSpeed = 25 // Скорость подбрасывания вверх (увеличена)
    
    ball.vx = 0 // Без горизонтального движения
    ball.vy = -upwardSpeed // Вертикально вверх (отрицательное значение = вверх)
  }, [isShooting])

  useEffect(() => {
    handleShootRef.current = handleShoot
  }, [handleShoot])

  const requestPermission = useCallback(async () => {
    try {
      let orientationGranted = true
      let motionGranted = true
      
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission()
          orientationGranted = permission === 'granted'
          if (!orientationGranted) {
            console.warn('Orientation permission denied')
          } else {
            console.log('Orientation permission granted')
          }
        } catch (error) {
          console.error('Error requesting orientation permission:', error)
          orientationGranted = false
        }
      }
      
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceMotionEvent as any).requestPermission()
          motionGranted = permission === 'granted'
          if (!motionGranted) {
            console.warn('Motion permission denied')
          } else {
            console.log('Motion permission granted')
          }
        } catch (error) {
          console.error('Error requesting motion permission:', error)
          motionGranted = false
        }
      }
      
      setPermissionRequested(true)
      return orientationGranted && motionGranted
    } catch (error) {
      console.error('Error requesting sensor permissions:', error)
      setPermissionRequested(true)
      return false
    }
  }, [])

  const initSensors = useCallback(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      try {
        if (e.beta !== null && e.gamma !== null) {
          setOrientation({
            beta: e.beta,
            gamma: e.gamma,
          })
        }
      } catch (error) {
        console.error('Error handling orientation:', error)
      }
    }

    const handleMotion = (e: DeviceMotionEvent) => {
      try {
        if (e.accelerationIncludingGravity) {
          const { x, y, z } = e.accelerationIncludingGravity
          if (x !== null && y !== null && z !== null) {
            // Определяем взмах вверх по резкому изменению ускорения по оси Y
            // При взмахе вверх ускорение Y резко уменьшается (становится более отрицательным)
            const currentAccelerationY = y
            const accelerationDelta = lastAccelerationYRef.current - currentAccelerationY
            
            // Порог для определения взмаха вверх (резкое движение вверх)
            const upwardSwipeThreshold = 8
            
            if (accelerationDelta > upwardSwipeThreshold) {
              const now = Date.now()
              if (now - lastShakeTime.current > 500) {
                lastShakeTime.current = now
                if (handleShootRef.current) {
                  handleShootRef.current()
                }
              }
            }
            
            lastAccelerationYRef.current = currentAccelerationY
          }
        }
      } catch (error) {
        console.error('Error handling motion:', error)
      }
    }

    setTimeout(() => {
      try {
        const orientationHandler = handleOrientation as EventListener
        const motionHandler = handleMotion as EventListener
        
        if ('DeviceOrientationEvent' in window) {
          window.addEventListener('deviceorientation', orientationHandler, { passive: true } as any)
        }
        
        if ('DeviceMotionEvent' in window) {
          window.addEventListener('devicemotion', motionHandler, { passive: true } as any)
        }
      } catch (error) {
        console.error('Error adding sensor listeners:', error)
      }
    }, 100)
  }, [])

  useEffect(() => {
    const needsPermission = 
      typeof (DeviceOrientationEvent as any).requestPermission === 'function' ||
      typeof (DeviceMotionEvent as any).requestPermission === 'function'
    
    if (needsPermission && !permissionRequested) {
      setShowPermissionButton(true)
    } else {
      initSensors()
    }
  }, [permissionRequested, initSensors])

  const handleRequestPermission = async () => {
    const granted = await requestPermission()
    if (granted) {
      setShowPermissionButton(false)
      initSensors()
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      if (!ctx) return

      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      const ball = ballRef.current

      if (!isShooting) {
        // Движение по X как было (прямое слева направо)
        const targetX = CANVAS_WIDTH / 2 + (orientation.gamma / 90) * (CANVAS_WIDTH / 2 - ball.radius - 20)
        ball.x += (targetX - ball.x) * 0.1
        ball.x = Math.max(ball.radius, Math.min(CANVAS_WIDTH - ball.radius, ball.x))
        
        // Движение по Y по полукругу (вогнутому вверх)
        // Внешняя часть полукруга касается середины нижней платформы
        const baseY = CANVAS_HEIGHT - 100 // Уровень платформы (середина)
        const arcRadius = 80 // Радиус полукруга (высота арки)
        const centerX = CANVAS_WIDTH / 2 // Центр платформы
        
        // Расстояние от центра платформы до текущей позиции мяча
        const distanceFromCenter = Math.abs(ball.x - centerX)
        const maxDistance = CANVAS_WIDTH / 2 - ball.radius // Максимальное расстояние до края
        
        // Вычисляем Y по дуге: в центре мяч на платформе, на краях выше
        // Используем формулу полукруга: y = baseY - sqrt(arcRadius^2 - (x - centerX)^2)
        // Но упростим: чем дальше от центра, тем выше мяч
        const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1)
        const targetY = baseY - Math.sin(normalizedDistance * Math.PI / 2) * arcRadius
        
        ball.y += (targetY - ball.y) * 0.1
      } else {
        ball.vy += GRAVITY
        ball.x += ball.vx
        ball.y += ball.vy
        
        ball.vx *= FRICTION
        ball.vy *= FRICTION

        if (checkCollision(ball)) {
          // Увеличиваем счет при попадании в корзину
          setScore(prev => prev + 1)
          console.log('Basket! Score:', score + 1)
          setTimeout(() => {
            resetBall()
            setIsShooting(false)
          }, 500)
          return
        }

        if (ball.x <= ball.radius || ball.x >= CANVAS_WIDTH - ball.radius) {
          ball.vx *= -BOUNCE
          ball.x = Math.max(ball.radius, Math.min(CANVAS_WIDTH - ball.radius, ball.x))
        }

        if (ball.y >= CANVAS_HEIGHT - ball.radius) {
          ball.vy *= -BOUNCE
          ball.y = CANVAS_HEIGHT - ball.radius
          
          if (Math.abs(ball.vy) < 0.5 && Math.abs(ball.vx) < 0.5) {
            setTimeout(() => {
              resetBall()
              setIsShooting(false)
            }, 500)
          }
        }

        if (ball.y < -ball.radius) {
          setTimeout(() => {
            resetBall()
            setIsShooting(false)
          }, 500)
        }
      }

      // Рисуем кольцо
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(HOOP_X - HOOP_WIDTH / 2, HOOP_Y)
      ctx.lineTo(HOOP_X + HOOP_WIDTH / 2, HOOP_Y)
      ctx.stroke()

      // Рисуем сетку кольца
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      for (let i = 0; i < 5; i++) {
        const x = HOOP_X - HOOP_WIDTH / 2 + (HOOP_WIDTH / 4) * i
        ctx.beginPath()
        ctx.moveTo(x, HOOP_Y)
        ctx.lineTo(HOOP_X, HOOP_Y + 30)
        ctx.stroke()
      }

      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.strokeStyle = '#1a1a2e'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(ball.x - ball.radius, ball.y)
      ctx.lineTo(ball.x + ball.radius, ball.y)
      ctx.stroke()

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isShooting, orientation, checkCollision, resetBall])

  return (
    <div className="game-container">
      {showPermissionButton && (
        <div className="permission-overlay">
          <div className="permission-modal">
            <div className="permission-title">Разрешение на датчики</div>
            <div className="permission-text">
              Для игры нужен доступ к гироскопу и акселерометру вашего устройства.
            </div>
            <button 
              className="permission-button"
              onClick={handleRequestPermission}
            >
              Разрешить доступ
            </button>
          </div>
        </div>
      )}
      <div className="game-header">
        <div className="score">Score: {score}</div>
        <div className="instructions">
          {!isShooting ? 'Tilt to aim, press button to shoot!' : 'Ball in the air!'}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="game-canvas"
      />
      <div className="game-footer">
        <button 
          className="shoot-button"
          onClick={handleShoot}
          disabled={isShooting}
        >
          🏀 SHOOT
        </button>
      </div>
    </div>
  )
}
