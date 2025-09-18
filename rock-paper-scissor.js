const mappingImg = {
  Rock: 'rps-img/rock-emoji.png',
  Paper: 'rps-img/paper-emoji.png',
  Scissors: 'rps-img/scissors-emoji.png'
}
    
let score = JSON.parse(localStorage.getItem('score')) || {
  win: 0,
  lose: 0,
  tie: 0
};
    
/* Shortcut above
  if (!score) { // !null = true
    score = {
    win: 0,
    lose: 0,
    tie: 0
  }
}*/
// console.log(score);
    
// document.querySelector('.currentScore').innerText = `Wins: ${score.win}, Losses: ${score.lose}, Ties: ${score.tie}`;
function updateScore() { // Always shown after pressing any button
  document.querySelector('.currentScore').innerText = `Wins: ${score.win}, Losses: ${score.lose}, Ties: ${score.tie}`;
};
    
let myChoice = '';
    
function randomChoice() {
  let randomNum = 1;
  randomNum = Math.random();
  if (randomNum < 1 / 3) {
    randChoice = 'Rock';
  } else if (randomNum < 2 / 3) {
    randChoice = 'Paper';
  } else {
    randChoice = 'Scissors';
  }
  return randChoice;
}
    
function decideWin(myChoice) {
  let result = '';
    
  comChoice = randomChoice();
  if (myChoice === comChoice) {
    result = 'Tied';
    score.tie++;
  } else if ((myChoice === 'Rock' && comChoice === 'Paper') ||
    (myChoice === 'Paper' && comChoice === 'Scissors') ||
    (myChoice === 'Scissors' && comChoice === 'Rock')) {
      result = 'You lose';
      score.lose++;
  } else {
    result = 'You win!';
    score.win++;
  }
    
  document.querySelector('.status').innerHTML = result;
  document.querySelector('.everyoneMoves').innerHTML = `You <img class='text-img' src=${mappingImg[myChoice]} style="width:80px"> - <img class='text-img' src=${mappingImg[comChoice]} style="width:80px"> AI`;
    
  // Save to local storage, but only support string
  localStorage.setItem('score', JSON.stringify(score));
    
  //console.log(`Win: ${score.win}, Lose: ${score.lose}, Tie: ${score.tie}`);
    
  //alert(`You pick ${myChoice}. Computer picked ${comChoice}. ${result}`);
}
    
function pressNumber() {
  if (event.key === 'Backspace') {
    confirmReset();
  }
  if (event.key === 'a') {
    start_auto();
  }
    
  if (event.key === '1') {
    myChoice = 'Rock';
    decideWin(myChoice);
    updateScore();
  } else if (event.key === '2') {
    mychoice = 'Paper';
    decideWin(mychoice);
    updateScore();
  } else if (event.key === '3') {
    mychoice = 'Scissors';
    decideWin(mychoice);
    updateScore();
  }
}
    
function resetGame() {
  score.win = 0;
  score.lose = 0;
  score.tie = 0;
  // console.log(`Win: ${score.win}, Lose: ${score.lose}, Tie: ${score.tie}`);
  localStorage.removeItem('score');
  updateScore();
  document.querySelector('.status').innerHTML = null;
  document.querySelector('.everyoneMoves').innerHTML = null;
}
    
const resetButton = document.querySelector('.reset-button');
const autoPlayButton = document.querySelector('.autoPlay-button');
const cfSpace = document.querySelector('.confirm-container');

function confirmReset() {
  if (autoPlayButton.innerHTML === 'Stop Playing') {
    start_auto(); // Auto press to stop the auto play when want to reset
  }
  if (score.win === 0 && score.lose === 0 && score.tie === 0) {return} // Avoid unnecessary reset
      
  cfSpace.innerHTML = `
    <p>Are you sure you want to reset the score?</p>
    <button class='cf-button yes-button'>Yes</button> <button class='cf-button no-button'>No</button>
  `; // Add confirm statement with button
    
  document.querySelector('.yes-button').addEventListener('click', () => {
    resetGame();
    cfSpace.innerHTML = '';
  });
  document.querySelector('.no-button').addEventListener('click', () => cfSpace.innerHTML = '');
}
resetButton.addEventListener('click', () => confirmReset())
    
let intervalId;
function start_auto() {
  cfSpace.innerHTML = ''; // Delete questions related to reset game
    
  if (autoPlayButton.innerText === 'Auto Play') {
    autoPlayButton.classList.add('is-auto');
    autoPlayButton.innerText = 'Stop Playing';
    intervalId = setInterval(() => { // Create a variable to store autoPlay Id
      const myAutoChoice = randomChoice();
      decideWin(myAutoChoice);
      updateScore();
    }, 1500); // Run every 1.5s
  } else {
    autoPlayButton.classList.remove('is-auto');
    autoPlayButton.innerHTML = 'Auto Play';
    clearInterval(intervalId); // Remove autoPlay Id to stop the auto mode
  }
};
    
autoPlayButton.addEventListener('click', () => start_auto());  
    
const rock = document.querySelector('.rock-button');
const paper = document.querySelector('.paper-button');
const scissors = document.querySelector('.scissors-button');
    
rock.addEventListener('click', () => {
  decideWin('Rock');
  updateScore();
});
paper.addEventListener('click', () => {
  decideWin('Paper');
  updateScore();
});
scissors.addEventListener('click', () => {
  decideWin('Scissors');
  updateScore();
});

// Any key pressed will be checked to see if it activates something (any button)
document.body.addEventListener('keydown', () => pressNumber()); 
