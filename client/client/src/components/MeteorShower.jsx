import { useEffect, useRef } from "react";

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createMeteor(canvasWidth) {
  const angle = 22;
  const rad = (angle * Math.PI) / 180;
  const speed = randomBetween(5, 12);
  const tailLength = randomBetween(100, 200);
  const size = randomBetween(.3, 4);

  const startFromTop = Math.random() > 0.3;
  const x = startFromTop
    ? randomBetween(-1500, 0)
    : randomBetween(canvasWidth * 0.1, canvasWidth);
  const y = startFromTop ? randomBetween(-200, -20) : randomBetween(-100, 0);

  // Color variants: white, ice blue, warm orange
  const colorRoll = Math.random();
  const color =
    colorRoll < 0.6
      ? "255,255,255"
      : colorRoll < 0.85
      ? "180,220,255"
      : "255,200,120";

  return {
    x,
    y,
    vx: Math.cos(rad) * speed,
    vy: Math.sin(rad) * speed,
    speed,
    tailLength,
    size,
    color,
    opacity: randomBetween(0.5, 1),
    delay: randomBetween(0, 3000), // stagger start
    active: false,
    startTime: null,
  };
}

export default function MeteorShower({ density = 20, className = "" }) {
  const canvasRef = useRef(null);
  const meteorsRef = useRef([]);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = Math.min(Math.max(density, 5), 40);
    meteorsRef.current = Array.from({ length: count }, () =>
      createMeteor(canvas.width)
    );

    const draw = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      meteorsRef.current.forEach((m, i) => {
        // Respect delay before activating
        if (!m.active) {
          if (elapsed >= m.delay) {
            m.active = true;
            m.startTime = timestamp;
          } else {
            return;
          }
        }

        // Move
        m.x += m.vx;
        m.y += m.vy;

        // Reset if off screen
        if (
          m.x > canvas.width + 200 ||
          m.y > canvas.height + 200
        ) {
          const fresh = createMeteor(canvas.width);
          fresh.active = true;
          fresh.delay = 0;
          meteorsRef.current[i] = fresh;
          return;
        }

        // Tail: gradient line from tail-end to head
        const tailX = m.x - m.vx * (m.tailLength / m.speed || m.tailLength / 10);
        const tailY = m.y - m.vy * (m.tailLength / m.speed || m.tailLength / 10);

        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0, `rgba(${m.color},0)`);
        grad.addColorStop(0.7, `rgba(${m.color},${m.opacity * 0.4})`);
        grad.addColorStop(1, `rgba(${m.color},${m.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.size;
        ctx.lineCap = "round";
        ctx.stroke();

        // Glowing head
        const headGlow = ctx.createRadialGradient(
          m.x, m.y, 0,
          m.x, m.y, m.size * 4
        );
        headGlow.addColorStop(0, `rgba(${m.color},${m.opacity})`);
        headGlow.addColorStop(0.4, `rgba(${m.color},${m.opacity * 0.5})`);
        headGlow.addColorStop(1, `rgba(${m.color},0)`);

        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = headGlow;
        ctx.fill();

        // Bright core dot
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${m.opacity})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
      }}
    />
  );
}