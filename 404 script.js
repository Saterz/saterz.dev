// Easter Egg

const img404 = document.querySelector('img');
let counter = 0

img404.addEventListener('click', function () {
    counter++
    img404.style.transform = `rotate(${counter}deg)`;
    // if (counter >= 100) {
    //     img404.style.animation = ''
    // }
});

// Random text

const title = document.querySelector('h2');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const notFoundTexts = [
    "Are you lost, or just very curious?",
    "This wasn't in the script…",
    "This place is… off the map.",
    "You've triggered Protocol 404-X. Good job, I guess?",
    "System anomaly detected. Curious mind confirmed.",
    "You're in the hidden layer now. Don't stay too long.",
    "There's literally nothing here. And yet, you made it.",
    "This is definitely not the page you were looking for.",
    "We don't usually get visitors here. How cozy!",
    "You've reached the secret level.",
    "The runes have aligned. Welcome, Seeker.",
    "This page does not exist.",
    "The page you're looking for cannot be found.",
    "I didn't think anyone would actually find this.",
    "Seriously? You unlocked this? Now I have to write more text.",
    "There's no prize. Just disappointment. And this sentence.",
    "And for your efforts… absolutely nothing. You're welcome.",
    "404… but make it ✨extra.",
    "Oops. You've broken reality. Please reload existence.",
    "Some say the button leads nowhere. You proved them wrong.",
    "> Decompiling reality… complete.",
    "This is where the pixels come to party.",
    "This page has been waiting… for you.",
    "You're officially 'that user'.",
    "🎉 You did it! You found... absolutely nothing!",
    "You're in the in-between. Not quite here, not quite gone.",
    "This message is self-aware. Are you?",
    "What if this page is reading you?",
    "This isn't the whole message. Look deeper.",
    "What's hidden isn't always invisible.",
    "Does this page exist if no one sees it?",
    "You searched for something more. You found this."
];

const randNum = getRandomInt(0, notFoundTexts.length - 1);

function randNotFoundText(index) {
    title.innerText = notFoundTexts[index];
};

randNotFoundText(randNum);