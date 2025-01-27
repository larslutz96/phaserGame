export const gameOptions = {
  font: {
    fontFamily: "Arial",
  },

  gameSize: {
    width: 800, // width of the game, in pixels
    height: 800, // height of the game, in pixels
  },
  gameDuration: 600000,
  gameBackgroundColor: 0x222222, // game background color

  playerSpeed: 500, // player speed, in pixels per second

  weapons: {
    bulletSpeed: 1000, // bullet speed, in pixels per second
    bulletRate: 300, // bullet rate, in milliseconds per bullet
    axeSpeed: 500, // bullet speed, in pixels per second
    axeRate: 1000, // bullet rate, in milliseconds per bullet
  },

  enemies: {
    bunnySpeed: 100,
    bunnyRate: 100,
  },
};