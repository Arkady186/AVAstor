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
    if (distance < HOOP_WIDTH / 2 && ball.y > HOOP_Y - 5 && ball.y < HOOP_Y + 15) {
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
    
    // Вычисляем скорость броска на основе наклона устройства
    // gamma влияет на горизонтальную скорость, beta на вертикальную
    const maxSpeed = 15
    ball.vx = (orientation.gamma / 90) * maxSpeed
    ball.vy = -(Math.abs(orientation.beta) / 90) * maxSpeed - 8 // базовая скорость вверх
    
    // Ограничиваем максимальную скорость
    const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy)
    if (speed > maxSpeed) {
      ball.vx = (ball.vx / speed) * maxSpeed
      ball.vy = (ball.vy / speed) * maxSpeed
    }
  }, [isShooting, orientation])

  // Сохраняем актуальную версию функции в ref
  useEffect(() => {
    handleShootRef.current = handleShoot
  }, [handleShoot])

  useEffect(() => {
    const requestPermission = async () => {
      try {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          const permission = await (DeviceOrientationEvent as any).requestPermission()
          if (permission !== 'granted') {
            console.warn('Orientation permission denied')
            return false
          }
        }
        
        if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
          const permission = await (DeviceMotionEvent as any).requestPermission()
          if (permission !== 'granted') {
            console.warn('Motion permission denied')
            return false
          }
        }
        return true
      } catch (error) {
        console.error('Error requesting sensor permissions:', error)
        return false
      }
    }

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
            const totalAcceleration = Math.sqrt(x * x + y * y + z * z)
            
            // Определяем встряхивание (ускорение > 12, снижено для лучшей чувствительности)
            if (totalAcceleration > 12) {
              const now = Date.now()
              // Защита от множественных срабатываний (минимум 500мс между бросками)
              if (now - lastShakeTime.current > 500) {
                lastShakeTime.current = now
                // Используем ref для получения актуальной версии функции
                if (handleShootRef.current) {
                  handleShootRef.current()
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error handling motion:', error)
      }
    }

    const initSensors = async () => {
      await requestPermission()
      
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
    }

    initSensors()

    return () => {
      try {
        const orientationHandler = handleOrientation as EventListener
        const motionHandler = handleMotion as EventListener
        window.removeEventListener('deviceorientation', orientationHandler)
        window.removeEventListener('devicemotion', motionHandler)
      } catch (error) {
        console.error('Error removing listeners:', error)
      }
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      if (!ctx) return

      // Очистка canvas
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      const ball = ballRef.current

      // Обновление позиции мяча при наклоне (если не брошен)
      if (!isShooting) {
        // Плавное движение мяча при наклоне
        const targetX = CANVAS_WIDTH / 2 + (orientation.gamma / 90) * (CANVAS_WIDTH / 2 - ball.radius - 20)
        ball.x += (targetX - ball.x) * 0.1
        
        // Ограничение по краям
        ball.x = Math.max(ball.radius, Math.min(CANVAS_WIDTH - ball.radius, ball.x))
      } else {
        // Физика мяча после броска
        ball.vy += GRAVITY
        ball.x += ball.vx
        ball.y += ball.vy
        
        // Применяем трение
        ball.vx *= FRICTION
        ball.vy *= FRICTION

        // Проверка попадания в кольцо
        if (checkCollision(ball)) {
          setScore(prev => prev + 1)
          setTimeout(() => {
            resetBall()
            setIsShooting(false)
          }, 500)
          return
        }

        // Отскок от стен
        if (ball.x <= ball.radius || ball.x >= CANVAS_WIDTH - ball.radius) {
          ball.vx *= -BOUNCE
          ball.x = Math.max(ball.radius, Math.min(CANVAS_WIDTH - ball.radius, ball.x))
        }

        // Отскок от пола
        if (ball.y >= CANVAS_HEIGHT - ball.radius) {
          ball.vy *= -BOUNCE
          ball.y = CANVAS_HEIGHT - ball.radius
          
          // Если мяч почти остановился, сбрасываем
          if (Math.abs(ball.vy) < 0.5 && Math.abs(ball.vx) < 0.5) {
            setTimeout(() => {
              resetBall()
              setIsShooting(false)
            }, 500)
          }
        }

        // Если мяч улетел вверх, сбрасываем
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

      // Рисуем мяч
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
      ctx.fill()
      
      // Линии на мяче
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
