export function createLightbox({ galleryElement, images, onClose }) {
  if (!galleryElement || !images.length) {
    return undefined;
  }

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox hidden';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-labelledby', 'lightbox-title');
  lightbox.setAttribute('aria-describedby', 'lightbox-caption');

  const content = document.createElement('div');
  content.className = 'lightbox-content';

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'lightbox-close';
  closeButton.setAttribute('aria-label', 'Close memory lightbox');
  closeButton.textContent = '×';

  const image = document.createElement('img');
  image.className = 'lightbox-image';
  image.alt = '';

  const imageFallback = document.createElement('p');
  imageFallback.className = 'lightbox-image-fallback';
  imageFallback.textContent = 'Add a photo for this memory in js/memories.js.';
  imageFallback.hidden = true;

  const title = document.createElement('h3');
  title.id = 'lightbox-title';
  title.className = 'lightbox-title';

  const date = document.createElement('p');
  date.className = 'lightbox-date';

  const caption = document.createElement('p');
  caption.id = 'lightbox-caption';
  caption.className = 'lightbox-caption';

  const counter = document.createElement('p');
  counter.className = 'lightbox-counter';
  counter.setAttribute('aria-live', 'polite');
  counter.setAttribute('aria-atomic', 'true');

  const nav = document.createElement('div');
  nav.className = 'lightbox-nav';

  const prevButton = document.createElement('button');
  prevButton.type = 'button';
  prevButton.className = 'secondary-button lightbox-button';
  prevButton.textContent = 'Previous';

  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.className = 'primary-button lightbox-button';
  nextButton.textContent = 'Next';

  nav.append(prevButton, nextButton);
  content.append(closeButton, image, imageFallback, title, date, caption, counter, nav);
  lightbox.append(content);
  document.body.append(lightbox);

  let currentIndex = 0;
  let returnFocusElement = null;
  let inertElements = [];

  function updateLightbox(index) {
    currentIndex = (index + images.length) % images.length;
    const active = images[currentIndex];

    title.textContent = active.title;
    counter.textContent = `Memory ${currentIndex + 1} of ${images.length}`;
    date.textContent = active.date || '';
    date.hidden = !active.date;
    caption.textContent = active.caption || '';

    image.onerror = () => {
      image.hidden = true;
      imageFallback.hidden = false;
    };

    if (active.image) {
      image.hidden = false;
      image.src = active.image;
      image.alt = active.alt || active.title;
      imageFallback.hidden = true;
    } else {
      image.removeAttribute('src');
      image.alt = '';
      image.hidden = true;
      imageFallback.hidden = false;
    }
  }

  function open(index, trigger) {
    returnFocusElement = trigger instanceof HTMLElement ? trigger : document.activeElement;
    updateLightbox(index);
    lightbox.classList.remove('hidden');
    document.body.classList.add('lightbox-open');

    inertElements = Array.from(document.body.children)
      .filter((element) => element !== lightbox)
      .map((element) => ({ element, wasInert: element.inert }));
    inertElements.forEach(({ element }) => {
      element.inert = true;
    });

    closeButton.focus();
  }

  function close() {
    if (lightbox.classList.contains('hidden')) {
      return;
    }

    lightbox.classList.add('hidden');
    document.body.classList.remove('lightbox-open');
    inertElements.forEach(({ element, wasInert }) => {
      element.inert = wasInert;
    });
    inertElements = [];
    returnFocusElement?.focus();
    onClose?.();
  }

  closeButton.addEventListener('click', close);
  prevButton.addEventListener('click', () => updateLightbox(currentIndex - 1));
  nextButton.addEventListener('click', () => updateLightbox(currentIndex + 1));

  let touchStartX = null;

  image.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0]?.clientX ?? null;
  }, { passive: true });

  image.addEventListener('touchend', (event) => {
    if (touchStartX === null) {
      return;
    }

    const distance = event.changedTouches[0].clientX - touchStartX;
    touchStartX = null;

    if (Math.abs(distance) >= 55) {
      updateLightbox(currentIndex + (distance < 0 ? 1 : -1));
    }
  }, { passive: true });

  image.addEventListener('touchcancel', () => {
    touchStartX = null;
  }, { passive: true });

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      close();
    }
  });

  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      updateLightbox(currentIndex - 1);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      updateLightbox(currentIndex + 1);
      return;
    }

    if (event.key === 'Tab') {
      const focusable = [closeButton, prevButton, nextButton];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  return { open, close, updateLightbox };
}
