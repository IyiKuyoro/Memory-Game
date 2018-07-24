const playButton = document.querySelector('#play-button');
const welcomeScreen = document.querySelector('#welcome-screen');
const gameScreen = document.querySelector('#game-screen');
const gameBoard = document.querySelector('#game-board');
const mins = document.querySelector('#mins');
const secs = document.querySelector('#secs');
const images = [];
let startTime = '';

const selectImages = () => {
  // Select 8 images to be used in game
  const usedImages = {};
  for (let i = 0; i < 8; i += 1) {
    let imgNum = 0;

    do { // Loop until find a unique random number
      imgNum = Math.ceil((Math.random() * 12));
    } while (usedImages[imgNum])

    images.push(`./img/${imgNum}.png`);
    usedImages[imgNum] = 1;
  }
};

const gameTimer = () => {
  curTime = new Date();
  let elapsedTime = curTime - startTime;
  elapsedTime = Math.round(elapsedTime /= 1000);

  mins.innerText = Math.floor(elapsedTime / 60);
  secs.innerText = (elapsedTime % 60) < 10 ? `0${elapsedTime % 60}` : elapsedTime % 60;
};

const startTimer = () => {
  setInterval(gameTimer, 1000);
  startTime = new Date();

  gameTimer();
};

const startGame = () => {
  startTimer();
};

playButton.addEventListener('click', () => {
  selectImages();
  welcomeScreen.classList.add('invisible');
  gameScreen.classList.remove('invisible');
  startGame();
});
