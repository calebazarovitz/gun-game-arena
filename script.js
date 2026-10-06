const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const creditsDisplay = document.getElementById('creditsDisplay');
const wagerDisplay = document.getElementById('wagerDisplay');
const wagerValue = document.getElementById('wagerValue');
const roundStatus = document.getElementById('roundStatus');
const mapDisplay = document.getElementById('mapDisplay');
const healthFill = document.getElementById('healthFill');
const playerHealthText = document.getElementById('playerHealthText');
const streakDisplay = document.getElementById('streakDisplay');
const wagerInput = document.getElementById('wagerInput');
const startButton = document.getElementById('startButton');
const deployButton = document.getElementById('deployButton');
const weaponList = document.getElementById('weaponList');
const spawnPicker = document.getElementById('spawnPicker');

const statDamage = document.getElementById('statDamage');
const statFireRate = document.getElementById('statFireRate');
const statAccuracy = document.getElementById('statAccuracy');
const statMagazine = document.getElementById('statMagazine');

const weaponConfigs = {
  pistol: {
    name: 'M9 Pistol', category: 'Pistol', cost: 0, damage: 20, fireRate: 0.32, accuracy: 0.82,
    magSize: 12, reload: 1.2, range: 220, speed: 620, spread: 0.04, color: '#dfe7f2'
  },
  smg: {
    name: 'MP5 SMG', category: 'SMG', cost: 200, damage: 13, fireRate: 0.12, accuracy: 0.7,
    magSize: 30, reload: 1.4, range: 260, speed: 720, spread: 0.08, color: '#f8b84e'
  },
  heavy_smg: {
    name: 'Vector SMG', category: 'SMG', cost: 420, damage: 16, fireRate: 0.1, accuracy: 0.68,
    magSize: 32, reload: 1.5, range: 300, speed: 760, spread: 0.09, color: '#fbbf24'
  },
  rifle: {
    name: 'M4 Assault Rifle', category: 'Rifle', cost: 600, damage: 26, fireRate: 0.18, accuracy: 0.8,
    magSize: 30, reload: 1.7, range: 420, speed: 760, spread: 0.06, color: '#7dd3fc'
  },
  dmr: {
    name: 'DMR', category: 'Rifle', cost: 950, damage: 34, fireRate: 0.28, accuracy: 0.88,
    magSize: 18, reload: 1.9, range: 520, speed: 700, spread: 0.04, color: '#c4b5fd'
  },
  shotgun: {
    name: 'M1014', category: 'Shotgun', cost: 800, damage: 10, pellets: 7, fireRate: 0.7, accuracy: 0.55,
    magSize: 8, reload: 1.9, range: 170, speed: 660, spread: 0.24, color: '#fca5a5'
  },
  auto_shotgun: {
    name: 'Striker Auto', category: 'Shotgun', cost: 1200, damage: 12, pellets: 8, fireRate: 0.48, accuracy: 0.58,
    magSize: 10, reload: 2.1, range: 180, speed: 640, spread: 0.22, color: '#fca5a5'
  },
  sniper: {
    name: 'M82 Sniper', category: 'Sniper', cost: 1500, damage: 68, fireRate: 0.95, accuracy: 0.98,
    magSize: 5, reload: 2.3, range: 800, speed: 900, spread: 0.02, color: '#a7f3d0'
  }
};

const mapDefinitions = {
  warehouse: {
    name: 'Warehouse',
    bg1: '#1d2a39',
    bg2: '#101b29',
    accent: '#7dd3fc',
    enemyColor: '#f59e0b',
    floorLines: '#2f435a',
    obstacles: [
      { x: 150, y: 120, w: 120, h: 54 },
      { x: 720, y: 150, w: 140, h: 50 },
      { x: 390, y: 360, w: 150, h: 72 },
      { x: 260, y: 460, w: 170, h: 50 }
    ],
    spawns: [
      { name: 'North Gate', x: 160, y: 90 },
      { name: 'Center Floor', x: 480, y: 280 },
      { name: 'South Yard', x: 760, y: 520 },
      { name: 'East Crate', x: 840, y: 200 }
    ]
  },
  desert: {
    name: 'Desert',
    bg1: '#7c5a2c',
    bg2: '#4f3a18',
    accent: '#f4d35e',
    enemyColor: '#ef4444',
    floorLines: '#a36b31',
    obstacles: [
      { x: 200, y: 220, w: 140, h: 80 },
      { x: 630, y: 200, w: 160, h: 90 },
      { x: 370, y: 470, w: 190, h: 70 },
      { x: 680, y: 500, w: 100, h: 70 }
    ],
    spawns: [
      { name: 'Sun Post', x: 140, y: 110 },
      { name: 'Dune Ridge', x: 490, y: 180 },
      { name: 'Rock Cover', x: 850, y: 330 },
      { name: 'Base Line', x: 320, y: 520 }
    ]
  },
  city: {
    name: 'City',
    bg1: '#1d2333',
    bg2: '#0f172a',
    accent: '#c4b5fd',
    enemyColor: '#22c55e',
    floorLines: '#394867',
    obstacles: [
      { x: 120, y: 200, w: 160, h: 56 },
      { x: 350, y: 120, w: 110, h: 120 },
      { x: 650, y: 250, w: 170, h: 70 },
      { x: 280, y: 430, w: 160, h: 90 }
    ],
    spawns: [
      { name: 'Metro Entry', x: 120, y: 150 },
      { name: 'Roof Corner', x: 420, y: 100 },
      { name: 'Side Street', x: 800, y: 440 },
      { name: 'Plaza', x: 520, y: 520 }
    ]
  }
};

const state = {
  credits: 500,
  wager: 50,
  selectedMap: 'warehouse',
  selectedSpawn: 'North Gate',
  selectedWeapon: 'pistol',
  unlocked: { pistol: true, smg: true, heavy_smg: false, rifle: true, dmr: false, shotgun: false, auto_shotgun: false, sniper: false },
  roundActive: false,
  enemies: [],
  bullets: [],
  particles: [],
  enemyBullets: [],
  keys: {},
  pointer: { x: canvas.width / 2, y: canvas.height / 2 },
  mouseDown: false,
  player: {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    speed: 230,
    angle: 0,
    health: 100,
    maxHealth: 100,
    cooldown: 0,
    reloadTimer: 0,
    ammo: 12,
    reserveAmmo: 48,
    weapon: 'pistol'
  },
  elapsed: 0,
  roundTime: 0,
  roundGoal: 15,
  kills: 0,
  streak: 0,
  deployed: false
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function weaponStatsValues(weaponKey) {
  const w = weaponConfigs[weaponKey];
  if (!w) return { damage: 0, fireRate: 0, accuracy: 0, mag: 0 };
  return {
    damage: Math.round(w.damage * 10),
    fireRate: Math.round((1 / Math.max(w.fireRate, 0.08)) * 10),
    accuracy: Math.round(w.accuracy * 100),
    mag: w.magSize
  };
}

function updateStatsPanel() {
  const weapon = weaponConfigs[state.selectedWeapon];
  const stats = weaponStatsValues(state.selectedWeapon);
  statDamage.style.width = `${Math.min(stats.damage, 100)}%`;
  statFireRate.style.width = `${Math.min(stats.fireRate, 100)}%`;
  statAccuracy.style.width = `${stats.accuracy}%`;
  statMagazine.textContent = weapon.magSize;
}

function updateHud() {
  creditsDisplay.textContent = Math.floor(state.credits);
  wagerDisplay.textContent = state.wager;
  wagerValue.textContent = state.wager;
  mapDisplay.textContent = mapDefinitions[state.selectedMap].name;
  healthFill.style.width = `${(state.player.health / state.player.maxHealth) * 100}%`;
  playerHealthText.textContent = `${Math.max(0, Math.ceil(state.player.health))} / ${state.player.maxHealth}`;
  streakDisplay.textContent = state.streak;
}

function setWager(value) {
  state.wager = Number(value);
  wagerInput.value = value;
  updateHud();
}

function renderWeaponList() {
  weaponList.innerHTML = '';
  Object.entries(weaponConfigs).forEach(([key, weapon]) => {
    const button = document.createElement('button');
    button.className = `weapon-card ${state.selectedWeapon === key ? 'selected' : ''}`;
    button.dataset.weapon = key;
    const owned = state.unlocked[key];
    const display = owned ? 'Owned' : `$${weapon.cost}`;
    button.innerHTML = `
      <div>
        <div class="name">${weapon.name}</div>
        <div class="type">${weapon.category}</div>
      </div>
      <div class="meta">${display}</div>
    `;
    button.addEventListener('click', () => {
      if (!state.unlocked[key]) {
        if (state.credits >= weapon.cost) {
          state.credits -= weapon.cost;
          state.unlocked[key] = true;
        } else {
          return;
        }
      }
      state.selectedWeapon = key;
      applyWeaponToPlayer(key);
      renderWeaponList();
      updateStatsPanel();
      updateHud();
    });
    weaponList.appendChild(button);
  });
}

function applyWeaponToPlayer(key) {
  const config = weaponConfigs[key];
  state.player.weapon = key;
  const mag = config.magSize || 12;
  state.player.ammo = mag;
  state.player.reserveAmmo = mag * 4;
  state.player.cooldown = 0;
  state.player.reloadTimer = 0;
  updateStatsPanel();
}

function renderSpawnSelector() {
  const map = mapDefinitions[state.selectedMap];
  spawnPicker.innerHTML = '';
  map.spawns.forEach((spawn) => {
    const button = document.createElement('button');
    button.className = `spawn-button ${state.selectedSpawn === spawn.name ? 'active' : ''}`;
    button.textContent = spawn.name;
    button.addEventListener('click', () => {
      state.selectedSpawn = spawn.name;
      renderSpawnSelector();
    });
    spawnPicker.appendChild(button);
  });
}

function getSelectedSpawnCoords() {
  const map = mapDefinitions[state.selectedMap];
  const match = map.spawns.find((spawn) => spawn.name === state.selectedSpawn);
  return match || map.spawns[0];
}

function deployPlayer() {
  const spawn = getSelectedSpawnCoords();
  state.player.x = spawn.x;
  state.player.y = spawn.y;
  state.player.health = state.player.maxHealth;
  state.deployed = true;
  state.roundActive = false;
  roundStatus.textContent = 'Deployed';
  roundStatus.style.background = 'rgba(59,130,246,0.12)';
  roundStatus.style.color = '#60a5fa';
  updateHud();
  renderWeaponList();
}

function startRound() {
  if (!state.deployed) {
    deployPlayer();
  }

  const map = mapDefinitions[state.selectedMap];
  roundStatus.textContent = 'Live';
  roundStatus.style.background = 'rgba(34, 197, 94, 0.12)';
  roundStatus.style.color = '#22c55e';
  state.roundActive = true;
  state.roundTime = 0;
  state.kills = 0;
  state.streak = 0;
  state.enemies = [];
  state.bullets = [];
  state.enemyBullets = [];
  state.particles = [];

  const spawn = getSelectedSpawnCoords();
  state.player.x = spawn.x;
  state.player.y = spawn.y;
  state.player.health = state.player.maxHealth;
  applyWeaponToPlayer(state.selectedWeapon);

  for (let i = 0; i < 10; i += 1) {
    spawnEnemy();
  }
  updateHud();
}

function endRound(win) {
  state.roundActive = false;
  const payout = win ? Math.max(20, Math.floor(state.wager * 1.8)) : -Math.floor(state.wager * 0.5);
  state.credits += payout;

  if (win) {
    roundStatus.textContent = 'Victory';
    roundStatus.style.background = 'rgba(34, 197, 94, 0.12)';
    roundStatus.style.color = '#22c55e';
    state.streak += 1;
  } else {
    roundStatus.textContent = 'Defeat';
    roundStatus.style.background = 'rgba(239, 68, 68, 0.12)';
    roundStatus.style.color = '#ef4444';
    state.streak = 0;
  }

  state.credits = Math.max(0, state.credits);
  updateHud();
  renderWeaponList();
}

function spawnEnemy() {
  const pad = 40;
  const x = Math.random() * (canvas.width - pad * 2) + pad;
  const y = Math.random() * (canvas.height - pad * 2) + pad;

  if (distance({ x, y }, state.player) < 160) {
    return spawnEnemy();
  }

  const enemy = {
    x,
    y,
    radius: 14,
    speed: 58 + Math.random() * 40,
    health: 50 + Math.random() * 25,
    maxHealth: 50 + Math.random() * 25,
    fireCooldown: 0.8 + Math.random() * 1.3,
    hitFlash: 0,
    color: mapDefinitions[state.selectedMap].enemyColor,
    damage: 8 + Math.random() * 7
  };

  state.enemies.push(enemy);
}

function shootBullet() {
  if (!state.roundActive || state.player.reloadTimer > 0) {
    return;
  }

  const config = weaponConfigs[state.selectedWeapon];
  if (state.player.ammo <= 0) {
    if (state.player.reserveAmmo > 0) {
      state.player.reloadTimer = config.reload;
    }
    return;
  }

  if (state.player.cooldown > 0) {
    return;
  }

  state.player.cooldown = config.fireRate;
  state.player.ammo -= 1;

  const angle = state.player.angle + (Math.random() - 0.5) * (1 - config.accuracy) * 1.4;
  const pelletCount = config.pellets || 1;

  for (let i = 0; i < pelletCount; i += 1) {
    const pelletAngle = angle + (Math.random() - 0.5) * (config.spread || 0.04);
    state.bullets.push({
      x: state.player.x + Math.cos(angle) * 18,
      y: state.player.y + Math.sin(angle) * 18,
      dx: Math.cos(pelletAngle),
      dy: Math.sin(pelletAngle),
      speed: config.speed,
      damage: config.damage,
      radius: config.pellets ? 3 : 4,
      color: config.color,
      life: 1.2,
      pellets: pelletCount
    });
  }

  if (state.player.ammo <= 0 && state.player.reserveAmmo > 0) {
    state.player.reloadTimer = config.reload;
  }
}

function tryReload() {
  const config = weaponConfigs[state.selectedWeapon];
  if (state.player.reloadTimer <= 0 && state.player.ammo < config.magSize && state.player.reserveAmmo > 0) {
    state.player.reloadTimer = config.reload;
  }
}

function updatePlayer(dt) {
  const moveX = (state.keys['KeyD'] || state.keys['ArrowRight'] ? 1 : 0) - (state.keys['KeyA'] || state.keys['ArrowLeft'] ? 1 : 0);
  const moveY = (state.keys['KeyS'] || state.keys['ArrowDown'] ? 1 : 0) - (state.keys['KeyW'] || state.keys['ArrowUp'] ? 1 : 0);

  if (moveX !== 0 || moveY !== 0) {
    const len = Math.hypot(moveX, moveY) || 1;
    const nx = moveX / len;
    const ny = moveY / len;
    state.player.x += nx * state.player.speed * dt;
    state.player.y += ny * state.player.speed * dt;
  }

  state.player.x = clamp(state.player.x, 24, canvas.width - 24);
  state.player.y = clamp(state.player.y, 24, canvas.height - 24);

  const dx = state.pointer.x - state.player.x;
  const dy = state.pointer.y - state.player.y;
  state.player.angle = Math.atan2(dy, dx);

  if (state.mouseDown) {
    shootBullet();
  }

  if (state.player.cooldown > 0) state.player.cooldown -= dt;

  if (state.player.reloadTimer > 0) {
    state.player.reloadTimer -= dt;
    if (state.player.reloadTimer <= 0) {
      const config = weaponConfigs[state.selectedWeapon];
      const needed = Math.min(config.magSize - state.player.ammo, state.player.reserveAmmo);
      state.player.ammo += needed;
      state.player.reserveAmmo -= needed;
    }
  }
}

function updateBullets(dt) {
  for (let i = state.bullets.length - 1; i >= 0; i--) {
    const bullet = state.bullets[i];
    bullet.x += bullet.dx * bullet.speed * dt;
    bullet.y += bullet.dy * bullet.speed * dt;
    bullet.life -= dt;

    if (bullet.life <= 0 || bullet.x < -20 || bullet.x > canvas.width + 20 || bullet.y < -20 || bullet.y > canvas.height + 20) {
      state.bullets.splice(i, 1);
      continue;
    }

    for (let j = state.enemies.length - 1; j >= 0; j--) {
      const enemy = state.enemies[j];
      if (distance(bullet, enemy) < enemy.radius + bullet.radius) {
        enemy.health -= bullet.damage;
        enemy.hitFlash = 0.15;
        state.particles.push({ x: bullet.x, y: bullet.y, life: 0.25, radius: 3, color: '#fef3c7' });
        state.bullets.splice(i, 1);

        if (enemy.health <= 0) {
          state.kills += 1;
          state.streak += 1;
          state.credits += 12;
          state.enemies.splice(j, 1);
          for (let p = 0; p < 12; p++) {
            state.particles.push({
              x: enemy.x,
              y: enemy.y,
              life: 0.7 + Math.random() * 0.3,
              radius: 2 + Math.random() * 4,
              vx: (Math.random() - 0.5) * 140,
              vy: (Math.random() - 0.5) * 140,
              color: '#fbbf24'
            });
          }
          if (state.kills >= state.roundGoal) {
            endRound(true);
            break;
          }
        }
        break;
      }
    }
  }

  for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
    const bullet = state.enemyBullets[i];
    bullet.x += bullet.dx * bullet.speed * dt;
    bullet.y += bullet.dy * bullet.speed * dt;
    bullet.life -= dt;

    if (distance(bullet, state.player) < state.player.radius + bullet.radius) {
      state.player.health -= bullet.damage;
      state.particles.push({ x: bullet.x, y: bullet.y, life: 0.18, radius: 4, color: '#f87171' });
      state.enemyBullets.splice(i, 1);
      if (state.player.health <= 0) {
        endRound(false);
      }
      continue;
    }

    if (bullet.life <= 0 || bullet.x < -20 || bullet.x > canvas.width + 20 || bullet.y < -20 || bullet.y > canvas.height + 20) {
      state.enemyBullets.splice(i, 1);
    }
  }
}

function updateEnemies(dt) {
  for (let i = state.enemies.length - 1; i >= 0; i--) {
    const enemy = state.enemies[i];
    const dx = state.player.x - enemy.x;
    const dy = state.player.y - enemy.y;
    const d = Math.hypot(dx, dy) || 1;
    const nx = dx / d;
    const ny = dy / d;

    if (d > 12) {
      enemy.x += nx * enemy.speed * dt;
      enemy.y += ny * enemy.speed * dt;
    }

    enemy.fireCooldown -= dt;
    if (d < 260 && enemy.fireCooldown <= 0) {
      const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.18;
      state.enemyBullets.push({
        x: enemy.x,
        y: enemy.y,
        dx: Math.cos(angle),
        dy: Math.sin(angle),
        speed: 260,
        damage: enemy.damage,
        radius: 5,
        life: 1.7,
        color: '#ef4444'
      });
      enemy.fireCooldown = 0.9 + Math.random() * 1.3;
    }

    if (d < state.player.radius + enemy.radius + 6) {
      state.player.health -= enemy.damage * dt * 0.7;
    }

    if (state.player.health <= 0) {
      endRound(false);
      break;
    }
  }
}

function updateParticles(dt) {
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.life -= dt;
    p.x += p.vx ? p.vx * dt : 0;
    p.y += p.vy ? p.vy * dt : 0;
    if (p.life <= 0) {
      state.particles.splice(i, 1);
    }
  }
}

function drawArena() {
  const map = mapDefinitions[state.selectedMap];
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, map.bg1);
  gradient.addColorStop(1, map.bg2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = map.floorLines;
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.width; i += 50) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i < canvas.height; i += 50) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }

  map.obstacles.forEach((obs) => {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
    ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
  });

  state.enemies.forEach((enemy) => {
    ctx.beginPath();
    ctx.fillStyle = enemy.hitFlash > 0 ? '#fef3c7' : enemy.color;
    ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(enemy.x - 18, enemy.y - 24, 36, 6);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(enemy.x - 18, enemy.y - 24, (enemy.health / enemy.maxHealth) * 36, 6);
  });

  state.bullets.forEach((bullet) => {
    ctx.beginPath();
    ctx.fillStyle = bullet.color;
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  state.enemyBullets.forEach((bullet) => {
    ctx.beginPath();
    ctx.fillStyle = '#ef4444';
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  state.particles.forEach((p) => {
    ctx.beginPath();
    ctx.fillStyle = p.color || '#fef3c7';
    ctx.globalAlpha = Math.max(0, p.life * 2);
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  ctx.beginPath();
  ctx.fillStyle = '#e2e8f0';
  ctx.arc(state.player.x, state.player.y, state.player.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(state.player.x, state.player.y);
  ctx.lineTo(
    state.player.x + Math.cos(state.player.angle) * 26,
    state.player.y + Math.sin(state.player.angle) * 26
  );
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(20, canvas.height - 30, 220, 12);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(20, canvas.height - 30, (state.player.health / state.player.maxHealth) * 220, 12);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '14px sans-serif';
  ctx.fillText(`Kills ${state.kills}/${state.roundGoal}`, 20, canvas.height - 42);
}

function gameLoop(ts) {
  const dt = Math.min((ts - (gameLoop.last || ts)) / 1000, 0.03);
  gameLoop.last = ts;

  if (state.roundActive) {
    updatePlayer(dt);
    updateEnemies(dt);
    updateBullets(dt);
    updateParticles(dt);

    if (state.roundTime > 50 && state.kills < state.roundGoal) {
      endRound(false);
    }
    state.roundTime += dt;
  }

  drawArena();
  updateHud();
  requestAnimationFrame(gameLoop);
}

wagerInput.addEventListener('input', (event) => {
  setWager(event.target.value);
});

deployButton.addEventListener('click', () => {
  deployPlayer();
});

startButton.addEventListener('click', () => {
  startRound();
});

document.getElementById('mapPicker').addEventListener('click', (event) => {
  const button = event.target.closest('.map-button');
  if (!button) return;
  state.selectedMap = button.dataset.map;
  document.querySelectorAll('.map-button').forEach((btn) => btn.classList.toggle('active', btn === button));
  renderSpawnSelector();
  if (!state.roundActive) {
    drawArena();
  }
  updateHud();
});

window.addEventListener('keydown', (event) => {
  if (event.code === 'KeyR') {
    tryReload();
  }
  state.keys[event.code] = true;
  if (event.code === 'Space') {
    event.preventDefault();
    if (state.roundActive) shootBullet();
  }
});

window.addEventListener('keyup', (event) => {
  state.keys[event.code] = false;
});

canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  state.pointer.x = ((event.clientX - rect.left) / rect.width) * canvas.width;
  state.pointer.y = ((event.clientY - rect.top) / rect.height) * canvas.height;
});

canvas.addEventListener('mousedown', () => {
  state.mouseDown = true;
  if (state.roundActive) shootBullet();
});

canvas.addEventListener('mouseup', () => {
  state.mouseDown = false;
});

canvas.addEventListener('mouseleave', () => {
  state.mouseDown = false;
});

renderWeaponList();
renderSpawnSelector();
applyWeaponToPlayer(state.selectedWeapon);
setWager(state.wager);
updateStatsPanel();
updateHud();
renderSpawnSelector();
drawArena();
requestAnimationFrame(gameLoop);

