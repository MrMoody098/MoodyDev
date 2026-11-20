// Keep manipulation local to the scrollable drawing or document.
function attachViewerGestures(view, zoomAt) {
  const points = new Map();
  const relative = event => {
    const box = view.getBoundingClientRect();
    return { x: event.clientX - box.left, y: event.clientY - box.top };
  };
  function gesture() {
    const [a, b] = points.values();
    if (!b) return a;
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2,
      distance: Math.hypot(b.x - a.x, b.y - a.y) };
  }
  view.addEventListener('pointerdown', event => {
    if (event.button !== 0 || points.size >= 2) return;
    points.set(event.pointerId, relative(event));
    view.setPointerCapture(event.pointerId);
    view.classList.add('dragging');
  });
  view.addEventListener('pointermove', event => {
    if (!points.has(event.pointerId)) return;
    const before = gesture();
    points.set(event.pointerId, relative(event));
    const after = gesture();
    if (before.distance && after.distance) zoomAt(after.distance / before.distance, before.x, before.y);
    view.scrollBy(before.x - after.x, before.y - after.y);
  });
  function release(event) {
    points.delete(event.pointerId);
    if (!points.size) view.classList.remove('dragging');
  }
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) view.addEventListener(name, release);
  const panel = view.parentElement;
  function visible() {
    const rect = view.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < innerHeight;
  }
  function zoomAnchor(event) {
    if (view.contains(event.target)) return relative(event);
    return { x: view.clientWidth / 2, y: view.clientHeight / 2 };
  }
  // Chrome decides whether to claim a wheel sequence at its first event.
  // Listen in capture so the toolbar and the page margins are covered too.
  window.addEventListener('wheel', event => {
    // Plain wheel movement scrolls the document; Chrome sends trackpad pinch as Ctrl+wheel.
    if (!event.ctrlKey && !event.metaKey) return;
    if (!visible()) return;
    event.preventDefault();
    const {x, y} = zoomAnchor(event);
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? view.clientHeight : 1;
    zoomAt(Math.exp(-event.deltaY * unit * .012), x, y);
  }, {passive: false, capture: true});
  window.addEventListener('keydown', event => {
    if (!(event.ctrlKey || event.metaKey) || !['+', '=', '-', '0'].includes(event.key)) return;
    if (!visible()) return;
    event.preventDefault();
    if (event.key === '0') panel.querySelector('#diagram-fit, #report-fit').click();
    else zoomAt(event.key === '-' ? 1 / 1.5 : 1.5, view.clientWidth / 2, view.clientHeight / 2);
  }, {capture: true});
}
