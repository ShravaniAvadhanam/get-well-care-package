const STEPS = [
  {
    illustration: `<div class="illus race-start">
      <span class="big-emoji">🏎️</span>
      <span class="cats-cheer">🐱🐱</span>
    </div>`,
    html: `<p class="card-eyebrow">🏁 lights out!</p>
           <h1 class="card-title">Get Well Soon,<br>Racer!</h1>
           <p class="card-body handwriting">Your pit crew of cats packed this care package — tap <em>next lap</em> to unwrap each gift on your road to recovery.</p>`,
    btn: "lap 1 — go! →",
    toast: "🏎️ Vroom! Race started!",
  },
  {
    illustration: `<div class="illus soup-race">
      <span>🍲</span><span class="pit-cat">🐱</span>
    </div>`,
    html: `<p class="card-eyebrow">🍲 pit stop soup</p>
           <p class="card-body handwriting">Pit stop #1: a warm bowl of soup for the hard days. The cats insist you eat something cozy — <em>get well souper soon!</em></p>`,
    btn: "lap 2 →",
    toast: "🐱 Cat approved soup!",
  },
  {
    illustration: `<div class="illus flower-race"><span>🌸</span><span>🏎️</span><span>🌷</span></div>`,
    html: `<p class="card-eyebrow">🌸 flower power</p>
           <p class="card-body handwriting">Lap 2 bonus: flowers at the finish line — because even when you're in the pits, you're still blooming.</p>`,
    btn: "lap 3 →",
    toast: "🌸 Flower boost unlocked!",
  },
  {
    illustration: `<div class="illus bee-race"><span class="bee-float">🐝</span><span>🐱</span></div>`,
    html: `<p class="card-eyebrow">🐝 healing buzz</p>
           <p class="card-body handwriting">A honeybee flew in with the cats — buzzing sweet healing vibes straight to your pit box.</p>`,
    btn: "lap 4 →",
    toast: "🐝 Buzz buzz heal!",
  },
  {
    illustration: `<div class="illus cat-race">
      <span class="race-cat bounce">🐱</span>
      <span>🏎️</span>
      <span class="race-cat bounce d">😺</span>
      <span>🎮</span>
    </div>`,
    html: `<p class="card-eyebrow">🐾 cat crew + turbo</p>
           <p class="card-body handwriting">Your cat pit crew is on it — purr-fect cuddles, F1-level support, and an extra life for when you need to pause. Rest is part of winning!</p>`,
    btn: "final lap →",
    toast: "🐱 Purr engine activated!",
  },
  {
    illustration: `<div class="illus finish">
      <span>🏁</span><span class="big-heart">💕</span><span>🐱</span>
    </div>`,
    html: `<p class="card-eyebrow">🏁 you win!</p>
           <h2 class="card-title small">Get Well Soon</h2>
           <p class="card-body handwriting final">You crossed the finish line of our hearts. Rest up, heal gently — your cat pit crew and your favourite humans are cheering every lap.</p>
           <p class="card-signoff">purrfect recovery ahead ✨</p>`,
    btn: "race again 🏎️",
    toast: "🏁 YOU WIN! Get well soon!",
  },
];

const CAT_EMOJIS = ["🐱", "😺", "😸", "😻", "🐈", "🐈‍⬛", "😽"];
const FLOWER_EMOJIS = ["🌸", "🌷", "🌼", "🌺", "💐", "🌻", "🪷", "🏵️"];
const KISS_EMOJIS = ["💋", "💕", "💖", "💗", "💝", "😘", "🥰", "💞"];
const SMILE_EMOJIS = ["😊", "🙂", "😄", "☺️", "🥳", "✨", "⭐", "🌟"];
const EXTRA_EMOJIS = ["🐾", "🏎️", "🎀", "🍲", "🐝"];

const BG_EMOJIS = [...CAT_EMOJIS, ...FLOWER_EMOJIS, ...KISS_EMOJIS, ...SMILE_EMOJIS, ...EXTRA_EMOJIS];
const BG_SIZES = ["tiny", "small", "medium", "large"];
const MEOWS = ["mrow!", "purr~", "meow!", "nya!", "mrrp!", "pspsps!", "healing vibes!", "🏎️ vroom!"];

const envelopeScreen = document.getElementById("envelope-screen");
const cardScreen = document.getElementById("card-screen");
const openEnvelope = document.getElementById("open-envelope");
const greetingCard = document.getElementById("greeting-card");
const cardIllustration = document.getElementById("card-illustration");
const cardContent = document.getElementById("card-content");
const nextBtn = document.getElementById("next-btn");
const boostBtn = document.getElementById("boost-btn");
const nextLabel = document.getElementById("next-label");
const stepNum = document.getElementById("step-num");
const stepTotal = document.getElementById("step-total");
const progressFill = document.getElementById("progress-fill");
const raceCar = document.getElementById("race-car");
const toast = document.getElementById("toast");
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

let currentStep = 0;
let confettiPieces = [];
let animating = false;
let boostCount = 0;

stepTotal.textContent = STEPS.length;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function vibrate(pattern = 20) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

function cheerCats() {
  document.querySelectorAll(".corner-cat").forEach((cat) => {
    cat.classList.add("cheer");
    setTimeout(() => cat.classList.remove("cheer"), 600);
  });
}

function tapCat(cat) {
  const bubble = cat.querySelector(".cat-bubble");
  const meow = cat.dataset.meow || MEOWS[Math.floor(Math.random() * MEOWS.length)];
  if (bubble) bubble.textContent = meow;
  cat.classList.add("purr");
  vibrate(15);
  showToast(`🐱 ${meow}`);

  setTimeout(() => {
    cat.classList.remove("purr");
    if (bubble) bubble.textContent = "";
  }, 1200);
}

function spawnBgFill() {
  const fill = document.getElementById("bg-fill");
  if (!fill || fill.dataset.ready) return;
  fill.dataset.ready = "1";

  const count = 55;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = `bg-emoji ${BG_SIZES[Math.floor(Math.random() * BG_SIZES.length)]}`;
    el.textContent = BG_EMOJIS[Math.floor(Math.random() * BG_EMOJIS.length)];
    el.style.top = `${2 + Math.random() * 96}%`;
    el.style.left = `${2 + Math.random() * 96}%`;
    el.style.setProperty("--rot", `${-25 + Math.random() * 50}deg`);
    el.style.setProperty("--dur", `${3 + Math.random() * 4}s`);
    el.style.setProperty("--delay", `${Math.random() * 3}s`);
    fill.appendChild(el);
  }
}

function initCornerCats() {
  document.querySelectorAll(".corner-cat").forEach((cat) => {
    cat.addEventListener("click", () => tapCat(cat));
  });
}

function createConfetti(count = 70) {
  const colors = ["#ff4d6d", "#ff6aab", "#ffb7d5", "#ffe566", "#fff", "#ff758f"];
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
  raceCar.style.left = `calc(${pct}% - 14px)`;
  stepNum.textContent = currentStep + 1;
}

function showStep(index, animate = true) {
  const step = STEPS[index];

  if (animate) {
    greetingCard.classList.remove("flip-in");
    void greetingCard.offsetWidth;
    greetingCard.classList.add("flip-in");
    cheerCats();
    vibrate([15, 30, 15]);
  }

  cardIllustration.innerHTML = step.illustration;
  cardContent.innerHTML = step.html;
  nextLabel.textContent = step.btn;
  updateProgress();

  if (step.toast && animate) showToast(step.toast);

  if (index === STEPS.length - 1) {
    startConfetti();
    nextBtn.classList.add("final");
    boostBtn.hidden = true;
  } else {
    nextBtn.classList.remove("final");
    boostBtn.hidden = false;
  }
}

function openCard() {
  openEnvelope.classList.add("opening");
  vibrate([30, 50, 30]);
  showToast("🏎️ Engines on!");

  setTimeout(() => {
    envelopeScreen.classList.remove("active");
    envelopeScreen.hidden = true;
    cardScreen.hidden = false;
    cardScreen.classList.add("active");
    currentStep = 0;
    boostCount = 0;
    showStep(0, false);
    startConfetti(2000);
    cheerCats();
  }, 700);
}

function nextStep() {
  if (currentStep < STEPS.length - 1) {
    currentStep++;
    showStep(currentStep);
    return;
  }

  cardScreen.classList.remove("active");
  cardScreen.hidden = true;
  envelopeScreen.hidden = false;
  envelopeScreen.classList.add("active");
  openEnvelope.classList.remove("opening");
  currentStep = 0;
  boostCount = 0;
  boostBtn.hidden = false;
}

function boost() {
  boostCount++;
  vibrate([10, 20, 10, 20]);
  cheerCats();
  startConfetti(800);

  const msgs = [
    "🐱 MEOW BOOST!",
    "😺 Purr power +10!",
    "🏎️ Cat turbo engaged!",
    "🐾 Paw-sitive vibes!",
    "✨ Nya nya heal!",
  ];
  showToast(msgs[boostCount % msgs.length]);

  boostBtn.classList.add("pop");
  setTimeout(() => boostBtn.classList.remove("pop"), 300);
}

openEnvelope.addEventListener("click", openCard);
nextBtn.addEventListener("click", nextStep);
boostBtn.addEventListener("click", boost);

spawnBgFill();
initCornerCats();

// Swipe to advance
let touchStartX = 0;
greetingCard.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

greetingCard.addEventListener("touchend", (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (diff > 50) nextStep();
}, { passive: true });

showStep(0, false);
