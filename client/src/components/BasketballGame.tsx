import { useEffect, useRef, useState, useCallback } from 'react'
import './BasketballGame.css'

interface Ball {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  rotation: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
}

interface PowerBar {
  value: number
  max: number
}

export function BasketballGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [isShooting, setIsShooting] = useState(false)
  const [orientation, setOrientation] = useState({ beta: 0, gamma: 0 })
  const [power, setPower] = useState(0)
  const [isCharging, setIsCharging] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [showScoreAnimation, setShowScoreAnimation] = useState(false)
  const [level, setLevel] = useState(1)
  const [shots, setShots] = useState(0)
  const [hits, setHits] = useState(0)
  
  const ballRef = useRef<Ball>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 20,
    rotation: 0,
  })
  const animationFrameRef = useRef<number>()
  const lastShakeTime = useRef<number>(0)
  const powerChargeInterval = useRef<number>()
  const hoopOffset = useRef<number>(0)
  const hoopDirection = useRef<number>(1)

  const CANVAS_WIDTH = 400
  const CANVAS_HEIGHT = 600
  const HOOP_X = CANVAS_WIDTH / 2
  const HOOP_Y = 100
  const HOOP_WIDTH = 80
  const HOOP_HEIGHT = 10
  const GRAVITY = 0.5
  const FRICTION = 0.98
  const BOUNCE = 0.7
  const MAX_POWER = 100

  // Загружаем рекорд из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('basketball_highscore')
    if (saved) {
      setHighScore(parseInt(saved, 10))
    }
  }, [])

  // Сохраняем рекорд
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('basketball_highscore', score.toString())
    }
  }, [score, highScore])

  // Обновляем уровень на основе счета
  useEffect(() => {
    const newLevel = Math.floor(score / 5) + 1
    if (newLevel > level) {
      setLevel(newLevel)
    }
  }, [score, level])

  const checkCollision = useCallback((ball: Ball): boolean => {
    const dx = ball.x - (HOOP_X + hoopOffset.current)
    const dy = ball.y - HOOP_Y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance < HOOP_WIDTH / 2 && ball.y > HOOP_Y - 5 && ball.y < HOOP_Y + 15) {
      return true
    }
    return false
  }, [])

  const createParticles = useCallback((x: number, y: number, count: number = 10) => {
    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      const speed = 2 + Math.random() * 3
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        size: 3 + Math.random() * 4,
      })
    }
    setParticles(prev => [...prev, ...newParticles])
  }, [])

  const resetBall = useCallback(() => {
    ballRef.current = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 100,
      vx: 0,
      vy: 0,
      radius: 20,
      rotation: 0,
    }
    setPower(0)
    setIsCharging(false)
  }, [])

  useEffect(() => {
    resetBall()
  }, [resetBall])

  const handleShoot = useCallback(() => {
    if (isShooting || isCharging) return
    
    setIsShooting(true)
    setIsCharging(false)
    const ball = ballRef.current
    
    // Используем накопленную мощность для броска
    const powerMultiplier = power / MAX_POWER
    const maxSpeed = 12 + powerMultiplier * 8 // от 12 до 20
    
    // Вычисляем скорость на основе наклона и мощности
    ball.vx = (orientation.gamma / 90) * maxSpeed * (0.5 + powerMultiplier * 0.5)
    ball.vy = -(Math.abs(orientation.beta) / 90) * maxSpeed - 6 - powerMultiplier * 4
    
    // Ограничиваем максимальную скорость
    const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy)
    if (speed > maxSpeed) {
      ball.vx = (ball.vx / speed) * maxSpeed
      ball.vy = (ball.vy / speed) * maxSpeed
    }
    
    setShots(prev => prev + 1)
    setPower(0)
    
    if (powerChargeInterval.current) {
      clearInterval(powerChargeInterval.current)
    }
  }, [isShooting, isCharging, orientation, power])

  const startCharging = useCallback(() => {
    if (isShooting || isCharging) return
    
    setIsCharging(true)
    setPower(0)
    
    powerChargeInterval.current = window.setInterval(() => {
      setPower(prev => {
        if (prev >= MAX_POWER) {
          if (powerChargeInterval.current) {
            clearInterval(powerChargeInterval.current)
          }
          return MAX_POWER
        }
        return prev + 2
      })
    }, 16) // ~60fps
  }, [isShooting, isCharging])

  const stopCharging = useCallback(() => {
    if (powerChargeInterval.current) {
      clearInterval(powerChargeInterval.current)
    }
    setIsCharging(false)
    if (power > 10) {
      handleShoot()
    } else {
      setPower(0)
    }
  }, [power, handleShoot])

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
            
            if (totalAcceleration > 15) {
              const now = Date.now()
              if (now - lastShakeTime.current > 500) {
                lastShakeTime.current = now
                if (!isShooting && !isCharging) {
                  startCharging()
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
  }, [startCharging, isShooting, isCharging])

  // Анимация кольца (движется на более высоких уровнях)
  useEffect(() => {
    if (level > 3) {
      const interval = setInterval(() => {
        hoopOffset.current += hoopDirection.current * (level - 2) * 0.5
        if (hoopOffset.current > 50 || hoopOffset.current < -50) {
          hoopDirection.current *= -1
        }
      }, 16)
      return () => clearInterval(interval)
    } else {
      hoopOffset.current = 0
    }
  }, [level])

  // Обновление частиц
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.2, // гравитация для частиц
            life: p.life - 0.02,
          }))
          .filter(p => p.life > 0)
      )
    }, 16)
    return () => clearInterval(interval)
  }, [])

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

      // Рисуем фон с градиентом
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
      gradient.addColorStop(0, '#0f3460')
      gradient.addColorStop(1, '#1a1a2e')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Рисуем линии поля
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.moveTo(0, CANVAS_HEIGHT - 100 - i * 50)
        ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - 100 - i * 50)
        ctx.stroke()
      }

      if (!isShooting) {
        const targetX = CANVAS_WIDTH / 2 + (orientation.gamma / 90) * (CANVAS_WIDTH / 2 - ball.radius - 20)
        ball.x += (targetX - ball.x) * 0.1
        ball.x = Math.max(ball.radius, Math.min(CANVAS_WIDTH - ball.radius, ball.x))
      } else {
        ball.vy += GRAVITY
        ball.x += ball.vx
        ball.y += ball.vy
        ball.rotation += Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy) * 0.1
        
        ball.vx *= FRICTION
        ball.vy *= FRICTION

        if (checkCollision(ball)) {
          setScore(prev => prev + 1)
          setHits(prev => prev + 1)
          setStreak(prev => prev + 1)
          setShowScoreAnimation(true)
          createParticles(HOOP_X + hoopOffset.current, HOOP_Y, 15)
          
          setTimeout(() => {
            setShowScoreAnimation(false)
            resetBall()
            setIsShooting(false)
          }, 1000)
          return
        }

        if (ball.x <= ball.radius || ball.x >= CANVAS_WIDTH - ball.radius) {
          ball.vx *= -BOUNCE
          ball.x = Math.max(ball.radius, Math.min(CANVAS_WIDTH - ball.radius, ball.x))
          createParticles(ball.x, ball.y, 5)
        }

        if (ball.y >= CANVAS_HEIGHT - ball.radius) {
          ball.vy *= -BOUNCE
          ball.y = CANVAS_HEIGHT - ball.radius
          createParticles(ball.x, ball.y, 5)
          
          if (Math.abs(ball.vy) < 0.5 && Math.abs(ball.vx) < 0.5) {
            setStreak(0)
            setTimeout(() => {
              resetBall()
              setIsShooting(false)
            }, 500)
          }
        }

        if (ball.y < -ball.radius) {
          setStreak(0)
          setTimeout(() => {
            resetBall()
            setIsShooting(false)
          }, 500)
        }
      }

      // Рисуем кольцо с анимацией
      const currentHoopX = HOOP_X + hoopOffset.current
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(currentHoopX - HOOP_WIDTH / 2, HOOP_Y)
      ctx.lineTo(currentHoopX + HOOP_WIDTH / 2, HOOP_Y)
      ctx.stroke()

      // Сетка кольца с эффектом
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      for (let i = 0; i < 5; i++) {
        const x = currentHoopX - HOOP_WIDTH / 2 + (HOOP_WIDTH / 4) * i
        ctx.beginPath()
        ctx.moveTo(x, HOOP_Y)
        ctx.lineTo(currentHoopX, HOOP_Y + 30)
        ctx.stroke()
      }

      // Рисуем частицы
      particles.forEach(particle => {
        ctx.save()
        ctx.globalAlpha = particle.life
        ctx.fillStyle = `hsl(${60 + (1 - particle.life) * 60}, 100%, 70%)`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Рисуем мяч с вращением
      ctx.save()
      ctx.translate(ball.x, ball.y)
      ctx.rotate(ball.rotation)
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(0, 0, ball.radius, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.strokeStyle = '#1a1a2e'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(0, 0, ball.radius, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(-ball.radius, 0)
      ctx.lineTo(ball.radius, 0)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(0, 0, ball.radius / 2, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()

      // Траектория мяча (при прицеливании)
      if (!isShooting && isCharging) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${power / MAX_POWER * 0.5})`
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(ball.x, ball.y)
        
        let trajX = ball.x
        let trajY = ball.y
        let trajVx = (orientation.gamma / 90) * (12 + (power / MAX_POWER) * 8)
        let trajVy = -(Math.abs(orientation.beta) / 90) * (12 + (power / MAX_POWER) * 8) - 6
        
        for (let i = 0; i < 30; i++) {
          trajVy += GRAVITY
          trajX += trajVx
          trajY += trajVy
          trajVx *= FRICTION
          trajVy *= FRICTION
          ctx.lineTo(trajX, trajY)
        }
        ctx.stroke()
        ctx.setLineDash([])
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isShooting, orientation, checkCollision, resetBall, particles, power, isCharging, createParticles])

  const accuracy = shots > 0 ? Math.round((hits / shots) * 100) : 0

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="score-info">
          <div className="score">Score: {score}</div>
          <div className="high-score">Best: {highScore}</div>
        </div>
        <div className="stats-info">
          <div className="level">Level {level}</div>
          {streak > 0 && <div className="streak">🔥 {streak} streak!</div>}
        </div>
      </div>
      
      {showScoreAnimation && (
        <div className="score-popup">+1! 🎯</div>
      )}

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="game-canvas"
      />
      
      {isCharging && (
        <div className="power-bar-container">
          <div className="power-bar-label">Power</div>
          <div className="power-bar">
            <div 
              className="power-bar-fill" 
              style={{ width: `${power}%` }}
            />
          </div>
        </div>
      )}

      <div className="game-footer">
        <div className="game-stats">
          <div>Accuracy: {accuracy}%</div>
          <div>Shots: {shots}</div>
        </div>
        <button 
          className="shoot-button"
          onMouseDown={startCharging}
          onMouseUp={stopCharging}
          onTouchStart={startCharging}
          onTouchEnd={stopCharging}
          disabled={isShooting}
        >
          {isCharging ? `⚡ ${Math.round(power)}%` : '🏀 HOLD TO SHOOT'}
        </button>
      </div>
    </div>
  )
}
