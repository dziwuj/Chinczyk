import Game from './modules/game.js'

let game = new Game

setInterval(game.turns, 300)

document.querySelector('#dice').addEventListener('click', game.dice)