// 🎉 Victory Confetti Party Popper (For Winner Only)
export function triggerPartyPopper() {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
    vRotation: number;
    alpha: number;
    decay: number;
  }> = [];

  const colors = ['#00f2fe', '#9d4edd', '#ff0055', '#00ff66', '#ffd700', '#ff9900', '#ffffff'];

  const origins = [
    { x: canvas.width * 0.2, y: canvas.height * 0.85, angle: -Math.PI / 3 },
    { x: canvas.width * 0.8, y: canvas.height * 0.85, angle: (-2 * Math.PI) / 3 },
    { x: canvas.width * 0.5, y: canvas.height * 0.5, angle: -Math.PI / 2 }
  ];

  origins.forEach((origin) => {
    for (let i = 0; i < 80; i++) {
      const speed = Math.random() * 18 + 10;
      const spread = (Math.random() - 0.5) * 1.4;
      particles.push({
        x: origin.x,
        y: origin.y,
        vx: Math.cos(origin.angle + spread) * speed,
        vy: Math.sin(origin.angle + spread) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        vRotation: (Math.random() - 0.5) * 15,
        alpha: 1,
        decay: Math.random() * 0.008 + 0.006,
      });
    }
  });

  let animationFrameId: number;

  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, idx) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.vx *= 0.98;
      p.rotation += p.vRotation;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(idx, 1);
        return;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
      ctx.restore();
    });

    if (particles.length > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      document.body.removeChild(canvas);
    }
  }

  render();
}

// 🌧️ Clean Cinematic Dark Rain (Zero Emojis, Sleek & Atmospheric)
export function triggerSadDefeatAnimation() {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const rainLines: Array<{
    x: number;
    y: number;
    speed: number;
    length: number;
    alpha: number;
    color: string;
  }> = [];

  const colors = ['#64748b', '#475569', '#334155', '#94a3b8'];

  for (let i = 0; i < 110; i++) {
    rainLines.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: Math.random() * 12 + 10,
      length: Math.random() * 25 + 15,
      alpha: Math.random() * 0.4 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  let frames = 0;
  let animationFrameId: number;

  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    frames++;

    rainLines.forEach((r) => {
      r.y += r.speed;
      if (r.y > canvas.height) {
        r.y = -30;
        r.x = Math.random() * canvas.width;
      }
      ctx.save();
      ctx.globalAlpha = r.alpha;
      ctx.strokeStyle = r.color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(r.x, r.y);
      ctx.lineTo(r.x - 1.5, r.y + r.length);
      ctx.stroke();
      ctx.restore();
    });

    if (frames < 240) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      document.body.removeChild(canvas);
    }
  }

  render();
}