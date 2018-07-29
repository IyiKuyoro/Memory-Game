// Save all elements that will be interacted with
const playButton = document.querySelector('.play-button');
const welcomeScreen = document.querySelector('#welcome-screen');
const congratsScreen = document.querySelector('#congrats-screen');
const gameScreen = document.querySelector('#game-screen');
const gameBoard = document.querySelector('#game-board');
const cards = document.getElementsByClassName('card');
const mins = document.querySelector('#mins');
const secs = document.querySelector('#secs');
const movesDisplay = document.querySelector('#moves');

// load pictures to improve speed
const pictures = [
  './img/1.png',
  './img/2.png',
  './img/3.png',
  './img/4.png',
  './img/5.png',
  './img/6.png',
  './img/7.png',
  './img/8.png',
  './img/9.png',
  './img/10.png',
  './img/11.png',
  './img/12.png'
];

pictures.forEach(element => {
  const img = new Image();
  img.src = element;
});

// Other global variables to be used
let playing = false;
let stars = 3;
let matchCards = [];
let images = [];
let used = [];
let startTime = '';
let moves = 0;
let gameTimerInterval = {};

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
  gameTimerInterval = setInterval(gameTimer, 1000);
  startTime = new Date();
};

const flipBack = () => {
  // Run turning card back animation
  matchCards[0].classList.remove('shake');
  matchCards[1].classList.remove('shake');
  matchCards[0].classList.add('flip-back');
  matchCards[1].classList.add('flip-back');
  matchCards[0].classList.remove('flipped');
  matchCards[1].classList.remove('flipped');
};

const coverCard = () => {
  // remove image, change background back and clear matchCards
  matchCards[0].innerHTML = '';
  matchCards[1].innerHTML = '';
  matchCards[0].style = 'background: #015a70;';
  matchCards[1].style = 'background: #015a70;';
  
  matchCards = [];
};

const wrong = () => {
  setTimeout(flipBack, 500);
  setTimeout(coverCard, 750);

  // Run wrong animation
  matchCards[0].classList.remove('flip');
  matchCards[1].classList.remove('flip');
  matchCards[0].classList.add('shake');
  matchCards[1].classList.add('shake');
  matchCards[0].style = 'background-color: rgb(237, 96, 142);';
  matchCards[1].style = 'background-color: rgb(237, 96, 142);';
};

const startGame = () => {
  selectImages();
  welcomeScreen.remove();
  congratsScreen.classList.add('invisible');
  gameScreen.classList.remove('invisible');
  assignCardEvets();
};

const endGame = () => {
  mins.innerText = '0';
  secs.innerText = '00';

  gameScreen.classList.add('invisible');
  document.querySelector('#congrats-moves').innerText = moves;
  
  for (let i = 0; i < stars; i += 1) {
    // Add the number of stars to the congrats screen
    '<img class="star" src="./img/star.png" alt="star">'
    const star = document.createElement('img');
    star.classList.add('star');
    star.setAttribute('src', './img/star.png');
    document.querySelector('#congrats-stars').appendChild(star);
  }

  document.querySelector('#congrats-screen').classList.remove('invisible');
};

const checkWin = () => {
  const flippedCards = document.getElementsByClassName('flipped');

  if (flippedCards.length === 16) {
    clearInterval(gameTimerInterval);
    endGame();
  }
};

const correct = () => {
  // Run correct animation
  matchCards[0].classList.remove('flip');
  matchCards[1].classList.remove('flip');
  matchCards[0].classList.add('bounce');
  matchCards[1].classList.add('bounce');
};

const checkMatch = () => {
  // Check if the two selected cards match
  const firstImage = matchCards[0].firstChild.getAttribute('src');
  const secondImage = matchCards[1].firstChild.getAttribute('src');

  if (firstImage === secondImage) {
    correct();
    matchCards = [];
    checkWin();
  } else {
    wrong();
  }
};

const reduceStarts = () => {
  document.querySelector('.star').remove();
  stars -= 1;
};

const clickCard = (event) => {
  if (matchCards.length >= 2) {
    // Prevent user from fliping further cards in a hurry
    return undefined;
  }

  if (!playing) {
    // Start the game timer
    startTimer();
    playing = true;
  }

  event.currentTarget.classList.remove('flip-back');  // Remove the flip-back animation class
  event.currentTarget.classList.add('flip');  // Add animation to flip the card

  const flip = () => {
    // Insert image and change background color when animation is half complete
    let curTime = new Date();
    ticks = curTime - startTime;

    if (ticks >= 250) {
      if (!event.target.classList.contains('flipped') && event.target.classList.contains('card')) {
        // If card has not been flipped,
        // add image and style at quarter of a second (half way of the flip)
        event.target.innerHTML = `<img src="${images[event.target.getAttribute("id")]}" class="card-images">`;
        event.target.style = 'background-color: #00bceb;';
        event.target.classList.add('flipped');
        movesDisplay.innerText = ++moves; // Increase and display no of moves made

        // Reduce starts depending on number of moves made
        if (moves === 20) {
          reduceStarts();
        } else if (moves === 35) {
          reduceStarts();
        }

        // Add card to array that holds cards to compair
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

playButton.addEventListener('click', startGame);
