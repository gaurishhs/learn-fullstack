let stopContentsSpy: (() => void) | undefined;
let siteInitialized = false;
let editorModule: typeof import('./lesson-editor') | undefined;
let searchIndexPromise: Promise<{
  index: import('flexsearch').Index;
  documents: Map<string, SearchDocument>;
}> | undefined;
let searchRequest = 0;

type SearchDocument = {
  id: string;
  title: string;
  course: string;
  url: string;
  description: string;
  sections: string[];
  body: string;
};

function selectedTheme() {
  return localStorage.getItem('theme') ?? 'system';
}

function applyTheme() {
  const theme = selectedTheme();
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll<HTMLElement>('.theme-label').forEach((label) => {
    label.textContent = theme[0].toUpperCase() + theme.slice(1);
  });
  document.dispatchEvent(new Event('theme-change'));
}

function setSidebarActiveLink() {
  const sidebar = document.querySelector<HTMLElement>('[data-course-sidebar]');
  if (!sidebar) return;

  const currentPath = window.location.pathname.replace(/\/$/, '');
  sidebar.querySelectorAll<HTMLAnchorElement>('.sidebar-link').forEach((link) => {
    const active = new URL(link.href).pathname.replace(/\/$/, '') === currentPath;
    link.classList.toggle('current', active);
    link.querySelector('.current-mark')?.remove();
    if (active) {
      const mark = document.createElement('span');
      mark.className = 'current-mark absolute -left-px top-2 h-3 w-0.5 rounded bg-accent';
      mark.setAttribute('aria-hidden', 'true');
      link.append(mark);
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function setActiveTableOfContents() {
  stopContentsSpy?.();

  const contents = document.querySelector<HTMLElement>('[data-page-toc]');
  if (!contents) return;

  const links = Array.from(contents.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
  const normalizeHash = (value: string) => {
    try {
      return decodeURIComponent(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    } catch {
      return value.toLowerCase();
    }
  };
  const headingByHash = new Map(
    Array.from(document.querySelectorAll<HTMLElement>('.lesson-body-content h2[id], .lesson-body-content h3[id]'), (heading) => {
      const normalizedId = normalizeHash(heading.id);
      heading.id = normalizedId;
      return [normalizedId, heading] as const;
    }),
  );
  const headings = links
    .map((link) => headingByHash.get(normalizeHash(link.hash.slice(1))))
    .filter((heading): heading is HTMLElement => heading !== undefined);
  if (!headings.length) return;

  const setActive = (heading: HTMLElement) => {
    links.forEach((link) => {
      const active = normalizeHash(link.hash.slice(1)) === normalizeHash(heading.id);
      link.classList.toggle('current', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const updateActive = () => {
    const activationLine = window.innerHeight * 0.45;
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      setActive(headings[headings.length - 1]);
      return;
    }
    const current = headings.reduce((active, heading) => (
      heading.getBoundingClientRect().top <= activationLine ? heading : active
    ), headings[0]);
    setActive(current);
  };

  let frame = 0;
  const clickController = new AbortController();
  const onScroll = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      updateActive();
    });
  };

  updateActive();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('hashchange', onScroll);
  contents.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const heading = headingByHash.get(normalizeHash(link.hash.slice(1)));
    if (heading) setActive(heading);
  }, { signal: clickController.signal });
  stopContentsSpy = () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    window.removeEventListener('hashchange', onScroll);
    clickController.abort();
    if (frame) window.cancelAnimationFrame(frame);
  };
}

function closePanels() {
  document.querySelector('[data-search-dialog]')?.setAttribute('aria-hidden', 'true');
  document.querySelector('[data-mobile-drawer]')?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('dialog-open');
}

async function loadSearchIndex() {
  searchIndexPromise ??= (async () => {
    const [flexsearch, response] = await Promise.all([
      import('flexsearch'),
      fetch('/search-index.json'),
    ]);
    if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);

    const lessons = (await response.json()) as SearchDocument[];
    const index = new flexsearch.Index({ tokenize: 'forward', cache: true });
    const documents = new Map<string, SearchDocument>();

    lessons.forEach((lesson) => {
      documents.set(lesson.id, lesson);
      index.add(
        lesson.id,
        `${lesson.title} ${lesson.course} ${lesson.description} ${lesson.sections.join(' ')} ${lesson.body}`,
      );
    });

    return { index, documents };
  })();

  return searchIndexPromise;
}

function showSearchMessage(results: HTMLElement, message: string) {
  const hint = document.createElement('p');
  hint.className = 'search-hint';
  hint.textContent = message;
  results.replaceChildren(hint);
}

function buildSearchResult(lesson: SearchDocument) {
  const link = document.createElement('a');
  link.className = 'search-result flex items-center justify-between rounded px-2.5 py-2';
  link.href = lesson.url;
  link.dataset.searchResult = '';
  link.setAttribute('aria-selected', 'false');

  const text = document.createElement('span');
  text.className = 'grid gap-px';
  const course = document.createElement('small');
  course.textContent = lesson.course;
  const title = document.createElement('strong');
  title.textContent = lesson.title;
  const description = document.createElement('i');
  description.textContent = lesson.description;
  text.append(course, title, description);

  const arrow = document.createElement('b');
  arrow.textContent = '↗';
  link.append(text, arrow);
  return link;
}

async function renderSearchResults(input: HTMLInputElement) {
  const dialog = input.closest<HTMLElement>('[data-search-dialog]');
  const results = dialog?.querySelector<HTMLElement>('[data-search-results]');
  if (!dialog || !results) return;

  const query = input.value.trim();
  const request = ++searchRequest;
  if (!query) {
    showSearchMessage(results, 'Search lessons by title or topic.');
    return;
  }

  showSearchMessage(results, 'Searching lessons…');
  try {
    const { index, documents } = await loadSearchIndex();
    if (request !== searchRequest || !input.isConnected) return;

    const matches = index.search(query, { limit: 8, suggest: true }) as string[];
    const lessons = matches
      .map((id) => documents.get(String(id)))
      .filter((lesson): lesson is SearchDocument => Boolean(lesson));

    if (!lessons.length) {
      showSearchMessage(results, 'No lessons found. Try another search.');
      return;
    }

    results.replaceChildren(...lessons.map(buildSearchResult));
  } catch (error) {
    console.error('Unable to search lessons', error);
    searchIndexPromise = undefined;
    if (request === searchRequest) showSearchMessage(results, 'Search is unavailable right now.');
  }
}

function moveSearchSelection(direction: -1 | 1) {
  const results = document.querySelector<HTMLElement>('[data-search-results]');
  const links = [...(results?.querySelectorAll<HTMLAnchorElement>('[data-search-result]') ?? [])];
  if (!links.length) return false;

  const activeIndex = links.findIndex((link) => link.getAttribute('aria-selected') === 'true');
  const nextIndex = activeIndex === -1
    ? (direction === 1 ? 0 : links.length - 1)
    : (activeIndex + direction + links.length) % links.length;

  links.forEach((link, index) => {
    const selected = index === nextIndex;
    link.setAttribute('aria-selected', String(selected));
    if (selected) link.scrollIntoView({ block: 'nearest' });
  });
  return true;
}

async function setupCurrentPage() {
  applyTheme();
  setSidebarActiveLink();
  setActiveTableOfContents();

  if (document.querySelector('[data-editor-host]')) {
    editorModule ??= await import('./lesson-editor');
    editorModule.setupLessonEditor();
  } else {
    editorModule?.destroyLessonEditor();
  }
}

export function initializeSite() {
  if (siteInitialized) return;
  siteInitialized = true;

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (target.closest('[data-theme-cycle]')) {
      const current = selectedTheme();
      const next = current === 'system' ? 'light' : current === 'light' ? 'dark' : 'system';
      localStorage.setItem('theme', next);
      applyTheme();
      return;
    }

    if (target.closest('[data-search-open]')) {
      const dialog = document.querySelector<HTMLElement>('[data-search-dialog]');
      dialog?.setAttribute('aria-hidden', 'false');
      document.body.classList.add('dialog-open');
      const input = dialog?.querySelector<HTMLInputElement>('[data-search-input]');
      if (input) {
        renderSearchResults(input);
        input.focus();
      }
      return;
    }

    if (target.closest('[data-menu-open]')) {
      document.querySelector('[data-mobile-drawer]')?.setAttribute('aria-hidden', 'false');
      document.body.classList.add('dialog-open');
      return;
    }

    if (target.closest('[data-search-close], [data-menu-close]')) closePanels();
    if (target.closest('[data-search-results] a')) closePanels();
  });

  document.addEventListener('input', (event) => {
    if (event.target instanceof HTMLInputElement && event.target.matches('[data-search-input]')) renderSearchResults(event.target);
  });

  document.addEventListener('keydown', (event) => {
    if (event.target instanceof HTMLInputElement && event.target.matches('[data-search-input]')) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        moveSearchSelection(event.key === 'ArrowDown' ? 1 : -1);
        return;
      }
      if (event.key === 'Enter') {
        const selected = document.querySelector<HTMLAnchorElement>(
          '[data-search-result][aria-selected="true"]',
        ) ?? document.querySelector<HTMLAnchorElement>('[data-search-result]');
        if (selected) {
          event.preventDefault();
          selected.click();
          return;
        }
      }
    }

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      document.querySelector<HTMLElement>('[data-search-open]')?.click();
    }
    if (event.key === 'Escape') closePanels();
  });

  document.addEventListener('astro:before-swap', () => editorModule?.destroyLessonEditor());
  document.addEventListener('astro:after-swap', () => {
    applyTheme();
    setSidebarActiveLink();
    setActiveTableOfContents();
    closePanels();
  });
  document.addEventListener('astro:page-load', () => { void setupCurrentPage(); });

  void setupCurrentPage();
}
