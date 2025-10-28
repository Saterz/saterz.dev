console.log("Pk t'es dans la console ?")
console.log("Tqt pas, y'a pas d'erreur")

// Floating ball and ring animation

// Get the DOM elements
const floatingBall = document.querySelector('.floating.ball')
const floatingRing = document.querySelector('.floating.ring')

// Position variables for the ball
let targetBallX = 0,
  targetBallY = 0
let currentBallX = 0,
  currentBallY = 0

// Position variables for the ring
let targetRingX = 0,
  targetRingY = 0
let currentRingX = 0,
  currentRingY = 0

// Update target positions on mouse movement
document.addEventListener('mousemove', (event) => {
  // Show the ball and ring
  floatingBall.style.opacity = '1'
  floatingRing.style.opacity = '1'
  // Get dimensions of the ball and ring
  const ballRect = floatingBall.getBoundingClientRect()
  const ringRect = floatingRing.getBoundingClientRect()

  // Adjust the target so that the center of the ball and ring follow the cursor
  targetBallX = event.clientX
  targetBallY = event.clientY

  targetRingX = event.clientX
  targetRingY = event.clientY
})

// Animate the elements toward their target positions using easing
function animate() {
  // Easing factors: smaller values result in smoother/slower movement
  const ballEase = 0.5 // Ball follows faster
  const ringEase = 0.1 // Ring follows with a slight delay

  // Update the ball's current position
  currentBallX += (targetBallX - currentBallX) * ballEase
  currentBallY += (targetBallY - currentBallY) * ballEase
  floatingBall.style.left = currentBallX + 'px'
  floatingBall.style.top = currentBallY + 'px'

  // Update the ring's current position
  currentRingX += (targetRingX - currentRingX) * ringEase
  currentRingY += (targetRingY - currentRingY) * ringEase
  floatingRing.style.left = currentRingX + 'px'
  floatingRing.style.top = currentRingY + 'px'

  // Continue the animation loop
  requestAnimationFrame(animate)
}

// Start the animation loop
animate()

const nav = document.querySelector('nav')
const hero = document.getElementById('hero')
let scrollListenerAdded = false

function handleScreenWidth() {
  // Check if the screen width is at least 375px
  if (window.matchMedia('(min-width: 1012px)').matches) {
    if (!scrollListenerAdded) {
      window.addEventListener('scroll', onScroll)
      scrollListenerAdded = true
    }
  } else {
    if (scrollListenerAdded) {
      window.removeEventListener('scroll', onScroll)
      scrollListenerAdded = false
    }
  }
}

function onScroll() {
  let height = document.documentElement.scrollTop
  if (height > 42) {
    if (!nav.classList.contains('shrinked')) {
      hero.style.marginTop = '30vh'
      nav.classList.add('shrinked')
    }
  } else {
    hero.style.marginTop = '0vh'
    nav.classList.remove('shrinked')
  }
}

// Run the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', handleScreenWidth)

// Listen for window resize to adjust the scroll listener accordingly
window.addEventListener('resize', handleScreenWidth)

// Form conformity check + sending it to Google Sheets

// const form = document.querySelector('form');
// const name = document.getElementById('name');
// const email = document.getElementById('email');
// const message = document.getElementById('message');

// function storeForm(nameValue, emailValue, messageValue) {
//     fetch('https://sheetdb.io/api/v1/slqmz79npyucr', {
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer '
//         },
//         body: JSON.stringify({
//             data: [
//                 {
//                     'id': "INCREMENT",
//                     'Name': nameValue,
//                     'Email': emailValue,
//                     'Message': messageValue
//                 }
//             ]
//         })
//     })
//         .then((response) => response.json())
//         .then((data) => console.log(data));
// };

// form.addEventListener('submit', function (e) {
//     e.preventDefault();
//     const nameValue = name.value.trim();
//     const emailValue = email.value;
//     const messageValue = message.value;
//     let nameSuccess = emailSuccess = messageSuccess = false;

//     function checkName(nameValue) {
//         nameRegex = /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/;
//         return nameRegex.test(nameValue);
//     }

//     function checkEmail(emailValue) {
//         emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//         return emailRegex.test(emailValue);
//     }

//     if (nameValue === "") {
//         document.querySelector('.error.name').style.display = 'none';
//         nameSuccess = true;
//     } else if (nameValue.length < 2) {
//         document.querySelector('.error.name.less').style.display = 'block';
//     } else if (nameValue.length > 12) {
//         document.querySelector('.error.name.more').style.display = 'block';
//     } else if (!checkName(nameValue)) {
//         document.querySelector('.error.name.char').style.display = 'block';
//     } else {
//         document.querySelector('.error.name').style.display = 'none';
//         nameSuccess = true;
//     };

//     if (emailValue === "") {
//         document.querySelector('.error.email.nothing').style.display = 'block';
//     } else if (!checkEmail(emailValue)) {
//         document.querySelector('.error.email.char').style.display = 'block';
//     } else {
//         document.querySelector('.error.email').style.display = 'none';
//         emailSuccess = true;
//     };

//     if (messageValue === "") {
//         document.querySelector('.error.message.nothing').style.display = 'block';
//     } else if (messageValue.length > 500) {
//         document.querySelector('.error.message.more').style.display = 'block';
//     } else {
//         document.querySelector('.error.message').style.display = 'none';
//         messageSuccess = true;
//     }

//     if (nameSuccess === true && emailSuccess === true && messageSuccess === true) {
//         document.querySelector('.success').style.display = 'block';
//         setTimeout(function () {
//             document.querySelector('.success').style.display = 'none';
//         }, 5000);
//         nameSuccess = emailSuccess = messageSuccess = false;
//         storeForm(nameValue, emailValue, messageValue);
//     };
// });
