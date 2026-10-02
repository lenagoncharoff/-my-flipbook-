const sheets = [
  {
    front: { className: 'cover', kicker: 'ВЫПУСК 01 · ОСЕНЬ', title: 'Тихие<br><em>маршруты</em>', copy: 'Небольшой путеводитель для тех, кто выбирает дорогу без спешки.', footer: 'ЛИСТАЙТЕ ВПЕРЁД', shapes: '<i class="shape sun"></i><i class="shape hill"></i>' },
    back: { className: 'inside-cover', kicker: 'ТИХИЕ МАРШРУТЫ', title: 'Начать<br><em>путь</em>', copy: 'Откройте книгу и оставьте немного места для дороги, света и тишины.', footer: 'ОСЕНЬ · 2024', shapes: '<i class="shape route-mark"></i>' }
  },
  {
    front: { className: 'lake', kicker: '01 · УТРО', title: 'Озеро<br>до первого<br><em>ветра</em>', copy: 'Вода ещё помнит ночное небо. Лучшее время для прогулки — до того, как город успеет проснуться.', footer: '45.102° N · 7.202° E', shapes: '<i class="shape water"></i><i class="shape leaf-shape"></i>' },
    back: { className: 'city', kicker: '02 · ПОЛДЕНЬ', title: 'Городские<br><em>арки</em>', copy: 'Найдите улицу, где солнце рисует на камнях полукруги. Там всегда есть маленькое кафе.', footer: 'ШАГ 08 421', shapes: '<i class="shape sunset"></i><i class="shape arch"></i>' }
  },
  {
    front: { className: 'end', kicker: '03 · ВЕЧЕР', title: 'Оставить<br>место для<br><em>тишины</em>', copy: 'Последняя страница — не финал. Это приглашение однажды вернуться и продолжить маршрут.', footer: 'КОНЕЦ ВЫПУСКА', shapes: '<i class="shape circle-lines"></i>' },
    back: { className: 'back-cover', kicker: 'ТИХИЕ МАРШРУТЫ', title: 'До новых<br><em>маршрутов</em>', copy: 'Спасибо, что прошли этот путь вместе с нами.', footer: 'FLIPBOOK · 2024', shapes: '<i class="shape back-mark"></i>' }
  }
];

const leaves = document.querySelector('#leaves');
const bookScene = document.querySelector('#book');
const prevButton = document.querySelector('#prevButton');
const nextButton = document.querySelector('#nextButton');
const pageNumber = document.querySelector('#pageNumber');
const pageTotal = document.querySelector('#pageTotal');
const fullscreenButton = document.querySelector('#fullscreenButton');
const fullscreenLabel = document.querySelector('#fullscreenLabel');
let position = 0;
let touchStartX = 0;

function pageMarkup(page, number) {
  return `<div class="page-layout ${page.className}">${page.shapes}<p class="page-kicker">${page.kicker}</p><span class="page-number">${String(number).padStart(2, '0')}</span><h2 class="page-title">${page.title}</h2><p class="page-copy">${page.copy}</p><div class="page-footer"><span>${page.footer}</span><span>FLIPBOOK</span></div></div>`;
}

function syncLayers() {
  [...leaves.children].forEach((leaf, index) => {
    const flipped = index < position;
    leaf.classList.toggle('is-flipped', flipped);
    leaf.style.zIndex = flipped ? String(30 + index) : String(30 - index);
  });
}

function updateControls() {
  pageNumber.textContent = String(position + 1).padStart(2, '0');
  pageTotal.textContent = String(sheets.length + 1).padStart(2, '0');
  prevButton.hidden = position === 0;
  nextButton.hidden = position === sheets.length;
  bookScene.setAttribute('aria-label', `Раскрытая книга. Положение ${position + 1} из ${sheets.length + 1}`);
}

function turn(direction) {
  const target = position + direction;
  if (target < 0 || target > sheets.length) return;
  position = target;
  syncLayers();
  updateControls();
}

function renderSheets() {
  leaves.innerHTML = sheets.map((sheet, index) => `<article class="leaf" aria-label="Лист ${index + 1}"><section class="page-face page-face--front">${pageMarkup(sheet.front, index + 1)}</section><section class="page-face page-face--back">${pageMarkup(sheet.back, index + 2)}</section></article>`).join('');
  syncLayers();
  updateControls();
}

async function toggleFullscreen() {
  if (document.fullscreenElement) await document.exitFullscreen();
  else await bookScene.requestFullscreen();
}

prevButton.addEventListener('click', () => turn(-1));
nextButton.addEventListener('click', () => turn(1));
fullscreenButton.addEventListener('click', () => { toggleFullscreen().catch(() => {}); });
document.addEventListener('fullscreenchange', () => {
  const active = document.fullscreenElement === bookScene;
  fullscreenLabel.textContent = active ? 'Выйти из полноэкранного режима' : 'Книга на весь экран';
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') turn(-1);
  if (event.key === 'ArrowRight') turn(1);
});
bookScene.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
bookScene.addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(distance) > 42) turn(distance < 0 ? 1 : -1);
}, { passive: true });

renderSheets();
