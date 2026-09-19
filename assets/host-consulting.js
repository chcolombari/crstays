/* Mobile navigation only. All commercial content and links work without JS. */
(() => {
  const button = document.querySelector('.menu-toggle');
  const menu = document.getElementById('site-navigation');
  if (!button || !menu) return;
  const close = () => {
    button.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
  };
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  });
  menu.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      close();
      button.focus();
    }
  });
  document.addEventListener('click', event => { if (!event.target.closest('#mainNav')) close(); });
  window.matchMedia('(min-width: 951px)').addEventListener('change', close);
})();
