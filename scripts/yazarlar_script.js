const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);
themeIcon.innerText = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeIcon.innerText = newTheme === 'dark' ? '☀️' : '🌙';
});

function switchAuthor(authorId, element) {
    document.querySelectorAll('.author-posts').forEach(post => {
        post.style.display = 'none';
    });
    document.getElementById(authorId + '-posts').style.display = 'block';
    document.querySelectorAll('.imgcircle').forEach(img => {
        img.classList.remove('active-author');
    });
    element.classList.add('active-author');
}

let sonKaydirma = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', function() {
    let suAnkiKaydirma = window.pageYOffset || document.documentElement.scrollTop;
    if (window.innerWidth <= 768) {
        if (suAnkiKaydirma > sonKaydirma && suAnkiKaydirma > 100) {
            header.classList.add('gizli');
        } else {
            header.classList.remove('gizli');
        }
    } else {
        header.classList.remove('gizli');
    }
    sonKaydirma = suAnkiKaydirma <= 0 ? 0 : suAnkiKaydirma;
}, false);