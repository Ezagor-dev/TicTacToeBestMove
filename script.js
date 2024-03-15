
const statusDisplay = document.querySelector('.game--status');

let gameActive = true;

let currentPlayer = "X";

let gameState = ["", "", "", "", "", "", "", "", ""];

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

statusDisplay.innerHTML = currentPlayerTurn();

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);

function handleCellClick(clickedCellEvent) {   
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(
          clickedCell.getAttribute('data-cell-index')
        );
    
        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }
   
        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();

        // If the game is still active after the player's move, let the computer play.
    if (gameActive) {
        setTimeout(computerPlay, 1000);
    }
}
function computerPlay() {
    let move = findBestMove(gameState, "O");

    if (move !== null) {
        gameState[move] = "O";
        document.querySelector(`[data-cell-index="${move}"]`).innerHTML = "O";
        handleResultValidation();
    }
}

function findBestMove(gameState, player) {
    const opponent = player === "X" ? "O" : "X";
    
    // Win
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === player && gameState[b] === player && gameState[c] === "") return c;
        if (gameState[a] === player && gameState[c] === player && gameState[b] === "") return b;
        if (gameState[b] === player && gameState[c] === player && gameState[a] === "") return a;
    }
    
    // Block
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === opponent && gameState[b] === opponent && gameState[c] === "") return c;
        if (gameState[a] === opponent && gameState[c] === opponent && gameState[b] === "") return b;
        if (gameState[b] === opponent && gameState[c] === opponent && gameState[a] === "") return a;
    }
    
    // Center
    if (gameState[4] === "") return 4;
    
    // Opposite Corner
    if (gameState[0] === opponent && gameState[8] === "") return 8;
    if (gameState[2] === opponent && gameState[6] === "") return 6;
    if (gameState[6] === opponent && gameState[2] === "") return 2;
    if (gameState[8] === opponent && gameState[0] === "") return 0;
    
    // Empty Corner
    const corners = [0, 2, 6, 8];
    const emptyCorners = corners.filter(corner => gameState[corner] === "");
    if (emptyCorners.length > 0) return emptyCorners[0];
    
    // Empty Side
    const sides = [1, 3, 5, 7];
    const emptySides = sides.filter(side => gameState[side] === "");
    if (emptySides.length > 0) return emptySides[0];
    
    return null;
}


function handleCellPlayed(clickedCell, clickedCellIndex) {
    
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = currentPlayer;
    }

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            let a = gameState[winCondition[0]];
            let b = gameState[winCondition[1]];
            let c = gameState[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break
            }
        }
    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell')
               .forEach(cell => cell.innerHTML = "");
}    
