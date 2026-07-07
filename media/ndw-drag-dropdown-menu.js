//真正的“下拉菜单”——拖拽操作逻辑
(function () {
    const DRAG_THRESHOLD = 6;

    // 遍历所有 mdui-menu
    document.querySelectorAll('[mdui-menu]').forEach(trigger => {
        const attr = trigger.getAttribute('mdui-menu');
        if (!attr) return;
        const match = attr.match(/target:\s*['"]?([^'"}\s]+)/);
        if (!match || !match[1]) return;

        const menu = document.querySelector(match[1]);
        if (!menu) return;

        // 移动端：禁止浏览器默认手势
        trigger.style.touchAction = 'none';

        let startX = 0, startY = 0;
        let isDragging = false;
        let draggedItem = null;
        let menuOpenedByDrag = false;
        let menuAnimating = false; // 菜单展开动画过程中去涟漪
        let cascadeOpenTimer = null;  // 级联父级悬停计时器
        let submenuOpened = false;

        function getPos(e) {
            if (e.touches && e.touches.length) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
            if (e.changedTouches && e.changedTouches.length) {
                return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
            }
            return { x: e.clientX, y: e.clientY };
        }

        function distance(p1, p2) {
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            return Math.sqrt(dx * dx + dy * dy);
        }

        function getMenuItemAt(x, y) {
            if (!menu.classList.contains('mdui-menu-open')) return null;
            const el = document.elementFromPoint(x, y);
            if (!el) return null;
            var item = el.closest('.mdui-menu-item');
            if (!item) return null;
            // 排除子菜单 <ul> 空白区
            var itemMenu = item.closest('.mdui-menu');
            if (itemMenu === menu) {
                var elMenu = el.closest('.mdui-menu');
                if (elMenu && elMenu !== menu) return null;
            }
            return item;
        }

        /* 涟漪加速淡出 */
        function startWaveFadeOut(wave) {
            if (!wave || !wave.parentNode) return;
            if (wave.dataset.waveFading === 'true') return;
            wave.dataset.waveFading = 'true';

            wave.style.transition = '';
            wave.style.opacity = '';

            // 300ms 加速扩散
            const currentTransform = wave.dataset.translate || 'translate3d(0,0,0) scale(1)';
            const targetTransform = currentTransform.replace('scale(1)', 'scale(1.01)');

            wave.classList.add('mdui-ripple-wave-fill');
            wave.style.transform = targetTransform;

            // 600ms 淡出
            setTimeout(() => {
                if (!wave.parentNode) return;
                wave.classList.add('mdui-ripple-wave-out');
                wave.style.transform = targetTransform;

                // 结束后移除
                setTimeout(() => {
                    if (wave.parentNode) wave.remove();
                }, 700);
            }, 300);
        }

        /* 在目标元素上创建涟漪波纹 */
        function createWave(target, clientX, clientY) {
            var rect = target.getBoundingClientRect();
            var x = clientX - rect.left;
            var y = clientY - rect.top;
            var size = Math.max(Math.sqrt(rect.width ** 2 + rect.height ** 2), 48);
            var translate = "translate3d(" + (-x + rect.width / 2) + "px," + (-y + rect.height / 2) + "px, 0) scale(1)";

            var wave = document.createElement('div');
            wave.className = 'mdui-ripple-wave';
            wave.style.width = size + 'px';
            wave.style.height = size + 'px';
            wave.style.left = x + 'px';
            wave.style.top = y + 'px';
            wave.style.marginTop = -(size / 2) + 'px';
            wave.style.marginLeft = -(size / 2) + 'px';
            wave.dataset.translate = translate;
            target.appendChild(wave);
            wave.offsetHeight;
            wave.style.transform = translate;
        }

        /* 计算涟漪效果 */
        function triggerRipple(item, clientX, clientY) {
            var isCascadeParent = item.querySelector('.mdui-menu-item-more');

            if (isCascadeParent) {
                // 级联父级：涟漪注入 <a> 子元素
                var anchor = item.querySelector('a.mdui-ripple');
                if (!anchor) return;
                createWave(anchor, clientX, clientY);
                return;
            }

            // 普通菜单项：涟漪注入 <li> 自身
            var oldWaves = item.querySelectorAll('.mdui-ripple-wave');
            for (var wi = 0; wi < oldWaves.length; wi++) { startWaveFadeOut(oldWaves[wi]); }

            if (!item.classList.contains('mdui-ripple')) {
                item.classList.add('mdui-ripple');
            }
            item.style.overflow = 'hidden';
            createWave(item, clientX, clientY);
        }

        /* 拖拽高亮与涟漪 */
        function clearCascadeTimer() {
            if (cascadeOpenTimer) { clearTimeout(cascadeOpenTimer); cascadeOpenTimer = null; }
        }

        function clearHighlight() {
            clearCascadeTimer();
            if (draggedItem) {
                const item = draggedItem;
                draggedItem = null;
                item.style.background = '';
                const waves = item.querySelectorAll('.mdui-ripple-wave');
                waves.forEach(w => startWaveFadeOut(w));
                setTimeout(() => { item.style.overflow = ''; }, 1100);
            }
        }

        function highlightItem(item, clientX, clientY) {
            if (draggedItem === item) return;

            // 手指离开, 关闭子菜单
            var menuInst = mdui.$(trigger).data('_mdui_menu');
            if (menuInst) {
                var openSubs = menu.querySelectorAll('.mdui-menu.mdui-menu-open');
                for (var si = 0; si < openSubs.length; si++) {
                    var openSub = openSubs[si];
                    var subRect = openSub.getBoundingClientRect();
                    var inSub = clientX >= subRect.left && clientX <= subRect.right &&
                        clientY >= subRect.top && clientY <= subRect.bottom;
                    // 手指在级联父项上也视为"在子菜单区域内"
                    var cascadeParent = openSub.parentElement;
                    var pRect = cascadeParent ? cascadeParent.getBoundingClientRect() : null;
                    var inParent = pRect &&
                        clientX >= pRect.left && clientX <= pRect.right &&
                        clientY >= pRect.top && clientY <= pRect.bottom;
                    if (!inSub && !inParent) {
                        menuInst.closeSubMenu(mdui.$(openSub));
                        submenuOpened = false;
                        clearCascadeTimer();
                    }
                }
            }

            clearHighlight();
            if (!item) return;

            item.style.transition = 'background-color 300ms ease';
            if (item.getAttribute('disabled') === null) {
                item.style.background = 'rgba(0,0,0,0.06)';
            }
            draggedItem = item;

            // 级联父级涟漪注入 <a> 子元素
            var isCascadeParent = item.querySelector('.mdui-menu-item-more');
            if (!isCascadeParent) {
                var hasRipple = item.classList.contains('mdui-ripple') || item.querySelector('.mdui-ripple');
                if (!menuAnimating && hasRipple) {
                    triggerRipple(item, clientX, clientY);
                }
            } else if (!menuAnimating) {
                // 级联父级：只调 triggerRipple 让其走 <a> 分支
                triggerRipple(item, clientX, clientY);
                // 悬停计时：200ms 后自动展开子菜单（桌面端跳过）
                var sub = item.querySelector('.mdui-menu');
                if (!cascadeOpenTimer && !submenuOpened && (!sub || !sub.classList.contains('mdui-menu-open'))) {
                    cascadeOpenTimer = setTimeout(function () {
                        // 直接调用 MDUI API 展开子菜单
                        var menuInst = mdui.$(trigger).data('_mdui_menu');
                        if (menuInst && menuInst.openSubMenu && sub) {
                            menuInst.openSubMenu(mdui.$(sub));
                        }
                        submenuOpened = true;
                        cascadeOpenTimer = null;
                    }, 200);
                }
            }
        }

        /* 执行菜单项操作 */
        function executeMenuItem(item) {
            const anchor = item.closest('a') || item.querySelector('a');
            if (!anchor) return;

            if (anchor.getAttribute('href') && anchor.getAttribute('href') !== 'javascript:;') {
                window.location.href = anchor.href;
            } else if (typeof anchor.onclick === 'function') {
                anchor.onclick();
            } else {
                anchor.click();
            }
        }

        /* 事件绑定 */
        trigger.addEventListener('pointerdown', function (e) {
            e.preventDefault(); // 阻止移动端默认手势

            const pos = getPos(e);
            startX = pos.x;
            startY = pos.y;
            isDragging = false;
            menuOpenedByDrag = false;
            clearHighlight();

            document.addEventListener('pointermove', onPointerMove);
            document.addEventListener('pointerup', onPointerUp);
            document.addEventListener('pointercancel', onPointerUp);
        });

        function onPointerMove(e) {
            const pos = getPos(e);

            if (!isDragging) {
                if (distance({ x: startX, y: startY }, pos) >= DRAG_THRESHOLD) {
                    e.preventDefault(); // 阻止页面滚动
                    isDragging = true;

                    // 展开菜单时关闭 tooltip
                    var containers = [menu, trigger];
                    for (var ci = 0; ci < containers.length; ci++) {
                        var tips = containers[ci].querySelectorAll('[mdui-tooltip]');
                        for (var ti = 0; ti < tips.length; ti++) {
                            var tInst = mdui.$(tips[ti]).data('_mdui_tooltip');
                            if (tInst) { tInst.close(); }
                        }
                    }

                    if (!menu.classList.contains('mdui-menu-open')) {
                        menuOpenedByDrag = true;
                        menuAnimating = true;  // 即将展开，动画期间禁涟漪
                        trigger.click(); // MDUI 自动定位
                        setTimeout(function () { menuAnimating = false; }, 100);
                    } else {
                        menuOpenedByDrag = false;
                    }

                    const item = getMenuItemAt(pos.x, pos.y);
                    highlightItem(item, pos.x, pos.y);
                }
                return;
            }

            e.preventDefault();
            const item = getMenuItemAt(pos.x, pos.y);
            highlightItem(item, pos.x, pos.y);
        }

        function onPointerUp(e) {
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
            document.removeEventListener('pointercancel', onPointerUp);

            const pos = getPos(e);

            if (isDragging) {
                const item = getMenuItemAt(pos.x, pos.y);

                isDragging = false;
                menuOpenedByDrag = false;
                submenuOpened = false;
                clearHighlight();

                if (item) {
                    var isCascadeParent = item.querySelector('.mdui-menu-item-more');

                    if (isCascadeParent) {
                        var submenu = item.querySelector('.mdui-menu');
                        if (!submenu || !submenu.classList.contains('mdui-menu-open')) {
                            executeMenuItem(item);
                        }
                    } else {
                        executeMenuItem(item);
                    }

                    if (!isCascadeParent && menu.classList.contains('mdui-menu-open')) {
                        trigger.click();
                    }
                } else if (menu.classList.contains('mdui-menu-open')) {
                    trigger.click();
                }
            }
        }

        // 阻止拖拽期间菜单项的 click 事件
        menu.addEventListener('click', function (e) {
            if (isDragging) {
                e.stopPropagation();
                e.preventDefault();
            }
        }, true);

        menu.addEventListener('close.mdui.menu', function () {
            clearHighlight();
            isDragging = false;
            menuOpenedByDrag = false;
        });

        // 避免触发长按菜单操作
        trigger.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });

    }); // 结束遍历
})();
