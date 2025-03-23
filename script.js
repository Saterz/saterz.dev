console.log('Pk t\'es sur la console ?');

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


// Menu button
const menuButton = document.querySelector('.button.menu');
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

// Floating ball and ring animation

// Get the DOM elements
const floatingBall = document.querySelector('.floating.ball');
const floatingRing = document.querySelector('.floating.ring');

// Position variables for the ball
let targetBallX = 0, targetBallY = 0;
let currentBallX = 0, currentBallY = 0;

// Position variables for the ring
let targetRingX = 0, targetRingY = 0;
let currentRingX = 0, currentRingY = 0;

// Update target positions on mouse movement
document.addEventListener('mousemove', (event) => {
    // Show the ball and ring
    floatingBall.style.opacity = "1"
    floatingRing.style.opacity = "1"
    // Get dimensions of the ball and ring
    const ballRect = floatingBall.getBoundingClientRect();
    const ringRect = floatingRing.getBoundingClientRect();
  
    // Adjust the target so that the center of the ball and ring follow the cursor
    targetBallX = event.clientX - ballRect.width / 2;
    targetBallY = event.clientY - ballRect.height / 2;
  
    targetRingX = event.clientX - ringRect.width / 2;
    targetRingY = event.clientY - ringRect.height / 2;
});

document.addEventListener('click', function(){
    floatingBall.style.padding = '2rem'
});

// Animate the elements toward their target positions using easing
function animate() {
    // Easing factors: smaller values result in smoother/slower movement
    const ballEase = 0.5; // Ball follows faster
    const ringEase = 0.1; // Ring follows with a slight delay

    // Update the ball's current position
    currentBallX += (targetBallX - currentBallX) * ballEase;
    currentBallY += (targetBallY - currentBallY) * ballEase;
    floatingBall.style.left = currentBallX + "px";
    floatingBall.style.top = currentBallY + "px";
  
    // Update the ring's current position
    currentRingX += (targetRingX - currentRingX) * ringEase;
    currentRingY += (targetRingY - currentRingY) * ringEase;
    floatingRing.style.left = currentRingX + "px";
    floatingRing.style.top = currentRingY + "px";
  
    // Continue the animation loop
    requestAnimationFrame(animate);
}

// Start the animation loop
animate();