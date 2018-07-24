const playButton = document.querySelector('#play-button');
const welcomeScreen = document.querySelector('#welcome-screen');
const gameScreen = document.querySelector('#game-screen');
const gameBoard = document.querySelector('#game-board');

playButton.addEventListener('click', () => {
  welcomeScreen.classList.add('invisible');
  gameScreen.classList.remove('invisible');
});
