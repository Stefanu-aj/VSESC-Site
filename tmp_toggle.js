document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('mobile-menu');

    if (!toggle || !menu) return;

    menu.hidden = true;
    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');

    const setOpen = (open) => {
        if (open) {
            menu.hidden = false;
            requestAnimationFrame(() => menu.classList.add('open'));
            document.body.classList.add('no-scroll');
            toggle.setAttribute('aria-expanded', 'true');
            menu.setAttribute('aria-hidden', 'false');
        } else {
            menu.classList.remove('open');
            document.body.classList.remove('no-scroll');
            toggle.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
            menu.addEventListener('transitionend', function hide() {
                menu.hidden = true;
                menu.removeEventListener('transitionend', hide);
            });
        }
    };

    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') === 'false'));

    document.addEventListener('click', (event) => {
        if (!menu.classList.contains('open')) return;
        if (event.target.closest('.nav_bar') || event.target.closest('#mobile-menu')) return;
        setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || !menu.classList.contains('open')) return;
        setOpen(false);
        toggle.focus();
    });
});
