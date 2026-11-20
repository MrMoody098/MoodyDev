const view = document.querySelector('#report-view');
const image = document.querySelector('#report-image');
const page = document.querySelector('#report-page');
const previous = document.querySelector('#previous-page');
const next = document.querySelector('#next-page');
const minus = document.querySelector('#report-minus');
const plus = document.querySelector('#report-plus');
const count = 42;
let scale = 1;
for (let n = 1; n <= count; n++) page.add(new Option(n, n));
function showPage(n) {
  page.value = n;
  image.src = 'media/fyp/pages/' + n + '.svg';
  image.alt = 'Final-year report, page ' + n + ' of ' + count;
  previous.disabled = n === 1;
  next.disabled = n === count;
  view.scrollTo(0, 0);
}
function zoom(factor, x = view.clientWidth / 2, y = view.clientHeight / 2) {
  const oldScale = scale;
  scale = Math.min(5, Math.max(1, scale * factor));
  const ratio = scale / oldScale;
  const left = (view.scrollLeft + x) * ratio - x;
  const top = (view.scrollTop + y) * ratio - y;
  image.style.width = scale * 100 + '%';
  view.scrollTo(left, top);
  minus.disabled = scale === 1;
  plus.disabled = scale === 5;
}
previous.onclick = () => showPage(Number(page.value) - 1);
next.onclick = () => showPage(Number(page.value) + 1);
page.onchange = () => showPage(Number(page.value));
minus.onclick = () => zoom(1 / 1.5);
plus.onclick = () => zoom(1.5);
document.querySelector('#report-fit').onclick = () => zoom(1 / scale);
attachViewerGestures(view, zoom);
document.querySelector('.reader-controls').hidden = false;
showPage(1);
zoom(1);
