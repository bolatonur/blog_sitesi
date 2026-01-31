const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const htmlElement = document.documentElement;

// Flask linklerini JS değişkenlerine aktaralım
const sunIconPath = SUN_ICON;
const moonIconPath = MOON_ICON;

const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);

themeIcon.src = savedTheme === 'dark' ? sunIconPath : moonIconPath;

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeIcon.src = newTheme === 'dark' ? sunIconPath : moonIconPath;
});

let sonKaydirma = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', function() {
    let suAnkiKaydirma = window.pageYOffset || document.documentElement.scrollTop;

    if (window.innerWidth <= 1300) {
        if (suAnkiKaydirma > sonKaydirma && suAnkiKaydirma > 150) {
            header.classList.add('gizli');
        } 
        // Sayfa en tepeye (0'a) çok yakınsa veya yukarı kaydırıyorsa her zaman göster
        else if (suAnkiKaydirma < sonKaydirma || suAnkiKaydirma <= 50) {
            header.classList.remove('gizli');
        }
    } else {
        header.classList.remove('gizli');
    }

    sonKaydirma = suAnkiKaydirma <= 0 ? 0 : suAnkiKaydirma;
}, false);