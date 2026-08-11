const STEPS = [
  {
    illustration: `<div class="illus soup-illus">
      <div class="bowl"><div class="steam"></div><div class="steam d"></div><span>🍲</span></div>
    </div>`,
    html: `<p class="card-eyebrow">item 1 unlocked</p>
           <h1 class="card-title">A Get Well Soon<br>Care Package</h1>
           <p class="card-body">Hey you — someone packed this little care package with love, just for you. Tap below to unwrap each gift, one at a time.</p>`,
    btn: "unwrap first gift →",
  },
  {
    illustration: `<div class="illus soup-illus big">
      <div class="bowl"><div class="steam"></div><div class="steam d"></div><span>🍲</span></div>
    </div>`,
    html: `<p class="card-eyebrow">🍲 warm soup</p>
           <p class="card-body handwriting">Let this soup be a little light on a hard day — creamy, cozy, and made with the kind of love that says <em>get well souper soon.</em></p>`,
    btn: "keep unwrapping →",
  },
  {
    illustration: `<div class="illus flower-illus"><span>🌸</span><span>🌷</span><span>💐</span></div>`,
    html: `<p class="card-eyebrow">🌸 fresh flowers</p>
           <p class="card-body handwriting">These are for you — soft petals, bright colours, and a reminder that even slow days still bloom into something beautiful.</p>`,
    btn: "what's next? →",
  },
  {
    illustration: `<div class="illus bee-illus"><span class="bee-float">🐝</span></div>`,
    html: `<p class="card-eyebrow">🐝 buzzing bee</p>
           <p class="card-body handwriting">A tiny honeybee, buzzing healing vibes your way — sweet, gentle, and stubbornly hopeful, just like you.</p>`,
    btn: "almost there →",
  },
  {
    illustration: `<div class="illus combo-illus"><span>🐱</span><span>🏎️</span><span>🎮</span></div>`,
    html: `<p class="card-eyebrow">🐾 bonus goodies</p>
           <p class="card-body handwriting">Plus purr-fect cat cuddles, a pit crew cheering you back on track, and an extra life for when you need a pause — because rest is part of winning.</p>`,
    btn: "read final note →",
  },
  {
    illustration: `<div class="illus heart-illus"><span>💕</span></div>`,
    html: `<p class="card-eyebrow">delivered with love</p>
           <h2 class="card-title small">Get Well Soon</h2>
           <p class="card-body handwriting final">You're so loved. Rest up, heal gently, and know someone is thinking of you, wishing you warmth, and cheering for you every lap of the way.</p>
           <p class="card-signoff">with hugs & healing ✨</p>`,
    btn: "open again 🎁",
  },
];

const envelopeScreen = document.getElementById("envelope-screen");
const cardScreen = document.getElementById("card-screen");
const openEnvelope = document.getElementById("open-envelope");
const greetingCard = document.getElementById("greeting-card");
const cardIllustration = document.getElementById("card-illustration");
const cardContent = document.getElementById("card-content");
const nextBtn = document.getElementById("next-btn");
const nextLabel = document.getElementById("next-label");
const stepNum = document.getElementById("step-num");
const stepTotal = document.getElementById("step-total");
const progressFill = document.getElementById("progress-fill");
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

let currentStep = 0;
let confettiPieces = [];
let animating = false;

stepTotal.textContent = STEPS.length;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function vibrate() {
  if (navigator.vibrate) navigator.vibrate(20);
}

function createConfetti(count = 60) {
  const colors = ["#ff6aab", "#ffb7d5", "#ffd6e8", "#e8d5ff", "#ffe566", "#fff"];
  confettiPieces = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: -Math.random() * canvas.height * 0.5,
    w: Math.random() * 7 + 4,
    h: Math.random() * 5 + 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    speedY: Math.random() * 2.5 + 2,
    speedX: Math.random() * 2 - 1,
    spin: Math.random() * 5 - 2.5,
  }));
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
  if (animating) requestAnimationFrame(drawConfetti);
}

function startConfetti(duration = 3000) {
  createConfetti();
  animating = true;
  drawConfetti();
  setTimeout(() => {
    animating = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, duration);
}

function updateProgress() {
  const pct = ((currentStep + 1) / STEPS.length) * 100;
  progressFill.style.width = `${pct}%`;
  stepNum.textContent = currentStep + 1;
}

function showStep(index, animate = true) {
  const step = STEPS[index];

  if (animate) {
    greetingCard.classList.remove("flip-in");
    void greetingCard.offsetWidth;
    greetingCard.classList.add("flip-in");
  }

  cardIllustration.innerHTML = step.illustration;
  cardContent.innerHTML = step.html;
  nextLabel.textContent = step.btn;
  updateProgress();

  if (index === STEPS.length - 1) {
    startConfetti();
    nextBtn.classList.add("final");
  } else {
    nextBtn.classList.remove("final");
  }
}

function openCard() {
  openEnvelope.classList.add("opening");
  vibrate();

  setTimeout(() => {
    envelopeScreen.classList.remove("active");
    envelopeScreen.hidden = true;
    cardScreen.hidden = false;
    cardScreen.classList.add("active");
    currentStep = 0;
    showStep(0, false);
    startConfetti(2000);
  }, 700);
}

function nextStep() {
  vibrate();

  if (currentStep < STEPS.length - 1) {
    currentStep++;
    showStep(currentStep);
    return;
  }

  // Reset to envelope
  cardScreen.classList.remove("active");
  cardScreen.hidden = true;
  envelopeScreen.hidden = false;
  envelopeScreen.classList.add("active");
  openEnvelope.classList.remove("opening");
  currentStep = 0;
  showStep(0, false);
}

openEnvelope.addEventListener("click", openCard);
nextBtn.addEventListener("click", nextStep);

// Swipe support for mobile
let touchStartX = 0;
greetingCard.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.touches[0].clientX;
  },
  { passive: true }
);

greetingCard.addEventListener(
  "touchend",
  (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) nextStep();
  },
  { passive: true }
);

showStep(0, false);
