(() => {
  const links = [['Services', '/services/'], ['Work', '/work/'], ['About', '/about/']];
  const header = document.getElementById('site-header');
  header.innerHTML = `<div class="reading-progress" aria-hidden="true"></div><div class="wrap site-header"><a class="brand" href="/" aria-label="RPD Business LLC home"><span class="brand-dot" aria-hidden="true"></span>RPD BUSINESS LLC</a><button class="menu-toggle" type="button" aria-controls="main-nav" aria-expanded="false" aria-label="Open navigation">Menu <span aria-hidden="true">＋</span></button><nav id="main-nav" aria-label="Main navigation">${links.map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}<a class="nav-cta" href="/contact/">Free Growth Audit <span aria-hidden="true">↗</span></a></nav></div>`;
  document.getElementById('site-footer').innerHTML = `<div class="wrap footer-main"><div><a class="brand" href="/"><span class="brand-dot" aria-hidden="true"></span>RPD BUSINESS LLC</a><p>Digital marketing agency · North Canton, Ohio</p></div><nav aria-label="Footer navigation"><a href="/services/">Services</a><a href="/work/">Work</a><a href="/about/">About</a><a href="/contact/">Contact</a></nav><div class="footer-contact"><a href="mailto:rpdbusinessllc@gmail.com">rpdbusinessllc@gmail.com</a><a href="tel:+13304378842">(330) 437-8842</a></div></div><div class="wrap footer-bottom"><span>RPD Business LLC</span><a href="#main">Back to top ↑</a></div>`;
  const menu = header.querySelector('.menu-toggle');
  const nav = header.querySelector('#main-nav');
  function closeMenu() {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
    nav.removeAttribute('data-open');
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.toggleAttribute('data-open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      closeMenu(); menu.focus();
    }
  });
  function markPage() {
    for (const link of nav.querySelectorAll('a')) {
      if (link.pathname.replace(/\/$/, '') === location.pathname.replace(/\/$/, '')) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
  }
  let pending;
  async function loadPage(url, push = true) {
    pending?.abort();
    const controller = new AbortController();
    pending = controller;
    header.classList.add('is-loading');
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error('Page unavailable');
      const page = new DOMParser().parseFromString(await response.text(), 'text/html');
      const main = page.querySelector('main');
      if (!main) throw new Error('Missing page content');
      document.querySelector('main').replaceWith(main);
      document.title = page.title;
      const description = document.querySelector('meta[name="description"]');
      const nextDescription = page.querySelector('meta[name="description"]');
      if (description && nextDescription) description.content = nextDescription.content;
      if (push) history.pushState({}, '', url);
      closeMenu(); markPage();
      window.scrollTo({top:0, behavior:'instant'});
      document.dispatchEvent(new Event('site:page'));
      main.setAttribute('tabindex', '-1');
      main.focus({preventScroll:true});
    } catch (error) {
      if (error.name !== 'AbortError') location.assign(url);
    } finally {
      if (pending === controller) header.classList.remove('is-loading');
    }
  }
  const routes = new Set(['/', '/services', '/work', '/about', '/contact']);
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin || url.hash || !routes.has(url.pathname.replace(/\/$/, '') || '/')) return;
    event.preventDefault();
    if (url.pathname === location.pathname) {closeMenu(); window.scrollTo({top:0, behavior:'smooth'}); return;}
    loadPage(url.pathname + url.search);
  });
  window.addEventListener('popstate', () => loadPage(location.pathname + location.search, false));
  markPage();
})();
