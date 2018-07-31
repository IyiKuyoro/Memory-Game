// Save all elements that will be interacted with
const playButton = document.querySelector('.play-button');
const replay = document.querySelector('.replay');
const welcomeScreen = document.querySelector('#welcome-screen');
const congratsScreen = document.querySelector('#congrats-screen');
const gameScreen = document.querySelector('#game-screen');
const cards = document.querySelectorAll('.card');
const mins = document.querySelector('#mins');
const secs = document.querySelector('#secs');
const movesDisplay = document.querySelector('#moves');
const refresh = document.querySelector('#refresh');

// Other global variables to be used
let playing = false;
let stars = 3;
let matchCards = [];
let images = [];
let used = [];
let startTime = '';
let gameTime = '';
let moves = 0;
let gameTimerInterval = {};

/**
* @description Selects eight random images from the 12 to be used in the game
*/
const selectImages = () => {
  // Randomly save each image in two different slots
  for (let i = 0; i < 8; i += 1) {
    let num1 = 0;
    let num2 = 0;
    let imgID = 0;

    do { // Loop until find a unique random number
      num1 = Math.floor(Math.random() * 16);
      num2 = Math.floor(Math.random() * 16);
      imgID = Math.ceil(Math.random() * 12);
    } while (num1 === num2 || images[num1] || images[num2] || used[imgID]);

    used[imgID] = 'true';
    images[num1] = `./img/${imgID}.png`;
    images[num2] = `./img/${imgID}.png`;
  }
};

/**
* @description Calculates the game time and updates the DOM
*/
const gameTimer = () => {
  const curTime = new Date();
  let elapsedTime = curTime - startTime;
  elapsedTime = Math.round(elapsedTime /= 1000);

  // Attach the time spent in game to DOM
  mins.innerText = Math.floor(elapsedTime / 60);
  secs.innerText = (elapsedTime % 60) < 10 ? `0${elapsedTime % 60}` : elapsedTime % 60;
  gameTime = `${mins.innerText}:${secs.innerText}`;
};

/**
* @description Initialize game timer
*/
const startTimer = () => {
  // Initialize game timer
  gameTimerInterval = setInterval(gameTimer, 1000);
  startTime = new Date();
};

/**
* @description Stop the game timer
*/
const stopTimer = () => {
  clearInterval(gameTimerInterval);
};

/**
* @description Run animation to flip the cards over
*/
const flipBack = () => {
  matchCards[0].classList.remove('shake');
  matchCards[1].classList.remove('shake');
  matchCards[0].classList.add('flip-back');
  matchCards[1].classList.add('flip-back');
  matchCards[0].classList.remove('flipped');
  matchCards[1].classList.remove('flipped');
};

/**
* @description Remove the image element, change background and clear the match-cards array
*/
const coverCard = () => {
  matchCards[0].innerHTML = '';
  matchCards[1].innerHTML = '';
  matchCards[0].style = 'background: #015a70;';
  matchCards[1].style = 'background: #015a70;';

  matchCards = [];
};

/**
* @description Run the animation for a wrong match
*/
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

/**
* @description Initialize game timer
*/
const startGame = () => {
  selectImages();
  welcomeScreen.remove();
  congratsScreen.classList.add('invisible');
  gameScreen.classList.remove('invisible');
  assignCardsEvent();
};

/**
* @description Reset all global variables
*/
const resetVariables = () => {
  playing = false;
  stars = 3;
  matchCards = [];
  images = [];
  used = [];
  startTime = new Date();
  moves = 0;
  gameTimerInterval = {};
};

/**
* @description Reset the game information displayed in the header
*/
const resetInfoBar = () => {
  movesDisplay.innerText = 0;
  addStars(document.querySelector('#stars'));
  mins.innerText = '0';
  secs.innerText = '00';
};

/**
* @description Remove all the images from the game board
*/
const removeImages = () => {
  const usedImages = document.querySelectorAll('.card-images');
  usedImages.forEach((element) => {
    element.remove();
  });
};

/**
* @description Reset the cards to their original state
*/
const resetCards = () => {
  removeImages();

  // Remove bounce animation class and flipped
  // Remove light color
  cards.forEach((element) => {
    element.classList.remove('flipped');
    element.classList.remove('bounce');
    element.style = '';
  });
};

/**
* @description Add stars to the passed element
* @param {object} element - The DOM element where stars are to be added
*/
const addStars = (element) => {
  if (element.getAttribute('id') === 'stars') {
    document.querySelector('#stars').innerHTML = '';
  } else if (element.getAttribute('id') === 'congrats-stars') {
    document.querySelector('#congrats-stars').innerHTML = '';
  }

  for (let i = 0; i < stars; i += 1) {
    // Add the number of stars to the congrats screen
    const star = document.createElement('img');
    star.classList.add('star');
    star.setAttribute('src', './img/star.png');
    element.appendChild(star);
  }
};

/**
* @description Initialize the game over sequence
*/
const endGame = () => {
  addStars(document.querySelector('#congrats-stars'));
  gameScreen.classList.add('invisible');
  document.querySelector('#congrats-moves').innerText = moves;
  document.querySelector('#congrats-time').innerText = `Time: ${gameTime}`;
  document.querySelector('#congrats-screen').classList.remove('invisible');

  resetVariables();
  resetInfoBar();
  resetCards();
};

/**
* @description Check the board to see if win condition has been met
*/
const checkWin = () => {
  const flippedCards = document.getElementsByClassName('flipped');

  if (flippedCards.length === 16) {
    clearInterval(gameTimerInterval);
    endGame();
  }
};

/**
* @description Run bounce animation for correct match
*/
const correct = () => {
  matchCards[0].classList.remove('flip');
  matchCards[1].classList.remove('flip');
  matchCards[0].classList.add('bounce');
  matchCards[1].classList.add('bounce');
};

/**
* @description Check if selected cards match
*/
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

/**
* @description Reduce the number of stars left by one
*/
const reduceStarts = () => {
  document.querySelector('.star').remove();
  stars -= 1;
};

/**
* @description Function simulating a card click event
*/
const clickCard = (event) => {
  const animeStartTime = new Date();

  if (matchCards.length >= 2) {
    // Prevent user from flipping further cards in a hurry
    return undefined;
  }

  if (!playing) {
    // Start the game timer
    startTimer();
    playing = true;
  }

  event.currentTarget.classList.remove('flip-back'); // Remove the flip-back animation class
  event.currentTarget.classList.add('flip'); // Add animation to flip the card

  const flip = () => {
    // Insert image and change background color when animation is half complete
    const curTime = new Date();
    const ticks = curTime - animeStartTime;

    if (ticks >= 250) {
      if (!event.target.classList.contains('flipped') && event.target.classList.contains('card')) {
        // If card has not been flipped,
        // add image and style at quarter of a second (half way of the flip)
        event.target.innerHTML = `<img src="${images[event.target.getAttribute('id')]}" class="card-images">`;
        event.target.style = 'background-color: #00bceb;';
        event.target.classList.add('flipped');
        movesDisplay.innerText = ++moves; // Increase and display no of moves made

        // Reduce starts depending on number of moves made
        if (moves === 20) {
          reduceStarts();
        } else if (moves === 35) {
          reduceStarts();
        }

        // Add card to array that holds cards to compare
        matchCards.push(event.target);
        if (matchCards.length === 2) {
          checkMatch();
        }
      }
      clearInterval(interval);
    }
  };

  const interval = setInterval(flip, 10);

  return undefined;
};

/**
* @description Assign all cards an event listener
*/
const assignCardsEvent = () => {
  for (let i = 0; i < cards.length; i += 1) {
    cards[i].addEventListener('click', clickCard);
  }
};

playButton.addEventListener('click', startGame);

replay.addEventListener('click', startGame);

refresh.addEventListener('click', () => {
  stopTimer();
  endGame();
  startGame();
});
