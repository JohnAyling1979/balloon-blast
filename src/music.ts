const titleMusic = new Audio('/music/title.mp3');
titleMusic.loop = true;
titleMusic.volume = 0.2;

const popped0Music = new Audio('/music/0-popped.mp3');
popped0Music.loop = true;
popped0Music.volume = 0.2;

const popped1Music = new Audio('/music/1-popped.mp3');
popped1Music.loop = true;
popped1Music.volume = 0.2;

const popped2Music = new Audio('/music/2-popped.mp3');
popped2Music.loop = true;
popped2Music.volume = 0.2;

const gameOverMusic = new Audio('/music/game-over.mp3');
gameOverMusic.loop = true;
gameOverMusic.volume = 0.2;

const blueAudio = new Audio('/button-sounds/blue.wav');
const greenAudio = new Audio('/button-sounds/green.wav');
const purpleAudio = new Audio('/button-sounds/purple.wav');
const redAudio = new Audio('/button-sounds/red.wav');

export {
  titleMusic,
  popped0Music,
  popped1Music,
  popped2Music,
  gameOverMusic,
  blueAudio,
  greenAudio,
  purpleAudio,
  redAudio,
};
