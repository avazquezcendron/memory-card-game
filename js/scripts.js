'use strict';

var cardsArrayFamily = [{
  'name': 'chivi',
  'img': 'img/chivi.png'
}, {
  'name': 'elo',
  'img': 'img/elo.png'
}, {
  'name': 'fredy',
  'img': 'img/fredy.png'
}, {
  'name': 'carmen',
  'img': 'img/carmen.png'
}, {
  'name': 'tay',
  'img': 'img/tay.png'
}, {
  'name': 'tay2',
  'img': 'img/tay2.png'
}, {
  'name': 'marcos',
  'img': 'img/marcos.png'
}, {
  'name': 'montse',
  'img': 'img/montse.png'
}, {
  'name': 'runa',
  'img': 'img/runa.png'
}, {
  'name': 'negrita',
  'img': 'img/negrita.png'
}, {
  'name': 'agus',
  'img': 'img/agus.png'
}, {
  'name': 'chino',
  'img': 'img/chino.png'
}];

var cardsArraySMB1 = [{
  'name': 'shell',
  'img': 'img/blueshell.png'
}, {
  'name': 'star',
  'img': 'img/star.png'
}, {
  'name': 'bobomb',
  'img': 'img/bobomb.png'
}, {
  'name': 'mario',
  'img': 'img/mario.png'
}, {
  'name': 'luigi',
  'img': 'img/luigi.png'
}, {
  'name': 'peach',
  'img': 'img/peach.png'
}, {
  'name': '1up',
  'img': 'img/1up.png'
}, {
  'name': 'mushroom',
  'img': 'img/mushroom.png'
}, {
  'name': 'thwomp',
  'img': 'img/thwomp.png'
}, {
  'name': 'bulletbill',
  'img': 'img/bulletbill.png'
}, {
  'name': 'coin',
  'img': 'img/coin.png'
}, {
  'name': 'goomba',
  'img': 'img/goomba.png'
}];


const FAMILY = 'family';
const SMB = 'smb';

const MATCHTYPE = FAMILY | SMB;

var matchType = SMB;

var cardsArray = matchType == FAMILY ? cardsArrayFamily : cardsArraySMB1;
// var cardsArray = cardsArrayFamily;

var gameGrid = cardsArray.concat(cardsArray).sort(function () {
  return 0.5 - Math.random();
});

var firstGuess = '';
var secondGuess = '';
var count = 0;
var previousTarget = null;
var delay = 1200;

var game = document.getElementById('game');
var grid = document.createElement('section');
grid.setAttribute('class', 'grid');
game.appendChild(grid);


var createGrid = () => gameGrid.forEach(function (item) {
  var name = item.name,
      img = item.img;


  var card = document.createElement('div');
  card.classList.add('card');
  card.dataset.name = name;

  var front = document.createElement('div');
  front.classList.add('front');

  var back = document.createElement('div');
  back.style.backgroundImage = 'url(' + img + ')';
  back.classList.add('back');
  if (matchType == FAMILY)
    back.classList.add('backFamily');
  else    
    back.classList.add('backSMB');  

  grid.appendChild(card);
  card.appendChild(front);
  card.appendChild(back);
});

var match = function match() {
  var selected = document.querySelectorAll('.selected');
  selected.forEach(function (card) {
    card.classList.add('match');
  });
};

var resetGuesses = function resetGuesses() {
  firstGuess = '';
  secondGuess = '';
  count = 0;
  previousTarget = null;

  var selected = document.querySelectorAll('.selected');
  selected.forEach(function (card) {
    card.classList.remove('selected');
  });
};

grid.addEventListener('click', function (event) {

  var clicked = event.target;

  if (clicked.nodeName === 'SECTION' || clicked === previousTarget || clicked.parentNode.classList.contains('selected') || clicked.parentNode.classList.contains('match')) {
    return;
  }

  if (count < 2) {
    count++;
    if (count === 1) {
      firstGuess = clicked.parentNode.dataset.name;
      console.log(firstGuess);
      clicked.parentNode.classList.add('selected');
    } else {
      secondGuess = clicked.parentNode.dataset.name;
      console.log(secondGuess);
      clicked.parentNode.classList.add('selected');
    }

    if (firstGuess && secondGuess) {
      if (firstGuess === secondGuess) {
        setTimeout(match, delay);
      }
      setTimeout(resetGuesses, delay);
    }
    previousTarget = clicked;
  }
});

createGrid()