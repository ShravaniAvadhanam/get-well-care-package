const intro = document.getElementById("intro");
const reveal = document.getElementById("reveal");
const openBtn = document.getElementById("open-btn");
const replayBtn = document.getElementById("replay-btn");
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

let confettiPieces = [];
let animating = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function createConfetti(count = 80) {
  const colors = ["#ff6aab", "#ffb7d5", "#ffd6e8", "#e8d5ff", "#ffe566", "#ff8fbf", "#fff"];
  confettiPieces = [];

  for (let i = 0; i < count; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * -0.5 - 20,
      w: Math.random() * 8 + 4,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 2 - 1,
      spin: Math.random() * 6 - 3,
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettiPieces.forEach((p) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();

    p.y += p.speedY;
    p.x += p.speedX;
    p.rotation += p.spin;

    if (p.y > canvas.height + 20) {
      p.y = -20;
      p.x = Math.random() * canvas.width;
    }
  });

  if (animating) {
    requestAnimationFrame(drawConfetti);
  }
}

function startConfetti(duration = 4000) {
  createConfetti();
  animating = true;
  drawConfetti();
  setTimeout(() => {
    animating = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, duration);
}

function revealCards() {
  const cards = reveal.querySelectorAll(".card");
  cards.forEach((card) => {
    const delay = parseInt(card.dataset.delay, 10) || 0;
    setTimeout(() => card.classList.add("visible"), delay);
  });
}

function openPackage() {
  if (openBtn.classList.contains("opening")) return;

  openBtn.classList.add("opening");
  openBtn.disabled = true;

  setTimeout(() => {
    intro.classList.remove("active");
    intro.hidden = true;
    reveal.hidden = false;
    reveal.classList.add("active");
    startConfetti();
    revealCards();

    if (navigator.vibrate) {
      navigator.vibrate([30, 50, 30]);
    }
  }, 900);
}

function resetExperience() {
  reveal.classList.remove("active");
  reveal.hidden = true;
  intro.hidden = false;
  intro.classList.add("active");

  openBtn.classList.remove("opening");
  openBtn.disabled = false;

  reveal.querySelectorAll(".card").forEach((card) => {
    card.classList.remove("visible");
  });
}

openBtn.addEventListener("click", openPackage);
replayBtn.addEventListener("click", resetExperience);

const bee = document.getElementById("bee");
if (bee) {
  document.addEventListener(
    "touchmove",
    (e) => {
      if (reveal.hidden) return;
      const touch = e.touches[0];
      const rect = bee.parentElement.getBoundingClientRect();
      const dx = touch.clientX - rect.left - rect.width / 2;
      const dy = touch.clientY - rect.top - rect.height / 2;
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 30);
      const angle = Math.atan2(dy, dx);
      bee.style.transform = `translate(${Math.cos(angle) * dist * 0.3}px, ${Math.sin(angle) * dist * 0.3}px)`;
    },
    { passive: true }
  );
}
