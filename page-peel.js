// Native scrolling supplies momentum, keyboard navigation and reversible progress.
(() => {
  const media = matchMedia('(max-width: 740px) and (prefers-reduced-motion: no-preference)');
  const main = document.querySelector('main');
  const pages = [...main.children];
  const folds = pages.map(() => document.createElement('span'));
  let heights = [], origin, frame;

  function paint() {
    frame = 0;
    let start = origin;
    const viewport = document.documentElement.clientHeight;
    pages.forEach((page, i) => {
      const height = heights[i];
      const distance = scrollY - start;
      const lift = i ? Math.min(viewport, Math.max(0, -distance)) : 0;
      const progress = Math.min(1, Math.max(0, (distance - height + viewport) / viewport));
      page.style.setProperty('--lift', -lift + 'px');
      page.style.setProperty('--pin', Math.min(0, viewport - height) + 'px');
      const turning = i < pages.length - 1 && progress > 0;
      const width = page.clientWidth;
      const cut = progress * (width + viewport);
      // A line x + y = limit stays at 45 degrees across every aspect ratio.
      const limit = width + height - cut;
      page.style.clipPath = turning ? `polygon(0 0, ${limit}px 0, 0 ${limit}px)` : '';
      const fold = folds[i];
      fold.hidden = !turning || progress >= 1;
      if (!fold.hidden) {
        const band = Math.min(cut * .45, 12 + Math.sin(Math.PI * progress) * width * .22);
        const reach = cut + band;
        fold.style.clipPath = `polygon(100% 100%, ${width - reach}px 100%, 100% ${height - reach}px)`;
        const edge = cut / Math.SQRT2;
        fold.style.background = `linear-gradient(315deg, #887866 ${edge}px, #d6caba ${edge + band*.18}px, #fff9eb ${edge + band*.52}px, #b7a994 ${edge + band/Math.SQRT2}px)`;
      }
      start += height;
    });
  }

  function measure() {
    if (!media.matches) return;
    origin = main.getBoundingClientRect().top + scrollY;
    heights = pages.map(page => page.getBoundingClientRect().height);
    paint();
  }
  function schedule() {
    if (!frame && media.matches) frame = requestAnimationFrame(paint);
  }
  const observer = new ResizeObserver(measure);
  function configure() {
    cancelAnimationFrame(frame);
    frame = 0;
    observer.disconnect();
    main.classList.toggle('peeling', media.matches);
    pages.forEach((page, i) => {
      page.classList.toggle('sheet', media.matches);
      if (media.matches) {
        folds[i].className = 'sheet-fold';
        folds[i].setAttribute('aria-hidden', 'true');
        page.append(folds[i]);
        page.style.zIndex = pages.length - i;
        observer.observe(page);
      } else {
        folds[i].remove();
        for (const prop of ['z-index','clip-path','--lift','--pin']) page.style.removeProperty(prop);
      }
    });
    measure();
  }
  function alignAnchor() {
    if (!media.matches || !location.hash) return;
    const index = pages.findIndex(page => '#' + page.id === location.hash);
    if (index >= 0) scrollTo(0, origin + heights.slice(0, index).reduce((sum, h) => sum + h, 0));
  }
  addEventListener('hashchange', alignAnchor);
  addEventListener('load', alignAnchor);
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', measure);
  media.addEventListener('change', configure);
  configure();
})();
