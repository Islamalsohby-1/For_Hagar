import { chapters } from './js/chapters.js';
import { memories } from './js/memories.js';
import { createLightbox } from './js/memory-lightbox.js';
import { reasons } from './js/reasons.js';
import { createPondMusic } from './js/music-player.js';

const beginStoryButton = document.querySelector('#begin-story');
const duckSurpriseButton = document.querySelector('#duck-surprise');
const storyCta = document.querySelector('#story-cta');
const previewTitle = document.querySelector('#preview-title');
const previewBlurb = document.querySelector('#preview-blurb');
const storySection = document.querySelector('#story-section');
const storyPanel = document.querySelector('.story-panel');
const storyTitle = document.querySelector('#story-chapter-title');
const storyBody = document.querySelector('#story-body');
const storyNote = document.querySelector('#story-note');
const chapterPhotoStrip = document.querySelector('#chapter-photo-strip');
const chapterNumber = document.querySelector('#chapter-number');
const chapterProgress = document.querySelector('#chapter-progress');
const chapterProgressLabel = document.querySelector('#chapter-progress-label');
const storyCompletion = document.querySelector('#story-completion');
const prevChapterButton = document.querySelector('#prev-chapter');
const nextChapterButton = document.querySelector('#next-chapter');
const storyIllustration = document.querySelector('#story-illustration');
const memoryGallery = document.querySelector('#memory-gallery');
const reasonsGrid = document.querySelector('#reasons-grid');
const gameScore = document.querySelector('#game-score');
const gameGoal = document.querySelector('#game-goal');
const gameBoard = document.querySelector('#game-board');
const duckPlayer = document.querySelector('#duck-player');
const gameMessage = document.querySelector('#game-message');
const startGameButton = document.querySelector('#game-start');
const restartGameButton = document.querySelector('#game-restart');
const revealSecretButton = document.querySelector('#reveal-secret');
const duckWhisperButton = document.querySelector('#duck-whisper');
const hiddenPondMessage = document.querySelector('#hidden-pond-message');
const revealLetterButton = document.querySelector('#reveal-letter');
const finalLetterContent = document.querySelector('#final-letter-content');
const finalLetterBody = document.querySelector('#final-letter-body');
const audioToggle = document.querySelector('#audio-toggle');
const galleryCount = document.querySelector('#gallery-count');
const pondMusicElement = document.querySelector('#pond-music');
const wishForm = document.querySelector('#wish-form');
const wishInput = document.querySelector('#wish-input');
const wishSubmit = document.querySelector('#wish-submit');
const wishCount = document.querySelector('#wish-count');
const wishStatus = document.querySelector('#wish-status');
const wishBoats = document.querySelector('#wish-boats');
const wishNote = document.querySelector('#wish-note');
const wishEmpty = document.querySelector('#wish-empty');
const wishClear = document.querySelector('#wish-clear');
const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input');
const messageCount = document.querySelector('#message-count');
const messagePreview = document.querySelector('#message-preview-text');
const whatsappSend = document.querySelector('#whatsapp-send');

let currentChapterIndex = 0;
let memoryLightbox;
const pondWishes = [];
const wishBoatPositions = [
  { left: 14, top: 58 },
  { left: 34, top: 35 },
  { left: 55, top: 64 },
  { left: 77, top: 39 },
  { left: 25, top: 72 },
  { left: 67, top: 76 }
];

const finalLetterParagraphs = [
  'Hagar, my dear love, I want you to know that you matter to me in the big moments and in all the ordinary ones in between.',
  'I admire the person you are, and I want to keep learning how to love you in the ways that matter most to you. You deserve to feel appreciated, listened to, and cared for—not only on special days, but in the everyday rhythm of life.',
  'I am grateful that our paths are part of the same story. I do not need to invent a grand scene to say what is true: I love you, I value you, and I am glad you are here.',
  'You are meine Frau, my love, and my favorite person to keep choosing.',
  'Thank you for being you. I love you dearly, and I look forward to the memories and chapters we will create together.'
];

const reasonArtwork = {
  'being-you': { icon: 'heart', tone: 'rose' },
  'your-smile': { icon: 'sun', tone: 'gold' },
  'your-presence': { icon: 'water', tone: 'water' },
  'your-heart': { icon: 'flower', tone: 'peach' },
  'our-laughter': { icon: 'ducks', tone: 'gold' },
  'small-details': { icon: 'details', tone: 'rose' },
  'your-strength': { icon: 'leaf', tone: 'mint' },
  'feeling-seen': { icon: 'eye', tone: 'water' },
  'hard-days': { icon: 'moon', tone: 'lavender' },
  'our-ordinary': { icon: 'mug', tone: 'peach' },
  'choosing-you': { icon: 'compass', tone: 'rose' },
  'what-is-next': { icon: 'book', tone: 'mint' }
};

const pondAudio = createPondMusic(pondMusicElement);
const whatsappRecipient = '201220015965';

const gameState = {
  started: false,
  finished: false,
  score: 0,
  goal: 5,
  playerX: 60,
  playerY: 140,
  playerSize: 44,
  stars: [],
  starId: 0
};

function renderPreview() {
  if (!chapters.length) {
    return;
  }

  const firstChapter = chapters[0];

  if (previewTitle) {
    previewTitle.textContent = firstChapter.title;
  }

  if (previewBlurb) {
    previewBlurb.textContent = firstChapter.preview;
  }
}

function renderChapter(index) {
  if (!chapters.length) {
    return;
  }

  const safeIndex = (index + chapters.length) % chapters.length;
  const chapter = chapters[safeIndex];
  currentChapterIndex = safeIndex;

  if (storyTitle) {
    storyTitle.textContent = chapter.title;
  }

  if (chapterNumber) {
    chapterNumber.textContent = `Chapter ${chapter.number}`;
  }

  if (storyBody) {
    storyBody.replaceChildren();
    chapter.story.forEach((text) => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      storyBody.appendChild(paragraph);
    });
  }

  if (storyNote) {
    storyNote.textContent = chapter.note;
  }

  if (chapterPhotoStrip) {
    chapterPhotoStrip.replaceChildren();
    const chapterMemories = memories
      .slice(safeIndex * 3, safeIndex * 3 + 3)
      .filter((memory) => memory.image);

    chapterMemories.forEach((memory) => {
      const figure = document.createElement('figure');
      figure.className = 'chapter-photo';

      const photoButton = document.createElement('button');
      photoButton.className = 'chapter-photo-button';
      photoButton.type = 'button';
      photoButton.setAttribute('aria-label', `Open memory: ${memory.title}`);

      const image = document.createElement('img');
      image.src = memory.image;
      image.alt = memory.alt || memory.title;
      image.loading = 'lazy';
      image.decoding = 'async';

      const caption = document.createElement('figcaption');
      caption.textContent = memory.title;

      photoButton.appendChild(image);
      photoButton.addEventListener('click', () => {
        memoryGallery.dataset.lightboxOpen = 'true';
        memoryLightbox?.open(memories.indexOf(memory), photoButton);
      });
      figure.append(photoButton, caption);
      chapterPhotoStrip.appendChild(figure);
    });

    chapterPhotoStrip.hidden = chapterMemories.length === 0;
  }

  const progressText = `${chapter.number} of ${chapters.length}`;

  if (chapterProgress) {
    chapterProgress.textContent = progressText;
  }

  if (chapterProgressLabel) {
    chapterProgressLabel.textContent = progressText;
  }

  if (storyIllustration) {
    storyIllustration.dataset.accent = chapter.accent || 'rose';
    storyIllustration.dataset.chapter = String(chapter.number);
  }

  if (storyCompletion) {
    storyCompletion.hidden = currentChapterIndex !== chapters.length - 1;
  }

  if (prevChapterButton) {
    prevChapterButton.disabled = currentChapterIndex === 0;
  }

  if (nextChapterButton) {
    const atLastChapter = currentChapterIndex === chapters.length - 1;
    nextChapterButton.textContent = atLastChapter ? 'End of story' : 'Next chapter';
    nextChapterButton.disabled = atLastChapter;
  }
}

function moveToChapter(step) {
  if (!chapters.length) {
    return;
  }

  const nextIndex = currentChapterIndex + step;
  const boundedIndex = Math.min(Math.max(nextIndex, 0), chapters.length - 1);
  renderChapter(boundedIndex);
}

function createFallbackCard(memory) {
  const fallback = document.createElement('div');
  fallback.className = 'memory-fallback';
  fallback.setAttribute('aria-hidden', 'true');

  const label = document.createElement('span');
  label.textContent = memory.image ? 'Photo unavailable' : 'Photo to add';
  fallback.appendChild(label);
  return fallback;
}

function renderMemoryGallery() {
  if (!memoryGallery) {
    return;
  }

  memoryGallery.innerHTML = '';

  if (!memories.length) {
    memoryGallery.innerHTML = '<p class="empty-state">Add your memories here.</p>';
    return;
  }

  const lightboxImages = memories.map((memory) => ({
    title: memory.title,
    date: memory.date,
    caption: memory.caption,
    image: memory.image,
    alt: memory.alt
  }));

  memoryLightbox = createLightbox({
    galleryElement: memoryGallery,
    images: lightboxImages,
    onClose: () => {
      memoryGallery.dataset.lightboxOpen = 'false';
    }
  });

  memories.forEach((memory, index) => {
    const card = document.createElement('article');
    card.className = `memory-card${index === 0 ? ' memory-card--featured' : ''}`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Open memory: ${memory.title}`);

    const media = document.createElement('div');
    media.className = 'memory-media';

    if (memory.image) {
      const image = document.createElement('img');
      image.className = 'memory-image';
      image.src = memory.image;
      image.alt = memory.alt || memory.title;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.onerror = () => {
        media.replaceChildren(createFallbackCard(memory));
      };
      media.appendChild(image);
    } else {
      media.appendChild(createFallbackCard(memory));
    }
    card.appendChild(media);

    const info = document.createElement('div');
    info.className = 'memory-info';

    const stamp = document.createElement('span');
    stamp.className = 'memory-stamp';
    stamp.setAttribute('aria-hidden', 'true');
    stamp.textContent = `A LITTLE MOMENT  /  ${String(index + 1).padStart(2, '0')}`;

    const title = document.createElement('h3');
    title.textContent = memory.title;

    const date = document.createElement('p');
    date.className = 'memory-date';
    date.textContent = memory.date;
    date.hidden = !memory.date;

    const caption = document.createElement('p');
    caption.className = 'memory-caption';
    caption.textContent = memory.caption;

    info.append(stamp, title, date, caption);
    card.appendChild(info);

    const activate = () => {
      memoryGallery.dataset.lightboxOpen = 'true';
      memoryLightbox?.open(index, card);
    };

    card.addEventListener('click', activate);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });

    memoryGallery.appendChild(card);
  });

  if (galleryCount) {
    const photoCount = memories.filter((memory) => memory.image).length;
    const futureCount = memories.length - photoCount;
    galleryCount.textContent = `${photoCount} photos · ${futureCount} pages left for later`;
  }
}

function renderReasons() {
  if (!reasonsGrid) {
    return;
  }

  reasonsGrid.innerHTML = '';

  reasons.forEach((reason) => {
    const card = document.createElement('article');
    card.className = 'reason-card';

    const artwork = reasonArtwork[reason.id];
    if (artwork) {
      const art = document.createElement('div');
      art.className = `reason-art reason-art--${artwork.tone}`;
      art.setAttribute('aria-hidden', 'true');

      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('viewBox', '0 0 64 64');
      icon.setAttribute('focusable', 'false');

      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', `#art-${artwork.icon}`);
      icon.appendChild(use);
      art.appendChild(icon);
      card.appendChild(art);
    }

    const label = document.createElement('span');
    label.className = 'reason-label';
    label.textContent = reason.personalized ? 'Personalize this' : 'A little note';

    const title = document.createElement('h3');
    title.textContent = reason.title;

    const summary = document.createElement('p');
    summary.className = 'reason-summary';
    summary.textContent = reason.summary;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'reason-toggle secondary-button';
    button.textContent = 'Read why';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', `reason-note-${reason.id}`);

    const note = document.createElement('p');
    note.id = `reason-note-${reason.id}`;
    note.className = 'reason-note';
    note.textContent = reason.note;
    note.hidden = true;

    const toggleNote = () => {
      const isVisible = !note.hidden;
      note.hidden = isVisible;
      button.setAttribute('aria-expanded', String(!isVisible));
      button.textContent = isVisible ? 'Read why' : 'Hide';
      card.classList.toggle('reason-open', !isVisible);
    };

    button.addEventListener('click', toggleNote);

    card.append(label, title, summary, button, note);
    reasonsGrid.appendChild(card);
  });
}

function renderWishBoats() {
  if (!wishBoats || !wishEmpty || !wishClear || !wishStatus || !wishSubmit) {
    return;
  }

  wishBoats.replaceChildren();
  pondWishes.forEach((wish, index) => {
    const boat = document.createElement('button');
    boat.className = 'wish-boat';
    boat.type = 'button';
    boat.setAttribute('aria-label', `Open paper boat ${index + 1}`);
    boat.setAttribute('aria-pressed', String(wishNote?.dataset.index === String(index)));
    boat.dataset.position = String(index);
    boat.style.left = `${wishBoatPositions[index].left}%`;
    boat.style.top = `${wishBoatPositions[index].top}%`;

    const sail = document.createElement('span');
    sail.className = 'wish-boat-sail';
    sail.setAttribute('aria-hidden', 'true');

    const hull = document.createElement('span');
    hull.className = 'wish-boat-hull';
    hull.setAttribute('aria-hidden', 'true');

    const wake = document.createElement('span');
    wake.className = 'wish-boat-wake';
    wake.setAttribute('aria-hidden', 'true');

    boat.append(sail, hull, wake);
    boat.addEventListener('click', () => {
      if (wishNote) {
        wishNote.textContent = `“${wish}”`;
        wishNote.hidden = false;
        wishNote.dataset.index = String(index);
      }

      wishBoats.querySelectorAll('.wish-boat').forEach((item) => {
        item.setAttribute('aria-pressed', String(item === boat));
      });
    });

    wishBoats.appendChild(boat);
  });

  wishEmpty.hidden = pondWishes.length > 0;
  wishClear.hidden = pondWishes.length === 0;
  wishSubmit.disabled = pondWishes.length >= wishBoatPositions.length;
  wishStatus.textContent = pondWishes.length >= wishBoatPositions.length
    ? 'The pond is full of wishes. Let them drift away to make room for more.'
    : pondWishes.length === 0
      ? 'No boats yet — what shall we hope for?'
      : `${pondWishes.length} ${pondWishes.length === 1 ? 'little boat is' : 'little boats are'} drifting. Choose one to read its wish.`;
}

function initializeWishPostOffice() {
  if (!wishForm || !wishInput || !wishCount || !wishNote) {
    return;
  }

  const updateWishCount = () => {
    wishCount.textContent = `${wishInput.value.length} / ${wishInput.maxLength}`;
    wishCount.classList.toggle('wish-count--near-limit', wishInput.value.length >= wishInput.maxLength - 20);
  };

  wishInput.addEventListener('input', updateWishCount);
  updateWishCount();

  document.querySelectorAll('[data-wish-suggestion]').forEach((suggestion) => {
    suggestion.addEventListener('click', () => {
      if (wishSubmit?.disabled) {
        return;
      }

      wishInput.value = suggestion.dataset.wishSuggestion || '';
      updateWishCount();
      wishInput.focus();
      wishInput.setSelectionRange(wishInput.value.length, wishInput.value.length);
    });
  });

  wishForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const wish = wishInput.value.trim();

    if (!wish) {
      if (wishStatus) {
        wishStatus.textContent = 'Write a little hope before folding your boat.';
      }
      wishInput.focus();
      return;
    }

    if (pondWishes.length >= wishBoatPositions.length) {
      renderWishBoats();
      return;
    }

    pondWishes.push(wish);
    wishInput.value = '';
    wishNote.hidden = true;
    delete wishNote.dataset.index;
    updateWishCount();
    renderWishBoats();
  });

  wishClear?.addEventListener('click', () => {
    pondWishes.length = 0;
    wishNote.textContent = '';
    wishNote.hidden = true;
    delete wishNote.dataset.index;
    renderWishBoats();
    wishInput.focus();
  });

  renderWishBoats();
}

function initializeMessageComposer() {
  if (!messageForm || !messageInput || !messageCount || !messagePreview || !whatsappSend) {
    return;
  }

  messageInput.value = '';

  const updateMessage = () => {
    const message = messageInput.value.trim();
    messageCount.textContent = `${messageInput.value.length} / ${messageInput.maxLength}`;
    messagePreview.textContent = message || 'Your own words will appear here, tucked into a little note from the pond.';
    const canSend = message.length > 0;
    whatsappSend.setAttribute('aria-disabled', String(!canSend));
    whatsappSend.tabIndex = canSend ? 0 : -1;

    if (canSend) {
      const note = `A little note from Our Little Pond 💌\n\n${message}\n\n— sent with love`;
      whatsappSend.href = `https://wa.me/${whatsappRecipient}?${new URLSearchParams({ text: note })}`;
    } else {
      whatsappSend.href = '#message-input';
    }

    messageCount.classList.toggle(
      'message-count--near-limit',
      messageInput.value.length >= messageInput.maxLength - 40
    );
  };

  messageInput.addEventListener('input', updateMessage);

  document.querySelectorAll('[data-message-prompt]').forEach((prompt) => {
    prompt.addEventListener('click', () => {
      messageInput.value = prompt.dataset.messagePrompt || '';
      updateMessage();
      messageInput.focus();
      messageInput.setSelectionRange(messageInput.value.length, messageInput.value.length);
    });
  });

  messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!messageInput.value.trim()) {
      messageInput.focus();
    }
  });

  whatsappSend.addEventListener('click', (event) => {
    if (!messageInput.value.trim()) {
      event.preventDefault();
      messageInput.focus();
    }
  });

  updateMessage();
}

function createStar(number) {
  const star = document.createElement('span');
  star.className = 'star-item';
  star.setAttribute('aria-hidden', 'true');
  star.dataset.starId = String(number);
  star.textContent = '✦';

  const boardWidth = gameBoard?.clientWidth || 320;
  const boardHeight = gameBoard?.clientHeight || 220;
  const maxX = Math.max(16, boardWidth - 40);
  const maxY = Math.max(26, boardHeight - 50);
  let x = 16;
  let y = 26;

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const candidateX = 16 + Math.random() * (maxX - 16);
    const candidateY = 26 + Math.random() * (maxY - 26);
    const overlapsDuck =
      Math.abs(candidateX + 12 - (gameState.playerX + gameState.playerSize / 2)) < 34 &&
      Math.abs(candidateY + 12 - (gameState.playerY + gameState.playerSize / 2)) < 34;
    const overlapsStar = gameState.stars.some(
      (star) => Math.abs(candidateX - star.x) < 54 && Math.abs(candidateY - star.y) < 54
    );

    x = candidateX;
    y = candidateY;

    if (!overlapsDuck && !overlapsStar) {
      break;
    }
  }

  star.style.left = `${x}px`;
  star.style.top = `${y}px`;

  gameState.stars.push({
    id: number,
    x,
    y,
    element: star,
    collected: false
  });

  gameBoard?.appendChild(star);
}

function updateHud() {
  if (gameScore) {
    gameScore.textContent = String(gameState.score);
  }

  if (gameGoal) {
    gameGoal.textContent = String(gameState.goal);
  }
}

function updatePlayerPosition() {
  if (!duckPlayer) {
    return;
  }

  duckPlayer.style.left = `${gameState.playerX}px`;
  duckPlayer.style.top = `${gameState.playerY}px`;
}

function checkCollisions() {
  if (!gameBoard || gameState.finished) {
    return;
  }

  const duckCenterX = gameState.playerX + gameState.playerSize / 2;
  const duckCenterY = gameState.playerY + gameState.playerSize / 2;

  gameState.stars = gameState.stars.filter((star) => {
    if (gameState.finished) {
      return true;
    }

    if (star.collected) {
      star.element.remove();
      return false;
    }

    const dx = Math.abs(star.x + 12 - duckCenterX);
    const dy = Math.abs(star.y + 12 - duckCenterY);

    if (dx < 28 && dy < 28) {
      star.collected = true;
      star.element.classList.add('collected');
      gameState.score += 1;
      updateHud();

      if (gameMessage) {
        const messages = [
          'A tiny star for my favorite little duck.',
          'You found one more spark of our pond magic.',
          'The pond seems even happier with you here.',
          'You are collecting all the sweetest little things.'
        ];
        gameMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
      }

      setTimeout(() => {
        star.element.remove();
      }, 120);

      if (gameState.score >= gameState.goal) {
        gameState.finished = true;
        gameState.started = false;
        star.element.remove();
        if (gameMessage) {
          gameMessage.textContent = 'You did it — the pond is glowing with love for Hagar.';
        }
        if (startGameButton) {
          startGameButton.textContent = 'Play again';
        }
      }

      return false;
    }

    return true;
  });

  if (gameState.finished) {
    gameState.stars.forEach((star) => star.element.remove());
    gameState.stars = [];
  }
}

function spawnStars() {
  const boardWidth = gameBoard?.clientWidth || 320;
  const boardHeight = gameBoard?.clientHeight || 220;

  if (gameState.stars.length >= gameState.goal) {
    return;
  }

  const needed = Math.max(0, gameState.goal - gameState.stars.length);

  for (let i = 0; i < needed; i += 1) {
    const id = gameState.starId + 1;
    gameState.starId = id;
    createStar(id);
  }

  gameState.stars.forEach((star) => {
    star.x = Math.min(Math.max(star.x, 16), boardWidth - 42);
    star.y = Math.min(Math.max(star.y, 26), boardHeight - 54);
    star.element.style.left = `${star.x}px`;
    star.element.style.top = `${star.y}px`;
  });
}

function resetGameState() {
  gameState.started = false;
  gameState.finished = false;
  gameState.score = 0;
  gameState.playerX = 60;
  gameState.playerY = 140;
  gameState.stars.forEach((star) => star.element.remove());
  gameState.stars = [];
  gameState.starId = 0;
  updatePlayerPosition();
  updateHud();

  if (gameMessage) {
    gameMessage.textContent = 'Help the duck gather stars and watch the pond glow a little brighter.';
  }

  if (startGameButton) {
    startGameButton.textContent = 'Start game';
  }
}

function startGame() {
  if (!gameBoard) {
    return;
  }

  gameState.started = true;
  gameState.finished = false;
  gameState.score = 0;
  gameState.playerX = 60;
  gameState.playerY = 140;
  gameState.stars.forEach((star) => star.element.remove());
  gameState.stars = [];
  gameState.starId = 0;
  updatePlayerPosition();
  updateHud();
  spawnStars();

  if (gameMessage) {
    gameMessage.textContent = 'Go, little duck. The stars are waiting.';
  }
}

function moveDuck(dx, dy) {
  if (!gameBoard || !gameState.started || gameState.finished) {
    return;
  }

  const boardWidth = gameBoard.clientWidth;
  const boardHeight = gameBoard.clientHeight;

  gameState.playerX = Math.min(Math.max(gameState.playerX + dx, 0), boardWidth - gameState.playerSize);
  gameState.playerY = Math.min(Math.max(gameState.playerY + dy, 0), boardHeight - gameState.playerSize);
  updatePlayerPosition();
  checkCollisions();
}

function attachGameControls() {
  if (!gameBoard) {
    return;
  }

  window.addEventListener('resize', () => {
    if (!gameBoard || !gameState.started) {
      return;
    }

    const boardWidth = gameBoard.clientWidth;
    const boardHeight = gameBoard.clientHeight;
    gameState.playerX = Math.min(gameState.playerX, boardWidth - gameState.playerSize);
    gameState.playerY = Math.min(gameState.playerY, boardHeight - gameState.playerSize);

    gameState.stars.forEach((star) => {
      star.x = Math.min(star.x, boardWidth - 42);
      star.y = Math.min(star.y, boardHeight - 54);
      star.element.style.left = `${star.x}px`;
      star.element.style.top = `${star.y}px`;
    });

    updatePlayerPosition();
  });

  gameBoard.addEventListener('pointerdown', (event) => {
    if (!gameState.started || gameState.finished) {
      return;
    }

    const rect = gameBoard.getBoundingClientRect();
    const x = event.clientX - rect.left - gameState.playerSize / 2;
    const y = event.clientY - rect.top - gameState.playerSize / 2;

    gameState.playerX = Math.min(Math.max(x, 0), rect.width - gameState.playerSize);
    gameState.playerY = Math.min(Math.max(y, 0), rect.height - gameState.playerSize);
    updatePlayerPosition();
    checkCollisions();
  });

  gameBoard.addEventListener('keydown', (event) => {
    const keyMap = {
      ArrowLeft: [-18, 0],
      ArrowRight: [18, 0],
      ArrowUp: [0, -18],
      ArrowDown: [0, 18],
      a: [-18, 0],
      d: [18, 0],
      w: [0, -18],
      s: [0, 18]
    };

    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

    if (keyMap[key]) {
      event.preventDefault();
      moveDuck(...keyMap[key]);
    }
  });
}

function revealSecretMessage() {
  if (hiddenPondMessage) {
    hiddenPondMessage.textContent = 'Hidden message: the best part of my whole story is choosing you, again and again.';
  }

  if (storyCta) {
    storyCta.textContent = 'You found the secret pond note, and it says you are my favorite person of all.';
  }
}

function renderFinalLetter() {
  if (!finalLetterBody) {
    return;
  }

  finalLetterBody.replaceChildren();
  finalLetterParagraphs.forEach((text) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    finalLetterBody.appendChild(paragraph);
  });

  const affectionateNames = document.createElement('p');
  affectionateNames.append('And my ');
  ['بطتي', 'مزتي'].forEach((nickname, index) => {
    const isolatedNickname = document.createElement('bdi');
    isolatedNickname.textContent = nickname;
    isolatedNickname.dir = 'auto';
    affectionateNames.appendChild(isolatedNickname);

    if (index === 0) {
      affectionateNames.append(', my ');
    }
  });
  affectionateNames.append(', my sexy lady: I cherish you, in every language and every little name.');
  finalLetterBody.appendChild(affectionateNames);
}

async function handleAudioToggle() {
  if (!audioToggle || !pondAudio || !pondAudio.isSupported) {
    if (audioToggle) {
      audioToggle.textContent = 'Music unavailable';
      audioToggle.disabled = true;
    }
    return;
  }

  audioToggle.disabled = true;

  try {
    const active = await pondAudio.toggle();
    audioToggle.textContent = active ? 'Pause romantic piano' : 'Play romantic piano';
    audioToggle.setAttribute('aria-label', active ? 'Pause romantic piano music' : 'Play romantic piano music');
    audioToggle.setAttribute('aria-pressed', String(active));
  } catch {
    audioToggle.textContent = 'Try music again';
    audioToggle.setAttribute('aria-label', 'Try romantic piano music again');
    audioToggle.setAttribute('aria-pressed', 'false');
    if (storyCta) {
      storyCta.textContent = 'The piano could not start in this browser. The story still works beautifully without it.';
    }
  } finally {
    audioToggle.disabled = false;
  }
}

renderPreview();
renderChapter(0);
renderMemoryGallery();
renderReasons();
initializeWishPostOffice();
initializeMessageComposer();
renderFinalLetter();
updateHud();
updatePlayerPosition();
attachGameControls();

audioToggle?.addEventListener('click', handleAudioToggle);

startGameButton?.addEventListener('click', () => {
  startGame();
  gameBoard?.focus();
});

restartGameButton?.addEventListener('click', () => {
  resetGameState();
  startGame();
  gameBoard?.focus();
});

revealSecretButton?.addEventListener('click', () => {
  revealSecretMessage();
  revealSecretButton.textContent = 'Secret revealed';
  revealSecretButton.disabled = true;
});

duckWhisperButton?.addEventListener('click', () => {
  revealSecretMessage();
  duckWhisperButton.setAttribute('aria-label', 'The pink duck shared its secret');
});

revealLetterButton?.addEventListener('click', () => {
  if (!finalLetterContent) {
    return;
  }

  finalLetterContent.classList.remove('hidden');
  revealLetterButton.textContent = 'Letter revealed';
  revealLetterButton.disabled = true;
});

beginStoryButton?.addEventListener('click', () => {
  if (storyCta) {
    storyCta.textContent = 'The first page is turning for you, meine Frau.';
  }

  if (beginStoryButton) {
    beginStoryButton.textContent = 'Story unlocked';
  }

  storySection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

duckSurpriseButton?.addEventListener('click', () => {
  if (storyCta) {
    storyCta.textContent = 'You are my favorite person to turn a quiet moment into a memory.';
  }

  if (duckSurpriseButton) {
    duckSurpriseButton.textContent = 'Secret found';
    duckSurpriseButton.disabled = true;
  }
});

prevChapterButton?.addEventListener('click', () => {
  moveToChapter(-1);
});

nextChapterButton?.addEventListener('click', () => {
  moveToChapter(1);
});

storySection?.addEventListener('keydown', (event) => {
  if (event.target !== storyPanel) {
    return;
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    moveToChapter(-1);
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    moveToChapter(1);
  }
});
