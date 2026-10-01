const pages = [
  { className: 'cover', kicker: 'ВЫПУСК 01 · ОСЕНЬ', title: 'Тихие<br><em>маршруты</em>', copy: 'Небольшой путеводитель для тех, кто выбирает дорогу без спешки.', footer: 'ЛИСТАЙТЕ ВПЕРЁД', shapes: '<i class="shape sun"></i><i class="shape hill"></i>' },
  { className: 'lake', kicker: '01 · УТРО', title: 'Озеро<br>до первого<br><em>ветра</em>', copy: 'Вода ещё помнит ночное небо. Лучшее время для прогулки — до того, как город успеет проснуться.', footer: '45.102° N · 7.202° E', shapes: '<i class="shape water"></i><i class="shape leaf"></i>' },
  { className: 'city', kicker: '02 · ПОЛДЕНЬ', title: 'Городские<br><em>арки</em>', copy: 'Найдите улицу, где солнце рисует на камнях полукруги. Там всегда есть маленькое кафе.', footer: 'ШАГ 08 421', shapes: '<i class="shape sunset"></i><i class="shape arch"></i>' },
  { className: 'end', kicker: '03 · ВЕЧЕР', title: 'Оставить<br>место для<br><em>тишины</em>', copy: 'Последняя страница — не финал. Это приглашение однажды вернуться и продолжить маршрут.', footer: 'КОНЕЦ ВЫПУСКА', shapes: '<i class="shape circle-lines"></i>' }
];

const currentPage = document.querySelector('#currentPage');
const turningPage = document.querySelector('#turningPage');
const bookScene = document.querySelector('#book');
const prevButton = document.querySelector('#prevButton');
const nextButton = document.querySelector('#nextButton');
const pageNumber = document.querySelector('#pageNumber');
let currentIndex = 0;
let isTurning = false;
let touchStartX = 0;

function pageMarkup(page, number) {
  return `<div class="page-layout ${page.className}">
    ${page.shapes}
    <p class="page-kicker">${page.kicker}</p>
    <span class="page-number">${String(number + 1).padStart(2, '0')}</span>
    <h2 class="page-title">${page.title}</h2>
    <p class="page-copy">${page.copy}</p>
    <div class="page-footer"><span>${page.footer}</span><span>FLIPBOOK</span></div>
  </div>`;
}

function updateControls() {
  currentPage.innerHTML = pageMarkup(pages[currentIndex], currentIndex);
  pageNumber.textContent = String(currentIndex + 1).padStart(2, '0');
  prevButton.disabled = isTurning || currentIndex === 0;
  nextButton.disabled = isTurning || currentIndex === pages.length - 1;
}

function render() {
  updateControls();
}

function turn(direction) {
  const nextIndex = currentIndex + direction;
  if (isTurning || nextIndex < 0 || nextIndex >= pages.length) return;
  isTurning = true;
  bookScene.setAttribute('aria-busy', 'true');
  turningPage.innerHTML = currentPage.innerHTML;
  turningPage.className = `turning-page ${direction > 0 ? 'forward' : 'backward'}`;
  currentIndex = nextIndex;
  updateControls();
  turningPage.addEventListener('animationend', () => {
    turningPage.className = 'turning-page';
    turningPage.innerHTML = '';
    isTurning = false;
    bookScene.removeAttribute('aria-busy');
    updateControls();
  }, { once: true });
}

prevButton.addEventListener('click', () => turn(-1));
nextButton.addEventListener('click', () => turn(1));
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') turn(-1);
  if (event.key === 'ArrowRight') turn(1);
});
bookScene.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
bookScene.addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(distance) > 42) turn(distance < 0 ? 1 : -1);
}, { passive: true });

render();
