// Game constants
const ROWS = 6;
const COLS = 7;
const EMPTY = 0;
const RED = 1;
const YELLOW = 2;

// Game state
let board = [];
let currentPlayer = RED;
let gameOver = false;
let gameWon = false;

// Initialize the game
function initializeGame() {
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY));
    currentPlayer = RED;
    gameOver = false;
    gameWon = false;
    createGameBoard();
    updatePlayerTurn();
    clearGameStatus();
}

// Create the game board UI
function createGameBoard() {
    const gameBoardElement = document.getElementById('gameBoard');
    gameBoardElement.innerHTML = '';
    
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.onclick = () => dropPiece(col);
            
            // Add hover effect for columns
            cell.addEventListener('mouseenter', () => {
                if (!gameOver) {
                    const column = document.querySelectorAll(`[data-col="${col}"]`);
                    column.forEach(c => c.classList.add('hover-effect'));
                }
            });
            
            cell.addEventListener('mouseleave', () => {
                const column = document.querySelectorAll(`[data-col="${col}"]`);
                column.forEach(c => c.classList.remove('hover-effect'));
            });
            
            gameBoardElement.appendChild(cell);
        }
    }
    
    // Render existing pieces
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col] !== EMPTY) {
                renderPiece(row, col, board[row][col]);
            }
        }
    }
}

// Render a piece on the board
function renderPiece(row, col, player) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (cell) {
        const piece = document.createElement('div');
        piece.className = `piece ${player === RED ? 'red' : 'yellow'}`;
        cell.appendChild(piece);
    }
}

// Drop a piece in the specified column
function dropPiece(col) {
    if (gameOver || gameWon) return;
    
    // Find the lowest empty row in this column
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col] === EMPTY) {
            board[row][col] = currentPlayer;
            renderPiece(row, col, currentPlayer);
            
            // Check for win
            if (checkWin(row, col, currentPlayer)) {
                announceWinner();
                highlightWinningPieces(row, col, currentPlayer);
                return;
            }
            
            // Check for draw
            if (checkDraw()) {
                announceDraw();
                return;
            }
            
            // Switch player
            currentPlayer = currentPlayer === RED ? YELLOW : RED;
            updatePlayerTurn();
            return;
        }
    }
}

// Check if the current player has won
function checkWin(row, col, player) {
    return (
        checkHorizontal(row, col, player) ||
        checkVertical(row, col, player) ||
        checkDiagonalRight(row, col, player) ||
        checkDiagonalLeft(row, col, player)
    );
}

// Check horizontal win
function checkHorizontal(row, col, player) {
    let count = 1;
    
    // Check left
    for (let c = col - 1; c >= 0 && board[row][c] === player; c--) {
        count++;
    }
    
    // Check right
    for (let c = col + 1; c < COLS && board[row][c] === player; c++) {
        count++;
    }
    
    return count >= 4;
}

// Check vertical win
function checkVertical(row, col, player) {
    let count = 1;
    
    // Check down
    for (let r = row + 1; r < ROWS && board[r][col] === player; r++) {
        count++;
    }
    
    // Check up
    for (let r = row - 1; r >= 0 && board[r][col] === player; r--) {
        count++;
    }
    
    return count >= 4;
}

// Check diagonal (top-left to bottom-right) win
function checkDiagonalRight(row, col, player) {
    let count = 1;
    
    // Check up-left
    for (let r = row - 1, c = col - 1; r >= 0 && c >= 0 && board[r][c] === player; r--, c--) {
        count++;
    }
    
    // Check down-right
    for (let r = row + 1, c = col + 1; r < ROWS && c < COLS && board[r][c] === player; r++, c++) {
        count++;
    }
    
    return count >= 4;
}

// Check diagonal (top-right to bottom-left) win
function checkDiagonalLeft(row, col, player) {
    let count = 1;
    
    // Check up-right
    for (let r = row - 1, c = col + 1; r >= 0 && c < COLS && board[r][c] === player; r--, c++) {
        count++;
    }
    
    // Check down-left
    for (let r = row + 1, c = col - 1; r < ROWS && c >= 0 && board[r][c] === player; r++, c--) {
        count++;
    }
    
    return count >= 4;
}

// Find and highlight winning pieces
function highlightWinningPieces(row, col, player) {
    const winningCells = [];
    
    // Check all four directions
    winningCells.push(...getHorizontalWinningCells(row, col, player));
    winningCells.push(...getVerticalWinningCells(row, col, player));
    winningCells.push(...getDiagonalRightWinningCells(row, col, player));
    winningCells.push(...getDiagonalLeftWinningCells(row, col, player));
    
    // Highlight winning pieces
    winningCells.forEach(([r, c]) => {
        const cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
        if (cell) {
            const piece = cell.querySelector('.piece');
            if (piece) {
                piece.classList.add('winner');
            }
        }
    });
}

// Get horizontal winning cells
function getHorizontalWinningCells(row, col, player) {
    const cells = [];
    let count = 0;
    const winCells = [];
    
    // Scan from left to right
    for (let c = 0; c < COLS; c++) {
        if (board[row][c] === player) {
            count++;
            winCells.push([row, c]);
            if (count === 4) {
                return winCells.slice(-4);
            }
        } else {
            count = 0;
            winCells.length = 0;
        }
    }
    return cells;
}

// Get vertical winning cells
function getVerticalWinningCells(row, col, player) {
    const cells = [];
    let count = 0;
    const winCells = [];
    
    for (let r = 0; r < ROWS; r++) {
        if (board[r][col] === player) {
            count++;
            winCells.push([r, col]);
            if (count === 4) {
                return winCells.slice(-4);
            }
        } else {
            count = 0;
            winCells.length = 0;
        }
    }
    return cells;
}

// Get diagonal (right) winning cells
function getDiagonalRightWinningCells(row, col, player) {
    const cells = [];
    let count = 0;
    const winCells = [];
    
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] === player) {
                let dr = r, dc = c;
                let tempCells = [];
                while (dr < ROWS && dc < COLS && board[dr][dc] === player) {
                    tempCells.push([dr, dc]);
                    dr++;
                    dc++;
                }
                if (tempCells.length >= 4) {
                    return tempCells.slice(0, 4);
                }
            }
        }
    }
    return cells;
}

// Get diagonal (left) winning cells
function getDiagonalLeftWinningCells(row, col, player) {
    const cells = [];
    let count = 0;
    const winCells = [];
    
    for (let r = 0; r < ROWS; r++) {
        for (let c = COLS - 1; c >= 0; c--) {
            if (board[r][c] === player) {
                let dr = r, dc = c;
                let tempCells = [];
                while (dr < ROWS && dc >= 0 && board[dr][dc] === player) {
                    tempCells.push([dr, dc]);
                    dr++;
                    dc--;
                }
                if (tempCells.length >= 4) {
                    return tempCells.slice(0, 4);
                }
            }
        }
    }
    return cells;
}

// Check if the board is full (draw)
function checkDraw() {
    return board[0].every(cell => cell !== EMPTY);
}

// Update player turn indicator
function updatePlayerTurn() {
    const turnElement = document.getElementById('turnIndicator');
    const playerSpan = document.querySelector('.player-turn');
    
    if (currentPlayer === RED) {
        playerSpan.style.backgroundColor = '#ff6b6b';
        turnElement.textContent = 'Red Player\'s Turn';
    } else {
        playerSpan.style.backgroundColor = '#ffd700';
        turnElement.textContent = 'Yellow Player\'s Turn';
    }
}

// Announce winner
function announceWinner() {
    gameWon = true;
    gameOver = true;
    const playerName = currentPlayer === RED ? 'Red' : 'Yellow';
    const statusElement = document.getElementById('gameStatus');
    statusElement.textContent = `🎉 ${playerName} Player Wins! 🎉`;
    statusElement.classList.add('winner');
}

// Announce draw
function announceDraw() {
    gameOver = true;
    const statusElement = document.getElementById('gameStatus');
    statusElement.textContent = '🤝 It\'s a Draw!';
    statusElement.classList.add('draw');
}

// Clear game status message
function clearGameStatus() {
    const statusElement = document.getElementById('gameStatus');
    statusElement.textContent = '';
    statusElement.classList.remove('winner', 'draw');
}

// Reset the game
function resetGame() {
    initializeGame();
}

// Start the game
initializeGame();
