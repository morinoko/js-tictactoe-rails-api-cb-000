// Code your JavaScript / jQuery solution here
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
                        
var turn = 0;

$(function() {
  // Get buttons ready
  attachListeners();
});

function attachListeners() {
  $("#save").on("click", saveGame);
  $("#previous").on("click", previousGames);
  $("#clear").on("click", clearBoard);
};

function player() {
  return turn % 2 ? 'O' : 'X';
}


function saveGame() {

}

function previousGames() {

}

function clearBoard() {

}



function doTurn() {
  updateState();
  turn++;
}

function updateState(square) {
  let token = player();
  $(square).text(token);
}

function checkWinner() {

}

function setMessage(message) {
  $("#message").html(message);
}
