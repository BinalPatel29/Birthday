/* =================================================================
   CONFIG — edit everything in this block to personalize the site.
   No code-editing skills required past this point.
   ================================================================= */
const CONFIG = {
  name: "My Special One ❤️🫶",              // his first name
  age: 22,                        // the birthday number
  title: "Chief Chaos Officer, Best Friend Division", // playful subtitle
  bio: "Happy birthday to someone who makes the world a better place just by being in it 💕.",
  tagline: "Thank you for being a part of my life 😘.",

  // Avatar initials shown if you don't add a real photo
  avatarInitials: "AB",

  // "Skill tree" — his interests, each scored 0-100 for the progress bar
  interests: [
    { label: "Best Friend", value: 100 },
    { label: "My Behalf", value: 100 },
    { label: "My Betu", value: 100 },
    { label: "My Supporter", value: 100 },
  ],

  // Gallery items. Set `img` to a real file path (e.g. "assets/photo1.jpg")
  // to replace the placeholder tile with an actual photo.
  memories: [
    { img: null, icon: "🎂", label: "The year the cake caught fire" },
    { img: null, icon: "🏔️", label: "That hike neither of us trained for" },
    { img: null, icon: "🎮", label: "3am ranked matches, 2019" },
    { img: null, icon: "🚗", label: "The road trip playlist incident" },
    { img: null, icon: "🍕", label: "Worst pizza, best night" },
    { img: null, icon: "📸", label: "Add your own memory here" },
  ],

  // Terminal boot lines (typed out on load)
  bootLines: [
    { text: "$ My Best Friend Forever", type: "prompt" },
    { text: "loading friendship ...", type: "dim" },
    { text: "found 1 record: best_friend", type: "dim" },
    { text: "$ ./celebrate birthday 22nd 🐥🥮🎂🥳", type: "prompt" },
  ],
};

/* =================================================================
   APPLY CONFIG TO DOM TEXT
   ================================================================= */
function applyConfig() {
  document.querySelectorAll(".js-name").forEach(el => el.textContent = CONFIG.name);
  document.querySelectorAll(".js-title").forEach(el => el.textContent = CONFIG.title);
  document.querySelectorAll(".js-bio").forEach(el => el.textContent = CONFIG.bio);
  document.querySelectorAll(".js-tagline").forEach(el => el.textContent = CONFIG.tagline);
  document.querySelectorAll(".js-avatar-initials").forEach(el => el.textContent = CONFIG.avatarInitials);
  document.querySelectorAll(".reveal-age").forEach(el => el.textContent = `Level ${CONFIG.age}`);
  document.title = `${CONFIG.name} — Level ${CONFIG.age}`;
}

/* =================================================================
   TERMINAL BOOT ANIMATION
   ================================================================= */
function typeLine(container, text, className, speed = 22) {
  return new Promise(resolve => {
    const line = document.createElement("div");
    if (className) line.classList.add(className);
    container.appendChild(line);
    let i = 0;
    const timer = setInterval(() => {
      line.textContent = text.slice(0, i + 1);
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

async function runBootSequence() {
  const body = document.getElementById("terminalBody");
  const reveal = document.getElementById("reveal");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    CONFIG.bootLines.forEach(l => {
      const line = document.createElement("div");
      line.className = l.type === "prompt" ? "line-prompt" : "line-dim";
      line.textContent = l.text;
      body.appendChild(line);
    });
    reveal.classList.add("is-visible");
    return;
  }

  for (const l of CONFIG.bootLines) {
    await typeLine(body, l.text, l.type === "prompt" ? "line-prompt" : "line-dim");
    await new Promise(r => setTimeout(r, 180));
  }
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  body.appendChild(cursor);

  await new Promise(r => setTimeout(r, 400));
  reveal.classList.add("is-visible");
}

/* =================================================================
   CONFETTI (lightweight, no external dependency)
   ================================================================= */
function launchConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("celebrate 🥂");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#FFB84D", "#FF6B6B", "#8C87FF", "#6EE7C0"];
  const pieces = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.5,
    w: 6 + Math.random() * 6,
    h: 8 + Math.random() * 10,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedY: 2 + Math.random() * 3,
    speedX: -1.5 + Math.random() * 3,
    rotation: Math.random() * 360,
    rotationSpeed: -6 + Math.random() * 12,
  }));

  let frame = 0;
  const maxFrames = 220;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    frame++;
    if (frame < maxFrames) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  draw();
}

/* =================================================================
   STATS / SKILL TREE
   ================================================================= */
function renderStats() {
  const list = document.getElementById("statsList");
  list.innerHTML = "";
  CONFIG.interests.forEach(stat => {
    const li = document.createElement("li");
    li.className = "stat-row";
    li.innerHTML = `
      <div class="stat-row-top">
        <span class="stat-label">${escapeHTML(stat.label)}</span>
        <span class="stat-value">${stat.value}%</span>
      </div>
      <div class="stat-bar"><div class="stat-bar-fill" data-value="${stat.value}"></div></div>
    `;
    list.appendChild(li);
  });

  // animate bars in once visible
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".stat-bar-fill").forEach(bar => {
          bar.style.width = bar.dataset.value + "%";
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });
  observer.observe(document.querySelector(".stats-card"));
}

function renderBadges() {
  const row = document.getElementById("badgeRow");
  row.innerHTML = "";
  CONFIG.badges.forEach(b => {
    const span = document.createElement("span");
    span.className = "badge";
    span.innerHTML = `<span class="badge-emoji">${b.emoji}</span>${escapeHTML(b.label)}`;
    row.appendChild(span);
  });
}

/* =================================================================
   MEMORY GALLERY
   ================================================================= */
function renderMemories() {
  const grid = document.getElementById("memoryGrid");
  grid.innerHTML = "";
  CONFIG.memories.forEach((m, i) => {
    const tile = document.createElement("div");
    tile.className = "memory-tile" + (m.img ? "" : " memory-tile-placeholder");
    tile.setAttribute("role", "button");
    tile.setAttribute("tabindex", "0");
    tile.setAttribute("aria-label", `Open memory: ${m.label}`);

    if (m.img) {
      tile.innerHTML = `
        <img src="${m.img}" alt="${escapeHTML(m.label)}">
        <div class="memory-tile-scrim"></div>
        <span class="memory-tile-label">${escapeHTML(m.label)}</span>
      `;
    } else {
      tile.innerHTML = `
        <span class="icon">${m.icon}</span>
        <span class="memory-tile-label">${escapeHTML(m.label)}</span>
        <span class="hint">tap to preview · edit CONFIG.memories</span>
      `;
    }

    const open = () => openLightbox(m);
    tile.addEventListener("click", open);
    tile.addEventListener("keypress", e => { if (e.key === "Enter") open(); });

    grid.appendChild(tile);
  });
}

function openLightbox(m) {
  const lightbox = document.getElementById("lightbox");
  const media = document.getElementById("lightboxMedia");
  const caption = document.getElementById("lightboxCaption");

  media.innerHTML = m.img
    ? `<img src="${m.img}" alt="${escapeHTML(m.label)}">`
    : `<span>${m.icon}</span>`;
  caption.textContent = m.label;

  lightbox.hidden = false;
  document.getElementById("lightboxClose").focus();
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lightbox").hidden = true;
  document.body.style.overflow = "";
}

/* =================================================================
   GUESTBOOK (localStorage — per browser/device)
   ================================================================= */
const WISH_KEY = "birthdayHQ.wishes";

function loadWishes() {
  try {
    return JSON.parse(localStorage.getItem(WISH_KEY)) || [];
  } catch {
    return [];
  }
}

function saveWishes(wishes) {
  localStorage.setItem(WISH_KEY, JSON.stringify(wishes));
}

function renderWishes() {
  const list = document.getElementById("wishList");
  const empty = document.getElementById("wishEmpty");
  const wishes = loadWishes();

  list.innerHTML = "";
  empty.hidden = wishes.length > 0;

  wishes.slice().reverse().forEach(w => {
    const li = document.createElement("li");
    li.className = "wish-item";
    li.innerHTML = `
      <div class="wish-item-top">
        <span class="wish-name">${escapeHTML(w.name)}</span>
        <span class="wish-time">${escapeHTML(w.time)}</span>
      </div>
      <p class="wish-text">${escapeHTML(w.message)}</p>
    `;
    list.appendChild(li);
  });
}

function handleWishSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById("wishName");
  const messageInput = document.getElementById("wishMessage");

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();
  if (!name || !message) return;

  const wishes = loadWishes();
  wishes.push({
    name,
    message,
    time: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }),
  });
  saveWishes(wishes);
  renderWishes();

  nameInput.value = "";
  messageInput.value = "";
  nameInput.focus();
}

/* =================================================================
   UTIL
   ================================================================= */
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* =================================================================
   INIT
   ================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  runBootSequence();
  renderStats();
  renderBadges();
  renderMemories();
  renderWishes();

  document.getElementById("runCelebration").addEventListener("click", launchConfetti);
  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  document.getElementById("lightbox").addEventListener("click", e => {
    if (e.target.id === "lightbox") closeLightbox();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeLightbox();
  });
  document.getElementById("wishForm").addEventListener("submit", handleWishSubmit);

  window.addEventListener("resize", () => {
    const canvas = document.getElementById("confettiCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
});