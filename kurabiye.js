// Modern Fortune Cookie - 5000 cümle üretimi ve oyun mantığı

// --- UTILS ---
const $ = (sel) => document.querySelector(sel);

// Deterministik seçici: i bazlı seçimle tekrarları azalt
function pick(arr, i) {
  return arr[i % arr.length];
}

// Rastgele yardımcı (kısa ama yeterli)
function randInt(max) {
  return Math.floor(Math.random() * max);
}

// --- Phrase kaynakları (parçalı -> 5000 farklı cümle üretmek için) ---
const starters = [
  "Bugün",
  "Yarın",
  "Kısa süre sonra",
  "Yakında",
  "Sürpriz bir şekilde",
  "Beklemediğin bir anda",
  "İçinden geldiği gibi davranırsan",
  "Kalbini dinlersen",
  "Ufak bir adım at",
  "Gülümse ve",
];

const middles = [
  "mutluluk kapını çalacak",
  "yeni bir fırsat bulacaksın",
  "güçleneceksin",
  "hayatın rengarenk olacak",
  "hayallerine yaklaşacaksın",
  "güzel bir haber alacaksın",
  "bir karar yolunu açacak",
  "yeni bir dostluk başlıyor",
  "yaratıcılığın parlayacak",
  "küçük bir mucize gerçekleşecek",
];

const endings = ["✨", "🍀", "🌟", "💫", "🌈", "🎉", "💖", "🔥", "🌸", "☀️"];

const modifiers = [
  "bir kahve eşliğinde daha da anlamlı olacak",
  "kendine inan, her şey mümkün",
  "gülümsemen etrafı aydınlatacak",
  "cesaretin ödüllendirilecek",
  "küçük bir adım büyük fark yaratacak",
  "paylaştıkça çoğalacak",
  "beklentilerini iyi ayarla",
  "fırsat kapını çalabilir",
  "riske değecek",
  "anın tadını çıkar",
];

const extras = [
  " Haydi, adım at!",
  " Sürprizlere açık ol.",
  " Enerjini paylaş.",
  "",
  " Bugün bir şans günü.",
  " Kalbini takip et.",
  "",
  " Küçük mutlulukları keşfet.",
];

const emojis = [
  "🍀",
  "🌟",
  "✨",
  "💖",
  "🎯",
  "🔥",
  "🌈",
  "🌸",
  "🎉",
  "🌙",
  "☕",
  "🍪",
];

// --- Generate 5000 unique-ish fortunes ---
function generateFortunes(count = 5000) {
  const out = new Array(count);
  for (let i = 0; i < count; i++) {
    // deterministic picks to ensure coverage
    const a = pick(starters, i + 3);
    const b = pick(middles, i + 7);
    const c = pick(modifiers, i + 11);
    const e = pick(endings, i + 13);
    const ex = pick(extras, i + 17);
    // small chance to include index hidden token not shown to user (we omit index)
    out[i] = `${a} ${b}, ${c} ${e}${ex}`;
  }
  return out;
}

// --- App State & Elements ---
const fortunes = generateFortunes(5000);
const cookieTop = $("#cookie-top");
const cookieSvg = $("#cookie-svg");
const openBtn = $("#open-btn");
const fortuneEl = $("#fortune");
const fortuneText = $("#fortune-text");
const newBtn = $("#new-btn");
const shareBtn = $("#share-btn");
const card = document.querySelector(".card");

// Accessibility: announce changes
function announce(text) {
  // aria-live region is fortuneEl (already set). Also set its textContent.
  fortuneText.textContent = text;
}

// Show a random fortune with animations
function openCookie() {
  // visual: shake cookie
  card.classList.add("shake-cookie");
  // small delay to simulate shake
  setTimeout(() => {
    // show crack (toggle class on SVG parent)
    cookieTop.classList.add("cookie-cracked");
    // hide top cookie smoothly
    card.classList.add("hide-top");

    // hide the open button
    openBtn.setAttribute("disabled", "true");
    openBtn.style.pointerEvents = "none";

    // choose random fortune
    const idx = randInt(fortunes.length);
    const text = fortunes[idx];

    // show paper area
    fortuneEl.hidden = false;
    // animate paper
    setTimeout(() => {
      card.classList.add("show-paper");
      announce(text);
    }, 160);

    // after revealed, remove shake class
    setTimeout(() => card.classList.remove("shake-cookie"), 700);
  }, 620);
}

// Reset to allow new cookie
function resetCookie() {
  // hide paper
  card.classList.remove("show-paper");
  fortuneEl.hidden = true;
  // restore top cookie
  cookieTop.classList.remove("cookie-cracked");
  card.classList.remove("hide-top");
  openBtn.removeAttribute("disabled");
  openBtn.style.pointerEvents = "auto";

  // slight pop animation on cookie
  cookieSvg.style.transform = "scale(.96) translateY(6px)";
  cookieSvg.style.opacity = "0";
  setTimeout(() => {
    cookieSvg.style.transition = "transform 260ms ease, opacity 200ms ease";
    cookieSvg.style.transform = "";
    cookieSvg.style.opacity = "";
    // cleanup transition after done
    setTimeout(() => {
      cookieSvg.style.transition = "";
    }, 300);
  }, 40);

  // for screen readers, clear fortune text
  fortuneText.textContent = "";
}

// Copy to clipboard
async function copyFortune() {
  const txt = fortuneText.textContent || "";
  try {
    await navigator.clipboard.writeText(txt);
    // temporary visual feedback
    shareBtn.textContent = "Kopyalandı ✓";
    setTimeout(() => (shareBtn.textContent = "Kopyala"), 1400);
  } catch (e) {
    shareBtn.textContent = "Kopyalanamadı";
    setTimeout(() => (shareBtn.textContent = "Kopyala"), 1400);
  }
}

// --- Events ---
openBtn.addEventListener("click", openCookie);
newBtn.addEventListener("click", resetCookie);
shareBtn.addEventListener("click", copyFortune);

// Keyboard support: Enter/Space on focused openBtn
openBtn.addEventListener("keydown", (ev) => {
  if (ev.key === "Enter" || ev.key === " ") {
    ev.preventDefault();
    openCookie();
  }
});

// Allow clicking cookie SVG also
cookieTop.addEventListener("click", () => {
  if (!openBtn.hasAttribute("disabled")) openCookie();
});

// Initialize: ensure fortune hidden
fortuneEl.hidden = true;
