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

window.addEventListener('scroll', function() {
    let suAnkiKaydirma = window.pageYOffset || document.documentElement.scrollTop;


    if (window.innerWidth > 767) {
        header.classList.remove('gizli');
        }

    // Sadece mobil cihazlarda çalışmasını istiyorsan (örn: 768px altı)
    if (window.innerWidth <= 768) {
        if (suAnkiKaydirma > sonKaydirma && suAnkiKaydirma > 100) {
            // Aşağı kaydırırken gizle
            header.classList.add('gizli');
        } else {
            // Yukarı kaydırırken veya en tepedeyken geri getir
            header.classList.remove('gizli');
        }
    }
            
    sonKaydirma = suAnkiKaydirma <= 0 ? 0 : suAnkiKaydirma;
}, false);

