// Save all elements that will be interacted with
const playButton = document.querySelector('#play-button');
const welcomeScreen = document.querySelector('#welcome-screen');
const gameScreen = document.querySelector('#game-screen');
const gameBoard = document.querySelector('#game-board');
const cards = document.getElementsByClassName('card');
const mins = document.querySelector('#mins');
const secs = document.querySelector('#secs');
const movesDisplay = document.querySelector('#moves');

// Other global variables to be used
let matchCards = [];
const images = [];
const used = [];
let startTime = '';
let moves = 0;

const selectImages = () => {
  // Select 8 images to be used in game
  // Randomly save each image in two differenct slots
  for (let i = 0; i < 8; i += 1) {
    let num1 = 0;
    let num2 = 0;
    let imgID = 0;

    do { // Loop until find a unique random number
      num1 = Math.floor(Math.random() * 16);
      num2 = Math.floor(Math.random() * 16);
      imgID = Math.ceil(Math.random() * 12);
    } while (num1 === num2 || images[num1] || images[num2] || used[imgID])

    used[imgID] = 'true';
    images[num1] = `./img/${imgID}.png`;
    images[num2] = `./img/${imgID}.png`;
  }
};

const gameTimer = () => {
  // alculate the mount of seconds spent in game
  curTime = new Date();
  let elapsedTime = curTime - startTime;
  elapsedTime = Math.round(elapsedTime /= 1000);

  // Attach the time spent in game to DOM
  mins.innerText = Math.floor(elapsedTime / 60);
  secs.innerText = (elapsedTime % 60) < 10 ? `0${elapsedTime % 60}` : elapsedTime % 60;
};

const startTimer = () => {
  // Initialize game timer
  setInterval(gameTimer, 1000);
  startTime = new Date();
};

const flipCardsBack = () => {
  matchCards[0].classList.remove('flip');
  matchCards[1].classList.remove('flip');
  matchCards[0].classList.add('shake');
  matchCards[1].classList.add('shake');
};

const checkMatch = () => {
  if (matchCards[0] === matchCards[1]) {
    console.log('good');
  } else {
    flipCardsBack();
    matchCards = [];
  }
};

const clickCard = (event) => {
  event.currentTarget.classList.add('flip');  // Add animation to flip the card

  const flip = () => {
    // Insert image and change background color when animation is half complete
    let curTime = new Date();
    ticks = curTime - startTime;

    if (ticks >= 250) { // Add image and style at quarter of a second
      if (!event.target.classList.contains('flipped') && event.target.classList.contains('card')) {
        event.target.innerHTML = `<img src="${images[event.target.getAttribute("id")]}" class="card-images">`;
        event.target.style = 'background-color: #00bceb;';
        event.target.classList.add('flipped');
        movesDisplay.innerText = ++moves; // Increase and display no of moves made

        // Reduce starts depending on no of moves
        if (moves === 8) {
          document.querySelector('.star').remove();
        } else if (moves === 10) {
          document.querySelector('.star').remove();
        }

        matchCards.push(event.target);
        if (matchCards.length === 2) {
          checkMatch();
        }
      }
      clearInterval(interval);
    }
  }

  const interval = setInterval(flip, 10);
  let startTime = new Date();
};

const assignCardEvets = () => {
  // Hookup an event listener to the cards
  for (let i = 0; i < cards.length; i += 1) {
    cards[i].addEventListener('click', clickCard);
  }
};

playButton.addEventListener('click', () => {
  selectImages();
  welcomeScreen.classList.add('invisible');
  gameScreen.classList.remove('invisible');
  startTimer();
  assignCardEvets();
});
