// Measure every authored state at the current width before playback changes the DOM.
export function reserveSpace(
  element,
  variants,
  render = (node, value) => {
    node.textContent = value;
  },
) {
  let lastWidth = -1;
  function measure() {
    const width = element.getBoundingClientRect().width;
    if (!width || width === lastWidth) return;
    lastWidth = width;
    const probe = element.cloneNode(true);
    probe.removeAttribute('id');
    probe.setAttribute('aria-hidden', 'true');
    probe.inert = true;
    Object.assign(probe.style, {
      position: 'absolute',
      visibility: 'hidden',
      pointerEvents: 'none',
      width: `${width}px`,
      minHeight: '0',
      height: 'auto',
      margin: '0',
    });
    element.parentElement.append(probe);
    let height = 0;
    for (const variant of variants) {
      render(probe, variant);
      height = Math.max(height, probe.getBoundingClientRect().height);
    }
    probe.remove();
    element.style.minHeight = `${Math.ceil(height)}px`;
  }
  measure();
  const observer = new ResizeObserver(measure);
  observer.observe(element);
  document.fonts.ready.then(() => {
    lastWidth = -1;
    measure();
  });
}

export function reserveRows(element, count) {
  const template = element.cloneNode(true);
  reserveSpace(element, [count], (probe, total) => {
    probe.replaceChildren(...Array.from(template.children, (child) => child.cloneNode(true)));
    while (probe.children.length < total) probe.append(template.lastElementChild.cloneNode(true));
  });
}
