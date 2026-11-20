// Bounds in the original board's 5400 by 2925 coordinate system.
const flows = {
  system: [176, 0, 1170, 710],
  register: [401, 1032, 2050, 830],
  login: [2440, 1032, 2195, 830],
  verify: [2615, 45, 560, 560],
  share: [3170, 55, 905, 875],
  encrypt: [405, 1890, 2400, 825],
  keys: [2860, 2030, 2400, 555],
  all: [0, 0, 5400, 2925]
};
const view = document.querySelector('#diagram-view');
const drawing = document.querySelector('#diagram-image');
const flow = document.querySelector('#diagram-flow');
const minus = document.querySelector('#zoom-out');
const plus = document.querySelector('#zoom-in');
let scale = 1;
function fitScale() {
  return Math.min(view.clientWidth / 5400, view.clientHeight / 2925);
}
function position(scaleWanted, x, y, anchorX = view.clientWidth / 2, anchorY = view.clientHeight / 2) {
  const minimum = fitScale();
  scale = Math.min(4, Math.max(minimum, scaleWanted));
  drawing.style.width = (5400 * scale) + 'px';
  view.scrollLeft = x * scale - anchorX;
  view.scrollTop = y * scale - anchorY;
  document.querySelector('#diagram-scale').value = Math.round(scale / minimum * 100) + '%';
  minus.disabled = scale <= minimum;
  plus.disabled = scale >= 4;
}
function focusFlow() {
  const [x, y, w, h] = flows[flow.value];
  position(Math.min(view.clientWidth / w, view.clientHeight / h), x + w / 2, y + h / 2);
}
function zoom(factor, x = view.clientWidth / 2, y = view.clientHeight / 2) {
  position(scale * factor, (view.scrollLeft + x) / scale, (view.scrollTop + y) / scale, x, y);
}
minus.onclick = () => zoom(1 / 1.5);
plus.onclick = () => zoom(1.5);
flow.onchange = focusFlow;
document.querySelector('#diagram-fit').onclick = focusFlow;
attachViewerGestures(view, zoom);
window.addEventListener('resize', focusFlow);
focusFlow();

const explorer = document.querySelector('#architecture');
const fullScreen = document.querySelector('#diagram-fullscreen');
function updateFullScreen() {
  const active = document.fullscreenElement === explorer || explorer.classList.contains('expanded');
  fullScreen.textContent = active ? 'Exit full screen' : 'Full screen';
  fullScreen.setAttribute('aria-pressed', String(active));
  requestAnimationFrame(focusFlow);
}
fullScreen.addEventListener('click', async () => {
  if (document.fullscreenElement === explorer) {
    await document.exitFullscreen();
  } else if (explorer.classList.contains('expanded')) {
    explorer.classList.remove('expanded');
  } else {
    try {
      await explorer.requestFullscreen();
    } catch {
      explorer.classList.add('expanded');
    }
  }
  updateFullScreen();
});
document.addEventListener('fullscreenchange', updateFullScreen);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && explorer.classList.contains('expanded')) {
    explorer.classList.remove('expanded');
    updateFullScreen();
    fullScreen.focus();
  }
});
