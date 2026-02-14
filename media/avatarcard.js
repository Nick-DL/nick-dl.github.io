const logoContainer = document.getElementById('nickDlLogo');
if (logoContainer) {
    logoContainer.addEventListener('mousemove', (e) => {
        const rect = logoContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        logoContainer.querySelector('::before') || logoContainer.style.setProperty('--mouse-x', `${xPercent}%`);
        logoContainer.style.setProperty('--mouse-x', `${xPercent}%`);
        logoContainer.style.setProperty('--mouse-y', `${yPercent}%`);
    });
}