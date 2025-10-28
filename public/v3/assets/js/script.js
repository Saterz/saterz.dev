console.log('Pk t\'es dans la console ?');
console.log('Tqt pas, y\'a pas d\'erreur');

$(document).ready(function() {
    $('.image-link').magnificPopup({type:'image'});
});

// Menu button
const menuButton = document.querySelector('.button.menu');
const menuIcon = document.querySelector('.fa-bars');
const menuContainer = document.querySelector('.menu-container');

menuButton.addEventListener('click', () => {
    menuIcon.classList.toggle('fa-xmark');
    menuContainer.classList.toggle('deploy')
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
    targetBallX = event.clientX;
    targetBallY = event.clientY;

    targetRingX = event.clientX;
    targetRingY = event.clientY;
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

// Image popup

$('.image-expandable').magnificPopup({
    items: {
      src: 'https://beeneverywhere.net/staticmap/14542.png'
    },
    type: 'image' // this is default type
});