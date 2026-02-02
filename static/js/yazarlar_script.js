
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const htmlElement = document.documentElement;


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
let oncekiKontrolYeri = 0;
let oncekiKontrolZamani = Date.now();

const header = document.querySelector('.header');

const hizLimiti = 1350; 

window.addEventListener('scroll', function() {
    let suAnkiKaydirma = window.pageYOffset || document.documentElement.scrollTop;
    let suAnkiZaman = Date.now();

    if (window.innerWidth <= 1300) {

        if (suAnkiKaydirma > sonKaydirma) {
            if (suAnkiKaydirma > 150) {
                header.classList.add('gizli');
            }

            oncekiKontrolYeri = suAnkiKaydirma;
            oncekiKontrolZamani = suAnkiZaman;
        } 
        
        else {
            if (suAnkiKaydirma <= 50) {
                 header.classList.remove('gizli');
            }
            else {
                let zamanFarki = suAnkiZaman - oncekiKontrolZamani;


                if (zamanFarki > 50) {
                    let mesafe = oncekiKontrolYeri - suAnkiKaydirma; 
                    let hiz = (mesafe / zamanFarki) * 1000; 

                    if (hiz > hizLimiti) {
                        header.classList.remove('gizli');
                    }

                    oncekiKontrolYeri = suAnkiKaydirma;
                    oncekiKontrolZamani = suAnkiZaman;
                }
            }
        }
    } else {
        header.classList.remove('gizli');
    }

    sonKaydirma = suAnkiKaydirma <= 0 ? 0 : suAnkiKaydirma;

}, false);