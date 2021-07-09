var $board = $('main'),
  $itemCount = $('.score span'),
  $wins = $('.wins span'),
  $turns = $('.turns span'),
  $attempts = $('.attempts span'),
  $attemptsOverall = $('.attempts-overall span'),
  $success = $('.success'),
  $successMsg = $('.success-message'),
  $successIcon = $('.success-icon'),
  $btnContinue = $('.btn-continue'),
  $btnSound = $('.btn-sound'),
  selectedClass = 'is-selected',
  visibleClass = 'is-visible',
  playSoundClass = 'is-playing',
  scoreUpdateClass = 'is-updating',
  lastTurnClass = 'last-turn',
  dataMatch = 'data-matched',
  dataType = 'data-type',
  dataName = 'data-name',
  turnsCount = 2,
  winsCount = 0,
  attemptsCount = 0,
  attemptsOverallCount = 0,
  tooManyAttempts = 8,
  timeoutLength = 600,
  card1,
  card2,
  msg;

('use strict');

var cardsArrayFamily = [
  {
    dataType: 'familyMember',
    name: 'chivi',
    img: '../img/chivi.png',
  },
  {
    dataType: 'familyMember',
    name: 'elo',
    img: '../img/elo.png',
  },
  {
    dataType: 'familyMember',
    name: 'fredy',
    img: '../img/fredy.png',
  },
  {
    dataType: 'familyMember',
    name: 'carmen',
    img: '../img/carmen.png',
  },
  {
    dataType: 'familyMember',
    name: 'tay',
    img: '../img/tay.png',
  },
  {
    dataType: 'familyMember',
    name: 'marcos',
    img: '../img/marcos.png',
  },
  {
    dataType: 'familyMember',
    name: 'montse',
    img: '../img/montse.png',
  },
  {
    dataType: 'familyMember',
    name: 'agus',
    img: '../img/agus.png',
  },
  {
    dataType: 'familyMember',
    name: 'chino',
    img: '../img/chino.png',
  },
  //   , {
  //   'dataType': 'familyMember',
  //   'name': 'runa',
  //   'img': '../img/runa.png'
  // }, {
  //   'dataType': 'familyMember',
  //   'name': 'negrita',
  //   'img': '../img/negrita.png'
  // }, {
  //   'dataType': 'familyMember',
  //   'name': 'tay2',
  //   'img': '../img/tay2.png'
  // }
];

var cardsArraySMB = [
  {
    dataType: 'flower',
    name: 'flower',
    img: 'img/blueshell.png',
  },
  {
    dataType: 'mushroom',
    name: 'mushroom',
    img: 'img/star.png',
  },
  {
    dataType: 'star',
    name: 'star',
    img: 'img/bobomb.png',
  },
  {
    dataType: '1up',
    name: '1up',
    img: 'img/mario.png',
  },
  {
    dataType: 'coin10',
    name: 'coin10',
    img: 'img/luigi.png',
  },
  {
    dataType: 'coin20',
    name: 'coin20',
    img: 'img/peach.png',
  },
  {
    dataType: 'flower',
    name: 'flower',
    img: 'img/blueshell.png',
  },
  {
    dataType: 'mushroom',
    name: 'mushroom',
    img: 'img/star.png',
  },
  {
    dataType: 'star',
    name: 'star',
    img: 'img/bobomb.png',
  },
];

// Let's make some noise
var assetsUrl = './sounds/',
  sound = [
    'smb3_1-up.mp3',
    'smb3_nspade_match.mp3',
    'smb3_bonus_game_no_match.mp3',
  ],
  $themeSongEl = $('#theme-song')[0],
  soundSuccess = new Audio(assetsUrl + sound[0]),
  soundMatch = new Audio(assetsUrl + sound[1]),
  soundNoMatch = new Audio(assetsUrl + sound[2]);

// Turn on the sound if you want that real deal throwback experience
$btnSound.on('click', function (e) {
  e.preventDefault();
  $(this).toggleClass(playSoundClass);
  if ($(this).hasClass(playSoundClass)) {
    $themeSongEl.play();
  } else {
    $themeSongEl.pause();
  }
});

const FAMILY = 'family';
const SMB = 'smb';

var matchType = SMB;


//create the grid
var createGrid = () => {
  var cardsArray = matchType == FAMILY ? cardsArrayFamily : cardsArraySMB;

  var gameGrid = cardsArray.concat(cardsArray).sort(function () {
  return 0.5 - Math.random();
  });

  $board.empty();

  gameGrid.forEach(function (item) {
    var card = document.createElement('div');
    card.classList.add('card');
    card.dataset.type = item.dataType;
    card.dataset.matched = false;
    card.dataset.name = item.name;

    var front = document.createElement('div');
    front.classList.add('front');

    var back = document.createElement('div');
    back.classList.add('back');

    $board.append(card);
    card.appendChild(front);
    card.appendChild(back);
  });

  $card = $('.card');
  $card.on('click', function () {
    // Add selected class to a card only if it is not already matched
    if ($(this).attr(dataMatch) == 'false') {
      $(this).addClass(selectedClass);
    }
  
    var selectedCards = $('.' + selectedClass);
  
    // Check if cards match
    if (selectedCards.length == 2) {
      card1 = selectedCards.eq(0).attr(dataName);
      card2 = selectedCards.eq(1).attr(dataName);
  
      if (card1 == card2) {
        if ($btnSound.hasClass(playSoundClass)) {
          soundMatch.play();
        }
        selectedCards.attr(dataMatch, true).removeClass(selectedClass);
      } else {
        if ($btnSound.hasClass(playSoundClass)) {
          soundNoMatch.play();
        }
        setTimeout(function () {
          turnsCount--;
          $turns.addClass(scoreUpdateClass).html(turnsCount);
          selectedCards.removeClass(selectedClass);
        }, timeoutLength);
  
        if (turnsCount === 1) {
          setTimeout(function () {
            $turns.addClass(lastTurnClass);
          }, timeoutLength);
        }
  
        if (turnsCount <= 0) {
          setTimeout(function () {
            turnsCount = 2;
            $turns.removeClass(lastTurnClass).html(turnsCount);
            $card.attr(dataMatch, false);
            attemptsCount += 1;
            $attempts.addClass(scoreUpdateClass).html(attemptsCount);
          }, timeoutLength);
        }
      }
    }
  
    // Winner!
    if ($('[' + dataMatch + '="true"]').length == $card.length) {
      // Show success screen
      $success.addClass(visibleClass);
      if (attemptsCount <= tooManyAttempts) {
        setTimeout(function () {
          if ($btnSound.hasClass(playSoundClass)) {
            soundSuccess.play();
          }
        }, 600);
      }
      // Update success message based on the amount of attempts
      switch (true) {
        case attemptsCount <= 2:
          msg = 'SUPER!!!';
          $successIcon.attr(dataType, 'star');
          break;
        case attemptsCount > 2 && attemptsCount <= 5:
          msg = 'Bien Hecho!';
          if (matchType == FAMILY) {
            $successIcon.attr(dataType, 'familyMember');
            $successIcon.attr(dataName, 'elo');
          } else $successIcon.attr(dataType, 'mushroom');
          break;
        case attemptsCount > 5 && attemptsCount <= 8:
          msg = 'Puedes hacerlo mejor!';
          $successIcon.attr(dataType, 'flower');
          break;
        case attemptsCount > tooManyAttempts:
          msg = 'Eso llevó tiempo...';
          $successIcon.attr(dataType, 'chest');
          break;
      }
      $successMsg.text(msg);
  
      setTimeout(function () {
        attemptsOverallCount += attemptsCount;
        $attemptsOverall.addClass(scoreUpdateClass).html(attemptsOverallCount);
        winsCount += 1;
        $wins.addClass(scoreUpdateClass).html(winsCount);
        $card.attr(dataMatch, false);
      }, 1200);
    }
  });

}
  
  

var startGame = () => {
  $success.addClass(visibleClass);
  $successIcon.attr(dataType, 'familyMember');
  $successIcon.attr(dataName, 'elo');
  $successMsg.text('Quieres jugar conmigo? 😀');
  $btnContinue.text('Siiiii! Quiero Jugar');
};

startGame();



// Remove the score update class after the animation completes
$itemCount.on(
  'webkitAnimationEnd oanimationend msAnimationEnd animationend',
  function () {
    $itemCount.removeClass(scoreUpdateClass);
  }
);

// On to the next round!
$btnContinue.on('click', function () {
  $success.removeClass(visibleClass);
  createGrid();
  shuffleCards();
  setTimeout(function () {
    turnsCount = 2;
    $turns.removeClass(lastTurnClass).html(turnsCount);
    attemptsCount = 0;
    $attempts.html(attemptsCount);
  }, 300);
});

// Card shuffle function
function shuffleCards() {
  var cards = $board.children();
  while (cards.length) {
    $board.append(cards.splice(Math.floor(Math.random() * cards.length), 1)[0]);
  }
}

function setMatchType(value) {
  matchType = value;
  $btnContinue.show();
}
