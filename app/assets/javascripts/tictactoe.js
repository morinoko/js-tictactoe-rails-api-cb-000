// Code your JavaScript / jQuery solution here
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn = 0;
currentGame = 0; // 0 = false in JS

$(function() {
  // Get buttons ready on load
  attachListeners();
});

function attachListeners() {
  $("td").on("click", function() {
    let square = this;
    doTurn(square);
  });

  $("#save").on("click", saveGame);
  $("#previous").on("click", previousGames);
  $("#clear").on("click", resetBoard);
};

// function player() {
//   return turn % 2 ? 'O' : 'X';
// }
var player = () => turn % 2 ? 'O' : 'X';

function resetBoard() {
  turn = 0;
  $("td").empty();
}

function doTurn(square) {
  //Clear message if left over from last game
  if (turn == 0) {
    $("#message").text("");
  }

  if ( !square.innerHTML ) {
    turn++;
    updateState(square);
  }

  if ( checkWinner() ) {
    saveGame();
    resetBoard();
  } else if ( turn === 9 ) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

function updateState(square) {
  let token = player();
  $(square).text(token);
}

function checkWinner() {
  let board = {};
  let winner = false;

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

function setMessage(message) {
  $("#message").html(message);
}

function saveGame() {
  let state = getState();
  let gameData = { state: state };

  if ( currentGame ) {
    // update game
    $.ajax({
      url: "/games/" + currentGame,
      method: "PATCH",
      data: gameData
    }).done(function(game) {
      console.log(game);
    });
  } else {
    // save new game
    $.post("/games/", gameData)
    .done(function(game) {
      currentGame = game.data.id;
      console.log(game);
    });
  }
}

function previousGames() {
  $.get("/games")
  .done(function(savedGames) {
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

function loadGame(gameId) {
  $.get("/games/" + gameId)
  .done(function(loadedGame) {
    console.log(loadedGame.data.id);
    console.log(loadedGame.data.attributes.state);
    const state = loadedGame.data.attributes.state;
    const id = loadedGame.data.id;

    currentGame = id;

    state.forEach(function(currentValue, index) {
      $("#" + index).text(currentValue);
    });
  });
}

function buttonizeGame(gameId) {
  $("#games").append(`<button id="game-id-${gameId}" data-id="${gameId}">Game ` + gameId + "</button><br>");
  $(`#game-id-${gameId}`).on("click", loadGame(gameId));
}
