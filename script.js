const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get('name') || "Fahmidaaa";
document.getElementById('question').textContent = `${name}, will you be my valentine?`;

const zone = document.getElementById("zone");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hint = document.getElementById("hint");
const result = document.getElementById("result");
const confettiCanvas = document.getElementById("confettiCanvas");

let hasMoved = false;
let isVariantShown = false;

function resizeConfettiCanvas() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  confettiCanvas.width = Math.floor(window.innerWidth * dpr);
  confettiCanvas.height = Math.floor(window.innerHeight * dpr);
  confettiCanvas.style.width = "100vw";
  confettiCanvas.style.height = "100vh";
}

resizeConfettiCanvas();
window.addEventListener("resize", resizeConfettiCanvas);
window.addEventListener("orientationchange", () => setTimeout(resizeConfettiCanvas, 150));

const confettiInstance = confetti.create(confettiCanvas, {
  resize: false,
  useWorker: true
});

function fullScreenConfetti() {
  const end = Date.now() + 1600;
  (function frame() {
    confettiInstance({
      particleCount: 12,
      spread: 90,
      startVelocity: 45,
      ticks: 180,
      origin: { x: Math.random(), y: Math.random() * 0.3 }
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  setTimeout(() => {
    confettiInstance({
      particleCount: 300,
      spread: 140,
      startVelocity: 60,
      ticks: 220,
      origin: { x: 0.5, y: 0.55 }
    });
  }, 300);
}

let yesScale = 1;
function growYes() {
  yesScale = Math.min(2.2, yesScale + 0.1);
  yesBtn.style.transform = `translate(-120%, -50%) scale(${yesScale})`;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

const noVariants = ["🫣", "Yes?", "No?!", "hehe", "huh?", "why?", "fr?", "👀"];
function showTextVariant() {
  if (isVariantShown) return;
  isVariantShown = true;
  const randomText = noVariants[Math.floor(Math.random() * noVariants.length)];
  noBtn.textContent = randomText;

  setTimeout(() => {
    noBtn.textContent = "No";
    isVariantShown = false;
  }, 1000);
}

function moveNo(clientX, clientY) {
  const z = zone.getBoundingClientRect();
  const b = noBtn.getBoundingClientRect();

  let dx = (b.left + b.width / 2) - clientX;
  let dy = (b.top + b.height / 2) - clientY;
  let mag = Math.hypot(dx, dy) || 1;
  dx /= mag;
  dy /= mag;

  let newLeft = (b.left - z.left) + dx * 140;
  let newTop  = (b.top - z.top)  + dy * 140;

  newLeft = clamp(newLeft, 0, z.width - b.width);
  newTop  = clamp(newTop, 0, z.height - b.height);

  noBtn.style.transition = "left 0.32s cubic-bezier(0.34, 1.56, 0.64, 1), " + "top  0.32s cubic-bezier(0.34, 1.56, 0.64, 1), " + "transform 0.18s ease-out";
  noBtn.style.left = newLeft + "px";
  noBtn.style.top  = newTop  + "px";
  noBtn.style.transform = "scale(1.08) rotate(3deg)";

  setTimeout(() => {
    noBtn.style.transform = "scale(1) rotate(0deg)";
  }, 180);

  showTextVariant();

  if (!hasMoved) {
    hasMoved = true;
    hint.style.opacity = 0.7;
  }

  growYes();
}

noBtn.addEventListener("pointerenter", e => {
  moveNo(e.clientX, e.clientY);
});

noBtn.addEventListener("pointermove", e => {
  const b = noBtn.getBoundingClientRect();
  const d = Math.hypot(
    (b.left + b.width / 2) - e.clientX,
    (b.top + b.height / 2) - e.clientY
  );
  if (d < 140) moveNo(e.clientX, e.clientY);
});

noBtn.addEventListener("touchstart", e => {
  e.preventDefault();
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    moveNo(touch.clientX, touch.clientY);
  }
}, { passive: false });

noBtn.addEventListener("touchmove", e => {
  e.preventDefault();
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    const b = noBtn.getBoundingClientRect();
    const d = Math.hypot(
      (b.left + b.width / 2) - touch.clientX,
      (b.top + b.height / 2) - touch.clientY
    );
    if (d < 140) moveNo(touch.clientX, touch.clientY);
  }
}, { passive: false });

noBtn.addEventListener("click", e => e.preventDefault());
noBtn.addEventListener("touchend", e => e.preventDefault());

yesBtn.addEventListener("click", () => {
  zone.style.display = "none";
  hint.style.display = "none";
  result.style.display = "block";
  resizeConfettiCanvas();
  fullScreenConfetti();
});
