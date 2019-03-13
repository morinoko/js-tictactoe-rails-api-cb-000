// Code your JavaScript / jQuery solution here
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn = 0;
var currentGame = 0; // 0 = false in JS

// Get listeners ready on load
$(document).ready(function() {
  attachListeners();
});

// function player() {
//   return turn % 2 ? 'O' : 'X';
// }
var player = () => turn % 2 ? 'O' : 'X';

function doTurn(square) {
  //Clear message if left over from last game
  if (turn == 0) {
    $("#message").text("");
  }

  turn++;
  updateState(square);

  if ( checkWinner() ) {
    saveGame();
    resetBoard();
  } else if ( turn === 9 ) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

function resetBoard() {
  $("td").empty();
  turn = 0;
  currentGame = 0;
}

function attachListeners() {
  $("td").on("click", function() {
    let square = this;

    // Check if square is available and that there is no winner before doing turn
    if ( !square.innerHTML && !checkWinner() ) {
      doTurn(square);
    }
  });

  $("#save").on("click", () => saveGame());
  $("#previous").on("click", () => showPreviousGames());
  $("#clear").on("click", () => resetBoard());
};

function checkWinner() {
  var board = {};
  var winner = false;

  $("td").text(function(index, token) {
    board[index] = token;
  });

  WINNING_COMBOS.some(function(combo) {
    if ( board[combo[0]] !== "" &&
         board[combo[0]] === board[combo[1]] &&
         board[combo[1]] === board[combo[2]]) {
           let winningToken = board[combo[0]];
           setMessage(`Player ${winningToken} Won!`);
           return winner = true;
         }
  });

  return winner;
}

function updateState(square) {
  var token = player();
  $(square).text(token);
}

function setMessage(message) {
  $("#message").text(message);
}

function saveGame() {
  var state = getState();
  var gameData = { state: state };

  if ( currentGame ) {
    // update game
    $.ajax({
      url: `/games/${currentGame}`,
      type: "PATCH",
      data: gameData
    });
  } else {
    // save new game
    $.post("/games", gameData, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">Game ${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
    });
  }
}

function showPreviousGames() {
  // Clear if list is already present
  $('#games').empty();

  $.get("/games", function(savedGames) {
    if (savedGames.data.length) {
      savedGames.data.forEach(function(game) {
        buttonizeGame(game.id);
      });
    }
  });
}

function getState() {
  let board = [];

  $("td").text(function(index, token) {
    board[index] = token;
  });

  return board;
}

function reloadGame(gameId) {
  $.get(`/games/${gameId}`)
  .done(function(loadedGame) {
    console.log(loadedGame.data.id);
    console.log(loadedGame.data.attributes.state);
    const state = loadedGame.data.attributes.state;
    const id = loadedGame.data.id;

    state.forEach(function(currentValue, index) {
      $("#" + index).text(currentValue);
    });

    turn = state.join('').length;
    currentGame = id;

    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.');
    }
  });
}

function buttonizeGame(gameId) {
  $("#games").append(`<button id="game-id-${gameId}" data-id="${gameId}">Game ` + gameId + "</button><br>");
  $(`#game-id-${gameId}`).on("click", () => reloadGame(gameId));
}
