// console.log('connected');

// const themeSwitcher = document.querySelector('i');

// themeSwitcher.addEventListener('click', () => {
//     themeSwitcher.classList.toggle('fa-moon');
//     changeTheme();
// });

// function changeTheme() {
//     const body = document.querySelector('body');
//     const titles = document.querySelectorAll('.titles');
//     const nav = document.querySelector('nav');
//     const footer = document.querySelector('footer');
//     const cards = document.querySelectorAll('.card');
//     const allTextElements = document.querySelectorAll('body *');

//     if (themeSwitcher.classList.contains('fa-moon')) {
//         // Dark mode
//         body.style.backgroundColor = '#121212'; // dark background
//         titles.forEach(title => {
//             title.style.color = '#ffffff';
//         });
//         nav.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
//         nav.style.color = '#ffffff';
//         footer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
//         footer.style.color = '#ffffff';
//         cards.forEach(card => {
//             card.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
//             card.style.color = '#ffffff';
//         });
//         // Modify all text color to white
//         allTextElements.forEach(element => {
//             element.style.color = '#ffffff';
//         });
//     } else {
//         // Light mode
//         body.style.backgroundColor = 'white';
//         titles.forEach(title => {
//             title.style.color = 'black';
//         });
//         nav.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
//         nav.style.color = 'black';
//         footer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
//         footer.style.color = 'black';
//         cards.forEach(card => {
//             card.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
//             card.style.color = 'black';
//         });
//         // Modify all text color to black
//         allTextElements.forEach(element => {
//             element.style.color = 'black';
//         });
//     }
// }

const menuButton = document.getElementById('menu-button');
const menuIcon = document.querySelector('.fa-bars');
const menuContainer = document.querySelector('.menu-container');

menuButton.addEventListener('click', () => {
    if (menuContainer.style.opacity === '1') {
        menuContainer.style.opacity = '0';
        menuContainer.style.pointerEvents = 'none';
    }else{
        menuContainer.style.opacity = '1';
        menuContainer.style.pointerEvents = 'auto';
    }
    
    menuIcon.classList.toggle('fa-xmark');
});