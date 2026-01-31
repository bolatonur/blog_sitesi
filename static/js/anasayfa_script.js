 // tema değiştirme olayını diğer sayfalarla aynı yaptım bozulmasın diye
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
const tolerans = 180;

window.addEventListener('scroll', () => {
    let suAnkiKaydirma = window.pageYOffset || document.documentElement.scrollTop;
    
    if (Math.abs(suAnkiKaydirma - sonKaydirma) <= 5) return;

    if (window.innerWidth <= 768) {
        if (suAnkiKaydirma > sonKaydirma && suAnkiKaydirma > tolerans) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
    } else {
        header.style.transform = 'translateY(0)';
    }

    sonKaydirma = suAnkiKaydirma <= 0 ? 0 : suAnkiKaydirma;
}, { passive: true }); 

