(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let observer;
  function revealPage() {
    observer?.disconnect();
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const elements = entry.target.hasAttribute('data-stagger') ? [...entry.target.children] : [entry.target];
        elements.forEach((element, index) => element.animate([
          {opacity:0, transform:'translateY(24px)'},
          {opacity:1, transform:'translateY(0)'}
        ], {duration:650, delay:index * 65, easing:'cubic-bezier(.2,.7,.2,1)'}));
        observer.unobserve(entry.target);
      }
    }, {threshold:0.08});
    document.querySelectorAll('[data-reveal], [data-stagger]').forEach(element => observer.observe(element));
    const intro = document.querySelector('.hero-copy, .page-intro, .contact-copy');
    if (intro) [...intro.children].forEach((element,index) => element.animate([
      {opacity:0, transform:'translateY(20px)'},
      {opacity:1, transform:'translateY(0)'}
    ], {duration:750, delay:80 + index * 90, easing:'cubic-bezier(.2,.7,.2,1)'}));
  }
  let queued = false;
  function progress() {
    queued = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    document.querySelector('.reading-progress')?.style.setProperty('--progress', `${max > 0 ? Math.min(1,scrollY / max) : 0}`);
    document.getElementById('site-header')?.classList.toggle('scrolled', scrollY > 20);
  }
  window.addEventListener('scroll', () => {
    if (!queued) {queued = true; requestAnimationFrame(progress);}
  }, {passive:true});
  window.addEventListener('resize', progress);
  document.addEventListener('site:page', () => {revealPage(); progress();});
  reducedMotion.addEventListener('change', () => {
    document.getAnimations().forEach(animation => animation.finish());
    revealPage();
  });
  revealPage(); progress();
})();
