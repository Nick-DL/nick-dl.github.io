var $ = mdui.$;

$('#AddStar').on('click', function () {
    mdui.snackbar({
        message: '在电脑端可按 Ctrl(⌘) + D 收藏本站！',
        position: 'right-top'
    });
});

// 深浅色模式切换功能
(function () {
    const STORAGE_KEY = 'ndw-theme-mode';
    const body = document.body;

    // SVG 图标定义
    const moonSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><rect width="24" height="24" opacity="0"></rect><g><path d="M21.43 15.67Q21.26 15.48 21 15.4Q20.74 15.31 20.47 15.38Q19.37 15.7 18.25 15.71Q17.14 15.72 16.01 15.41Q13.8 14.78 12.25 13.07Q10.7 11.35 10.32 9.1Q10.06 7.56 10.37 6.06Q10.68 4.56 11.52 3.29Q11.66 3.07 11.66 2.8Q11.66 2.52 11.52 2.28Q11.35 2.06 11.1 1.97Q10.85 1.87 10.61 1.92Q7.97 2.42 5.96 4.14Q3.96 5.86 3.01 8.32Q2.06 10.78 2.47 13.46Q2.78 15.62 3.98 17.45Q5.18 19.27 7.01 20.47Q8.83 21.67 10.99 21.98Q13.08 22.32 15.11 21.79Q17.14 21.26 18.82 19.96Q20.5 18.65 21.55 16.68Q21.67 16.44 21.65 16.16Q21.62 15.89 21.43 15.67Z" fill="rgba(0,0,0,0.9019607843137255)"></path></g></svg>';
    const sunSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><rect width="24" height="24" opacity="0"></rect><g><path d="M12 6.5Q13.49 6.5 14.75 7.25Q16.01 7.99 16.75 9.25Q17.5 10.51 17.5 12Q17.5 13.49 16.75 14.75Q16.01 16.01 14.75 16.75Q13.49 17.5 12 17.5Q10.51 17.5 9.24 16.75Q7.97 16.01 7.24 14.75Q6.5 13.49 6.5 12Q6.5 10.51 7.24 9.25Q7.97 7.99 9.24 7.25Q10.51 6.5 12 6.5ZM12 4.99Q10.1 4.99 8.5 5.94Q6.89 6.89 5.94 8.5Q4.99 10.1 4.99 12Q4.99 13.9 5.94 15.5Q6.89 17.11 8.5 18.06Q10.1 19.01 12 19.01Q13.9 19.01 15.5 18.06Q17.11 17.11 18.06 15.5Q19.01 13.9 19.01 12Q19.01 10.1 18.06 8.5Q17.11 6.89 15.5 5.94Q13.9 4.99 12 4.99ZM12 4.01Q12.31 4.01 12.53 3.79Q12.74 3.58 12.74 3.29L12.74 2.21Q12.74 1.92 12.53 1.7Q12.31 1.49 12 1.49Q11.69 1.49 11.46 1.7Q11.23 1.92 11.23 2.21L11.23 3.29Q11.23 3.58 11.46 3.79Q11.69 4.01 12 4.01ZM6.34 6.36Q6.55 6.12 6.56 5.82Q6.58 5.52 6.36 5.33L5.59 4.56Q5.4 4.34 5.1 4.36Q4.8 4.37 4.58 4.58Q4.34 4.8 4.34 5.1Q4.34 5.4 4.54 5.62L5.3 6.38Q5.5 6.58 5.81 6.58Q6.12 6.58 6.34 6.36ZM4.01 12Q4.01 11.69 3.79 11.47Q3.58 11.26 3.29 11.26L2.21 11.26Q1.92 11.26 1.72 11.47Q1.51 11.69 1.51 12Q1.51 12.31 1.72 12.54Q1.92 12.77 2.21 12.77L3.29 12.77Q3.58 12.77 3.79 12.54Q4.01 12.31 4.01 12ZM6.34 17.66Q6.12 17.45 5.82 17.44Q5.52 17.42 5.33 17.64L4.56 18.38Q4.34 18.6 4.36 18.9Q4.37 19.2 4.58 19.42Q4.8 19.63 5.11 19.64Q5.42 19.66 5.62 19.44L6.38 18.7Q6.58 18.48 6.58 18.18Q6.58 17.88 6.34 17.66ZM12 19.99Q11.69 19.99 11.47 20.21Q11.26 20.42 11.26 20.71L11.26 21.79Q11.26 22.08 11.47 22.28Q11.69 22.49 12 22.49Q12.31 22.49 12.54 22.28Q12.77 22.08 12.77 21.79L12.77 20.71Q12.77 20.42 12.54 20.21Q12.31 19.99 12 19.99ZM17.66 17.64Q17.45 17.86 17.44 18.17Q17.42 18.48 17.62 18.67L18.38 19.44Q18.6 19.66 18.9 19.64Q19.2 19.63 19.42 19.42Q19.63 19.2 19.64 18.89Q19.66 18.58 19.44 18.38L18.7 17.62Q18.48 17.4 18.18 17.41Q17.88 17.42 17.66 17.64ZM19.99 12Q19.99 12.31 20.21 12.53Q20.42 12.74 20.71 12.74L21.79 12.74Q22.08 12.74 22.3 12.53Q22.51 12.31 22.51 12Q22.51 11.69 22.3 11.46Q22.08 11.23 21.79 11.23L20.71 11.23Q20.42 11.23 20.21 11.46Q19.99 11.69 19.99 12ZM17.64 6.34Q17.88 6.55 18.18 6.56Q18.48 6.58 18.67 6.36L19.44 5.62Q19.63 5.4 19.63 5.1Q19.63 4.8 19.42 4.58Q19.2 4.37 18.89 4.36Q18.58 4.34 18.36 4.56L17.62 5.3Q17.42 5.52 17.42 5.82Q17.42 6.12 17.64 6.34Z" fill="rgba(0,0,0,0.9019607843137255)"></path></g></svg>';

    // 获取系统主题偏好
    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // 获取当前实际主题
    function getCurrentTheme() {
        if (body.classList.contains('mdui-theme-layout-dark')) return 'dark';
        if (body.classList.contains('mdui-theme-layout-light')) return 'light';
        return getSystemTheme();
    }

    // 更新图标
    function updateIcons(theme) {
        const iconMobile = document.getElementById('themeIconMobile');
        const iconDesktop = document.getElementById('themeIconDesktop');
        // 浅色模式显示太阳,深色模式显示月亮
        const icon = theme === 'dark' ? moonSvg : sunSvg;
        if (iconMobile) iconMobile.innerHTML = icon;
        if (iconDesktop) iconDesktop.innerHTML = icon;
    }

    // 应用主题
    function applyTheme(mode) {
        body.classList.remove('mdui-theme-layout-auto', 'mdui-theme-layout-dark', 'mdui-theme-layout-light');

        if (mode === 'auto') {
            body.classList.add('mdui-theme-layout-auto');
            updateIcons(getSystemTheme());
        } else {
            body.classList.add(mode === 'dark' ? 'mdui-theme-layout-dark' : 'mdui-theme-layout-light');
            updateIcons(mode);
        }
    }

    // 切换主题
    function toggleTheme() {
        const savedMode = localStorage.getItem(STORAGE_KEY);
        const systemTheme = getSystemTheme();
        const currentTheme = getCurrentTheme();

        let newMode;

        if (savedMode === 'auto' || !savedMode) {
            // 当前跟随系统,切换到相反模式
            newMode = currentTheme === 'dark' ? 'light' : 'dark';
        } else {
            // 当前是自定义模式,切换到另一个
            const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
            // 如果切换后与系统一致,回到auto
            newMode = targetTheme === systemTheme ? 'auto' : targetTheme;
        }

        localStorage.setItem(STORAGE_KEY, newMode);
        applyTheme(newMode);
    }

    // 初始化
    function init() {
        const savedMode = localStorage.getItem(STORAGE_KEY) || 'auto';
        applyTheme(savedMode);

        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
            const currentMode = localStorage.getItem(STORAGE_KEY);
            if (currentMode === 'auto' || !currentMode) {
                // 强制重新应用auto模式，触发CSS响应
                body.classList.remove('mdui-theme-layout-auto');
                // 使用requestAnimationFrame确保DOM更新
                requestAnimationFrame(() => {
                    body.classList.add('mdui-theme-layout-auto');
                    updateIcons(getSystemTheme());
                });
            }
        });

        // 绑定按钮事件
        const btnMobile = document.getElementById('themeToggleMobile');
        const btnDesktop = document.getElementById('themeToggleDesktop');
        if (btnMobile) btnMobile.addEventListener('click', toggleTheme);
        if (btnDesktop) btnDesktop.addEventListener('click', toggleTheme);
    }

    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// 切换抽屉打开/关闭时的导航图标
document.addEventListener('DOMContentLoaded', function () {
    const drawerElement = document.getElementById('left-drawer');
    const desktopNavIcon = document.querySelector('.mdui-toolbar .mdui-btn-icon[mdui-drawer] .mdui-icon svg');

    // 定义两种图标的 SVG 内容
    const openIcon = `<defs>
              <path
                d="M21.6 12.17Q21.86 11.98 21.86 11.66Q21.86 11.35 21.6 11.16L18.58 8.86Q18.38 8.71 18.14 8.74Q17.9 8.76 17.74 8.93Q17.57 9.1 17.57 9.36L17.57 13.97Q17.57 14.23 17.74 14.4Q17.9 14.57 18.14 14.59Q18.38 14.62 18.58 14.47L21.6 12.17Z"
                id="_path-6"></path>
              <path
                d="M21.24 6.02Q21.55 6.02 21.77 5.81Q21.98 5.59 21.98 5.28Q21.98 4.97 21.77 4.75Q21.55 4.54 21.24 4.54L2.76 4.54Q2.45 4.54 2.23 4.75Q2.02 4.97 2.02 5.28Q2.02 5.59 2.23 5.81Q2.45 6.02 2.76 6.02L21.24 6.02ZM14.26 12.72Q14.57 12.72 14.78 12.49Q15 12.26 15 11.95Q15 11.64 14.78 11.42Q14.57 11.21 14.26 11.21L2.76 11.21Q2.45 11.21 2.23 11.42Q2.02 11.64 2.02 11.95Q2.02 12.26 2.23 12.49Q2.45 12.72 2.76 12.72L14.26 12.72ZM21.24 19.46Q21.55 19.46 21.77 19.25Q21.98 19.03 21.98 18.72Q21.98 18.41 21.77 18.18Q21.55 17.95 21.24 17.95L2.76 17.95Q2.45 17.95 2.23 18.18Q2.02 18.41 2.02 18.72Q2.02 19.03 2.23 19.25Q2.45 19.46 2.76 19.46L21.24 19.46Z"
                id="_path-7"></path>
            </defs>
            <g id="_Public/ic_public_more" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <use fill="#000000" xlink:href="#_path-6"></use>
                <use fill="#000000" xlink:href="#_path-7"></use>
            </g>`;

    const closeIcon = `<defs>
              <path
                d="M20.86 14.47Q21.05 14.62 21.29 14.59Q21.53 14.57 21.68 14.4Q21.84 14.23 21.84 13.97L21.84 9.36Q21.84 9.1 21.68 8.93Q21.53 8.76 21.29 8.74Q21.05 8.71 20.86 8.86L17.81 11.16Q17.57 11.35 17.57 11.66Q17.57 11.98 17.81 12.17L20.86 14.47Z"
                id="_path-8"></path>
              <path
                d="M21.24 6.02Q21.55 6.02 21.77 5.81Q21.98 5.59 21.98 5.28Q21.98 4.97 21.77 4.75Q21.55 4.54 21.24 4.54L2.76 4.54Q2.45 4.54 2.23 4.75Q2.02 4.97 2.02 5.28Q2.02 5.59 2.23 5.81Q2.45 6.02 2.76 6.02L21.24 6.02ZM14.26 12.72Q14.57 12.72 14.78 12.49Q15 12.26 15 11.95Q15 11.64 14.78 11.42Q14.57 11.21 14.26 11.21L2.76 11.21Q2.45 11.21 2.23 11.42Q2.02 11.64 2.02 11.95Q2.02 12.26 2.23 12.49Q2.45 12.72 2.76 12.72L14.26 12.72ZM21.24 19.46Q21.55 19.46 21.77 19.25Q21.98 19.03 21.98 18.72Q21.98 18.41 21.77 18.18Q21.55 17.95 21.24 17.95L2.76 17.95Q2.45 17.95 2.23 18.18Q2.02 18.41 2.02 18.72Q2.02 19.03 2.23 19.25Q2.45 19.46 2.76 19.46L21.24 19.46Z"
                id="_path-9"></path>
            </defs>
            <g id="_Public/ic_public_more" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <use fill="#000000" xlink:href="#_path-8"></use>
                <use fill="#000000" xlink:href="#_path-9"></use>
            </g>`;

    if (drawerElement && desktopNavIcon) {
        // 设置初始图标：页面宽度 >=1024px 时默认显示关闭图标
        const isWideScreen = window.innerWidth >= 1024;
        desktopNavIcon.innerHTML = isWideScreen ? closeIcon : openIcon;

        // 使用 MutationObserver 监听抽屉的 class 变化
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === 'class') {
                    const isOpen = drawerElement.classList.contains('mdui-drawer-open');
                    desktopNavIcon.innerHTML = isOpen ? closeIcon : openIcon;
                }
            });
        });

        observer.observe(drawerElement, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
});

// 标题栏模糊效果 - 从 localStorage 读取并应用
(function () {
    const BLUR_STORAGE_KEY = 'ndw-toolbar-blur';
    
    function applyBlurEffect() {
        const savedBlur = localStorage.getItem(BLUR_STORAGE_KEY) || '20';
        const toolbars = document.querySelectorAll('.glur-toolbar');
        
        toolbars.forEach(toolbar => {
            toolbar.style.backdropFilter = `blur(${savedBlur}px)`;
        });
    }
    
    // DOM加载完成后应用模糊效果
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyBlurEffect);
    } else {
        applyBlurEffect();
    }
})();