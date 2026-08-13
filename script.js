/* ==========================================
   ROMANTIC WEB NEMBAK PACAR - INTERACTIVE JS
   6-BLOCK DUAL HEART PROPOSAL ENGINE
   DISCORD WEBHOOK REAL-TIME NOTIFICATIONS
   ========================================== */

// --- GLOBAL STATE ---
const state = {
  doiName: "Via",
  senderName: "aku",
  waNum: "6281234567890",
  proposalText: "sebenarnya aku udah lama banget nyimpen perasaan ini ke kamu, Devia... tiap hari ada kamu tuh bikin hari-hariku jauh lebih bahagia! jadi hari ini aku mau nanya langsung: <strong>Via, kamu mau gak jadi pacar aku? 👉👈</strong>",
  discordWebhook: "https://discord.com/api/webhooks/1537412788295831632/29FxLi7XLwZfIuSuCumO6m-HUTdUsEY2e0yaC0wBHuyeKA0h7YSV10GP2Yge1VBlKOay",
  musicUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=sweet-romance-112818.mp3",
  placedPieces: 0,
  selectedPieceIdx: null,
  activeHeartType: "yes" // "yes" = Full Heart (6 blocks), "no" = Broken Heart
};

// Natural evasive button warning messages
const noBtnMessages = [
  "eits ga bisa 😜",
  "yakin nih beneran ga mau? 🥺",
  "teganyaaa... 😭",
  "tombol ini macet, pencet yang hijau aja! 👈",
  "pikir-pikir lagi dong cantikk! ✨",
  "gak bisa diklik wkwkwk 🏃‍♂️",
  "coba lagi deh kalo bisa 😜",
  "pliss jangannn 🥺❤️"
];

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  loadSavedSettings();
  initBackgroundCanvas();
  initAudio();
  initEvents();
  initPuzzleGame();
  updateDOMWithState();
});

// --- LOCAL STORAGE & STATE ---
function loadSavedSettings() {
  const saved = localStorage.getItem("nembak_app_settings");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      Object.assign(state, parsed);
    } catch (e) {
      console.error("Failed to parse settings", e);
    }
  }
}

function saveSettings() {
  localStorage.setItem("nembak_app_settings", JSON.stringify({
    doiName: state.doiName,
    senderName: state.senderName,
    waNum: state.waNum,
    proposalText: state.proposalText,
    discordWebhook: state.discordWebhook,
    musicUrl: state.musicUrl
  }));
  updateDOMWithState();
  initPuzzleGame();
  playChimeSound(600, "sine");
  closeSettingsModal();
}

function resetSettings() {
  localStorage.removeItem("nembak_app_settings");
  state.doiName = "Via";
  state.senderName = "aku";
  state.waNum = "6281234567890";
  state.proposalText = "sebenarnya aku udah lama banget nyimpen perasaan ini ke kamu, Devia... tiap hari ada kamu tuh bikin hari-hariku jauh lebih bahagia! jadi hari ini aku mau nanya langsung: <strong>Via, kamu mau gak jadi pacar aku? 👉👈</strong>";
  state.discordWebhook = "https://discord.com/api/webhooks/1537412788295831632/29FxLi7XLwZfIuSuCumO6m-HUTdUsEY2e0yaC0wBHuyeKA0h7YSV10GP2Yge1VBlKOay";
  state.musicUrl = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=sweet-romance-112818.mp3";
  
  updateDOMWithState();
  initPuzzleGame();
  populateSettingsForm();
  playChimeSound(400, "sine");
}

function updateDOMWithState() {
  document.querySelectorAll(".doi-name").forEach(el => el.textContent = state.doiName);
  document.querySelectorAll(".sender-name").forEach(el => el.textContent = state.senderName);
  
  const proposalEl = document.getElementById("proposal-text");
  if (proposalEl) proposalEl.innerHTML = state.proposalText;

  const bgMusic = document.getElementById("bg-music");
  if (bgMusic && bgMusic.src !== state.musicUrl) {
    bgMusic.src = state.musicUrl;
  }

  updateWALink();
}

function updateWALink() {
  const waLinkEl = document.getElementById("wa-redirect-link");
  if (waLinkEl) {
    const todayStr = getFormattedDate();
    const message = `Halo ${state.senderName}! Iyaa Via mau kok jadi pacar kamu! 💖🥰 Mulai hari ini (${todayStr}) kita resmi ya! ✨`;
    const cleanNum = state.waNum.replace(/[^0-9]/g, "");
    waLinkEl.href = `https://wa.me/${cleanNum}?text=${encodeURIComponent(message)}`;
  }
}

function getFormattedDate() {
  const d = new Date();
  return d.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
}

// --- DISCORD WEBHOOK REALTIME NOTIFICATION ---
function sendDiscordNotification(eventStatus) {
  if (!state.discordWebhook || !state.discordWebhook.trim().startsWith("http")) return;

  let payload = {};

  if (eventStatus === "ACCEPTED") {
    payload = {
      username: "Kabar Dari Doi 💌",
      avatar_url: "https://cdn-icons-png.flaticon.com/512/2904/2904838.png",
      embeds: [{
        title: "YAAAY! DEVIA (VIA) MAU JADI PACAR LU!! 🎉🥳",
        description: `Asikkk! **${state.doiName}** baru aja selesai nyusun puzzle Hati Merah! Doi resmi jadian sama lu hari ini! 💕✨`,
        color: 16731003, // Pink #ff4b72
        fields: [
          { name: "👩‍❤️‍👨 Pasangan Baru", value: `${state.senderName} ❤️ ${state.doiName}`, inline: true },
          { name: "📅 Tanggal Jadian", value: getFormattedDate(), inline: true },
          { name: "💬 Status", value: "Resmi Berdua 🥰", inline: false }
        ],
        footer: { text: "selamat ya bro, jangan lupa ajak jalan! 🥳" },
        timestamp: new Date().toISOString()
      }]
    };
  } else if (eventStatus === "REJECTED_ATTEMPT") {
    payload = {
      username: "Kabar Dari Doi 💌",
      avatar_url: "https://cdn-icons-png.flaticon.com/512/1077/1077035.png",
      embeds: [{
        title: "wkwkwk Via sempet iseng mau milih Hati Retak 😜",
        description: `Tenang bro! Begitu **${state.doiName}** pencet Hati Retak, langsung dikasih pesan popup usil suruh susun Hati Merah yang utuh aja di sebelah! 😜👈`,
        color: 16753920, // Orange #ffaa00
        fields: [
          { name: "👤 Doi", value: state.doiName, inline: true },
          { name: "⚡ Status", value: "Ke-distract popup peringatan 😜", inline: true }
        ],
        footer: { text: "tunggu bentar lagi pasti disusun yang merah! ✨" },
        timestamp: new Date().toISOString()
      }]
    };
  }

  fetch(state.discordWebhook.trim(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then(() => console.log("Discord notification sent!"))
    .catch(err => console.error("Discord webhook error:", err));
}

// --- 6-BLOCK PUZZLE GAME ENGINE ---
function initPuzzleGame() {
  state.placedPieces = 0;
  state.selectedPieceIdx = null;
  document.getElementById("placed-count").textContent = "0";

  const tray = document.getElementById("pieces-tray");
  tray.innerHTML = "";

  const imgAsset = state.activeHeartType === "yes" ? "assets/heart_puzzle.svg" : "assets/heart_broken.svg";

  // Reset 6 grid slots
  const slots = document.querySelectorAll(".puzzle-slot");
  slots.forEach((slot, idx) => {
    slot.innerHTML = `<span class="slot-hint">${idx + 1}</span>`;
    slot.classList.remove("filled", "drag-over");
    
    slot.addEventListener("dragover", (e) => {
      e.preventDefault();
      slot.classList.add("drag-over");
    });

    slot.addEventListener("dragleave", () => {
      slot.classList.remove("drag-over");
    });

    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      slot.classList.remove("drag-over");
      const pieceIdx = e.dataTransfer.getData("text/plain");
      if (pieceIdx !== undefined && pieceIdx !== null) {
        attemptPlacePiece(parseInt(pieceIdx), slot, imgAsset);
      }
    });

    slot.addEventListener("click", () => {
      if (state.selectedPieceIdx !== null) {
        attemptPlacePiece(state.selectedPieceIdx, slot, imgAsset);
      }
    });
  });

  // Shuffled 6 piece indices (0..5)
  const pieceIndices = [3, 1, 5, 0, 4, 2];

  pieceIndices.forEach(pIdx => {
    const pieceEl = document.createElement("div");
    pieceEl.className = "puzzle-piece";
    pieceEl.setAttribute("data-piece", pIdx);
    pieceEl.setAttribute("draggable", "true");
    pieceEl.style.backgroundImage = `url('${imgAsset}')`;

    pieceEl.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", pIdx);
      selectPiece(pIdx, pieceEl);
    });

    pieceEl.addEventListener("click", (e) => {
      e.stopPropagation();
      selectPiece(pIdx, pieceEl);
    });

    tray.appendChild(pieceEl);
  });
}

function selectPiece(pIdx, pieceEl) {
  playChimeSound(500, "sine");
  document.querySelectorAll(".puzzle-piece").forEach(el => el.classList.remove("selected"));
  pieceEl.classList.add("selected");
  state.selectedPieceIdx = pIdx;
}

function attemptPlacePiece(pieceIdx, slotEl, imgAsset) {
  const slotIdx = parseInt(slotEl.getAttribute("data-slot"));

  if (slotIdx === pieceIdx && !slotEl.classList.contains("filled")) {
    playChimeSound(800, "sine");
    slotEl.classList.add("filled");
    
    const placedElem = document.createElement("div");
    placedElem.className = "puzzle-piece placed";
    placedElem.setAttribute("data-piece", pieceIdx);
    placedElem.style.backgroundImage = `url('${imgAsset}')`;
    slotEl.innerHTML = "";
    slotEl.appendChild(placedElem);

    const trayPiece = document.querySelector(`.pieces-tray .puzzle-piece[data-piece="${pieceIdx}"]`);
    if (trayPiece) trayPiece.remove();

    state.selectedPieceIdx = null;
    state.placedPieces++;
    document.getElementById("placed-count").textContent = state.placedPieces;

    if (state.placedPieces === 6) {
      if (state.activeHeartType === "yes") {
        setTimeout(onPuzzleComplete, 500);
      } else {
        showBrokenHeartWarning();
      }
    }
  } else {
    playChimeSound(250, "square");
    slotEl.classList.add("drag-over");
    setTimeout(() => slotEl.classList.remove("drag-over"), 400);
  }
}

function showBrokenHeartWarning() {
  playChimeSound(200, "sawtooth");
  const warnBox = document.getElementById("warning-box");
  warnBox.style.display = "block";

  // Send Discord alert notification for broken heart attempt
  sendDiscordNotification("REJECTED_ATTEMPT");

  setTimeout(() => {
    state.activeHeartType = "yes";
    document.getElementById("tab-yes-heart").classList.add("active");
    document.getElementById("tab-no-heart").classList.remove("active");
    warnBox.style.display = "none";
    initPuzzleGame();
  }, 2200);
}

function onPuzzleComplete() {
  playVictoryFanfare();
  triggerConfetti();

  // Send Discord notification for proposal accepted!
  sendDiscordNotification("ACCEPTED");

  setTimeout(() => {
    switchScreen("screen-victory");
  }, 1200);
}

// --- AUDIO CONTROLLER & WEB AUDIO API SYNTHESIZER ---
let audioCtx = null;
let isMusicPlaying = false;

function initAudio() {
  const bgMusic = document.getElementById("bg-music");
  bgMusic.src = state.musicUrl;
  bgMusic.volume = 0.5;

  const btnToggle = document.getElementById("btn-music-toggle");
  const vinylRecord = document.getElementById("vinyl-record");

  btnToggle.addEventListener("click", () => {
    if (isMusicPlaying) {
      bgMusic.pause();
      isMusicPlaying = false;
      vinylRecord.classList.remove("spin");
    } else {
      bgMusic.play().then(() => {
        isMusicPlaying = true;
        vinylRecord.classList.add("spin");
      }).catch(e => console.log("Audio play error", e));
    }
  });
}

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playChimeSound(freq = 523.25, type = "sine") {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {}
}

function playVictoryFanfare() {
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, idx) => {
    setTimeout(() => playChimeSound(freq, "triangle"), idx * 120);
  });
}

// --- FLOATING BACKGROUND SAKURA & HEARTS CANVAS ---
function initBackgroundCanvas() {
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const count = 45;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 14 + 6,
      speedY: Math.random() * 1.2 + 0.5,
      speedX: Math.sin(Math.random() * Math.PI) * 0.8,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.6 + 0.3,
      isHeart: Math.random() > 0.4
    });
  }

  function drawPetal(x, y, size, rotation, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = "#ffb7c5";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(size / 2, -size / 2, size, 0);
    ctx.quadraticCurveTo(size / 2, size / 2, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  function drawHeart(x, y, size, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = "#ff4b72";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
    ctx.bezierCurveTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.015) * 0.8;
      p.rotation += p.rotationSpeed;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }

      if (p.isHeart) {
        drawHeart(p.x, p.y, p.size, p.opacity);
      } else {
        drawPetal(p.x, p.y, p.size, p.rotation, p.opacity);
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// --- CONFETTI EXPLOSION CANVAS ---
function triggerConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const confettiCount = 120;
  const confetti = [];

  const colors = ['#ff4b72', '#ff758c', '#ffd166', '#06d6a0', '#118ab2', '#8a2be2', '#ffffff'];

  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      x: width / 2,
      y: height / 2 + 50,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.8) * 20,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  let animationFrame;

  function render() {
    ctx.clearRect(0, 0, width, height);

    let activeCount = 0;

    confetti.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4;
      p.vx *= 0.98;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.008;

      if (p.opacity > 0) {
        activeCount++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (activeCount > 0) {
      animationFrame = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, width, height);
      cancelAnimationFrame(animationFrame);
    }
  }

  render();
}

// --- EVENT HANDLERS & NAVIGATION ---
function initEvents() {
  const envelope = document.getElementById("envelope-trigger");
  envelope.addEventListener("click", () => {
    playChimeSound(800, "sine");
    envelope.classList.add("open");

    const bgMusic = document.getElementById("bg-music");
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      document.getElementById("vinyl-record").classList.add("spin");
    }).catch(e => console.log("Audio play blocked", e));

    setTimeout(() => {
      switchScreen("screen-proposal");
    }, 1200);
  });

  const tabYes = document.getElementById("tab-yes-heart");
  const tabNo = document.getElementById("tab-no-heart");

  tabYes.addEventListener("click", () => {
    state.activeHeartType = "yes";
    tabYes.classList.add("active");
    tabNo.classList.remove("active");
    document.getElementById("warning-box").style.display = "none";
    initPuzzleGame();
  });

  tabNo.addEventListener("click", () => {
    state.activeHeartType = "no";
    tabNo.classList.add("active");
    tabYes.classList.remove("active");
    showBrokenHeartWarning();
    initPuzzleGame();
  });

  document.getElementById("btn-open-settings").addEventListener("click", openSettingsModal);
  document.getElementById("btn-close-settings").addEventListener("click", closeSettingsModal);
  document.getElementById("btn-save-settings").addEventListener("click", () => {
    state.doiName = document.getElementById("input-doi-name").value.trim() || "Via";
    state.senderName = document.getElementById("input-sender-name").value.trim() || "aku";
    state.waNum = document.getElementById("input-wa-num").value.trim() || "6281234567890";
    state.proposalText = document.getElementById("input-proposal").value.trim() || state.proposalText;
    state.discordWebhook = document.getElementById("input-discord-webhook").value.trim();

    const musicInp = document.getElementById("input-music-url").value.trim();
    if (musicInp) state.musicUrl = musicInp;

    saveSettings();
  });
  document.getElementById("btn-reset-settings").addEventListener("click", resetSettings);
}

function switchScreen(screenId) {
  const screens = document.querySelectorAll(".screen");
  screens.forEach(s => s.classList.remove("active"));

  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add("active");
  }
}

function restartApp() {
  state.activeHeartType = "yes";
  document.getElementById("tab-yes-heart").classList.add("active");
  document.getElementById("tab-no-heart").classList.remove("active");
  document.getElementById("warning-box").style.display = "none";

  initPuzzleGame();
  switchScreen("screen-opening");
  
  const envelope = document.getElementById("envelope-trigger");
  if (envelope) envelope.classList.remove("open");
}

function openSettingsModal() {
  populateSettingsForm();
  document.getElementById("settings-modal").classList.add("active");
}

function closeSettingsModal() {
  document.getElementById("settings-modal").classList.remove("active");
}

function populateSettingsForm() {
  document.getElementById("input-doi-name").value = state.doiName;
  document.getElementById("input-sender-name").value = state.senderName;
  document.getElementById("input-wa-num").value = state.waNum;
  document.getElementById("input-proposal").value = state.proposalText;
  document.getElementById("input-discord-webhook").value = state.discordWebhook || "";
  document.getElementById("input-music-url").value = state.musicUrl;
}
