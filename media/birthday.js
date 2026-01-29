const birthday = new Date('2026-02-08T00:00:00+08:00');
const birthDate = new Date('2008-02-08T00:00:00+08:00');

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const ageDisplayEl = document.getElementById('ageDisplay');
const birthdayMessageEl = document.getElementById('birthdayMessage');
const animationAreaEl = document.getElementById('animationArea');
const replayButtonEl = document.getElementById('replayButton');
const birthdayCardEl = document.getElementById('birthdayCard');

let isBirthday = false;
let animationPlayed = false;
let countdownInterval;
let ageUpdateTimer;

function init() {
    const now = new Date();

    // 检查是否已经是生日或生日之后
    if (now >= birthday) {
        isBirthday = true;

        // 检查是否已经播放过动画（使用localStorage记录）
        const animationPlayedStorage = localStorage.getItem('nickDLBirthdayAnimationPlayed');
        if (animationPlayedStorage === 'true' && now > birthday) {
            // 生日已过，动画已播放，显示祝福语
            showBirthdayMessage();
            replayButtonEl.style.display = 'block';
        } else {
            // 生日时刻或生日当天第一次访问，播放动画
            playBirthdayAnimation();
            localStorage.setItem('nickDLBirthdayAnimationPlayed', 'true');
        }
    } else {
        startCountdown();
        updateAge();
    }
}

function startCountdown() {
    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        const now = new Date();

        const diff = birthday.getTime() - now.getTime();

        if (diff <= 0) {
            clearInterval(countdownInterval);
            isBirthday = true;
            playBirthdayAnimation();
            localStorage.setItem('nickDLBirthdayAnimationPlayed', 'true');
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = days.toString().padStart(2, '0');
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');

        updateAge();
    }, 100);
}

function updateAge() {
    const now = new Date();

    const ageInMilliseconds = now.getTime() - birthDate.getTime();
    const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

    ageDisplayEl.textContent = `当前年龄: ${ageInYears.toFixed(8)} 岁`;
}

function playBirthdayAnimation() {
    animationPlayed = true;

    document.getElementById('countdownContainer').style.display = 'none';

    clearInterval(countdownInterval);

    if (ageUpdateTimer) {
        clearInterval(ageUpdateTimer);
    }
    ageUpdateTimer = setInterval(updateAge, 100);

    birthdayMessageEl.innerHTML = `
                        <span style="color:#ff4081; font-size:1.8rem;">🎂 生日快乐，Nick_DL！ 🎉</span>
                    `;

    const birthdayText = document.createElement('div');
    birthdayText.className = 'birthday-animation';
    birthdayText.textContent = 'HAPPY 18th BIRTHDAY!';
    birthdayText.style.opacity = '0';
    animationAreaEl.appendChild(birthdayText);

    setTimeout(() => {
        birthdayText.style.transition = 'all 1.5s ease';
        birthdayText.style.opacity = '1';
        birthdayText.style.transform = 'translate(-50%, -50%) scale(1.1)';
    }, 500);

    createConfetti();

    createBalloons();

    setTimeout(() => {
        birthdayText.style.transition = 'all 1s ease';
        birthdayText.style.opacity = '0';
        birthdayText.style.transform = 'translate(-50%, -50%) scale(0.5)';

        setTimeout(() => {
            replayButtonEl.style.display = 'block';
        }, 1000);
    }, 10000);
}

function showBirthdayMessage() {
    document.getElementById('countdownContainer').style.display = 'none';

    if (ageUpdateTimer) {
        clearInterval(ageUpdateTimer);
    }
    ageUpdateTimer = setInterval(updateAge, 100);
    birthdayMessageEl.innerHTML = `
                        <span style="color:#ff4081; font-size:1.8rem;">🎂 生日快乐，Nick_DL！ 🎉</span>
                    `;

    replayButtonEl.style.display = 'block';
}

function createConfetti() {
    const colors = ['#ff4081', '#7c4dff', '#18ffff', '#ffeb3b', '#4caf50', '#ff9800'];

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 8 + 4;
        const left = Math.random() * 100;
        const animationDelay = Math.random() * 5;
        const animationDuration = Math.random() * 3 + 3;

        confetti.style.backgroundColor = color;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.left = `${left}%`;
        confetti.style.animationDelay = `${animationDelay}s`;
        confetti.style.animationDuration = `${animationDuration}s`;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';

        animationAreaEl.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, (animationDelay + animationDuration) * 1000);
    }
}

function createBalloons() {
    const colors = ['#ff4081', '#7c4dff', '#18ffff', '#ffeb3b', '#4caf50'];

    for (let i = 0; i < 20; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';

        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const animationDelay = Math.random() * 5;
        const animationDuration = Math.random() * 5 + 5;

        balloon.style.backgroundColor = color;
        balloon.style.left = `${left}%`;
        balloon.style.animationDelay = `${animationDelay}s`;
        balloon.style.animationDuration = `${animationDuration}s`;

        animationAreaEl.appendChild(balloon);

        setTimeout(() => {
            balloon.remove();
        }, (animationDelay + animationDuration) * 1000);
    }
}

function replayAnimation() {
    while (animationAreaEl.firstChild) {
        animationAreaEl.firstChild.remove();
    }

    replayButtonEl.style.display = 'none';

    playBirthdayAnimation();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 重播按钮点击事件
replayButtonEl.addEventListener('click', replayAnimation);