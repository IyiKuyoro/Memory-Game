const playButton = document.querySelector('#play-button');
const welcomeScreen = document.querySelector('#welcome-screen');
const gameScreen = document.querySelector('#game-screen');
const gameBoard = document.querySelector('#game-board');
const cards = document.getElementsByClassName('card');
const mins = document.querySelector('#mins');
const secs = document.querySelector('#secs');
const images = [];
const used = [];
let startTime = '';

const selectImages = () => {
  // Select 8 images to be used in game
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
  gameTimer();
};

const clickCard = (event) => {
  const image = event.currentTarget.querySelector('img');

  image.setAttribute("src", images[image.getAttribute("id")]);
};

const assignCardEvets = () => {
  for (let i = 0; i < cards.length; i += 1) {
    cards[i].addEventListener('click', clickCard);
  }
};

const startGame = () => {
  startTimer();
  assignCardEvets();
};

playButton.addEventListener('click', () => {
  selectImages();
  welcomeScreen.classList.add('invisible');
  gameScreen.classList.remove('invisible');
  startGame();
});
