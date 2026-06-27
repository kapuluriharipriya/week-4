// Connect Four Game Logic
class ConnectFourGame {
    constructor() {
        this.ROWS = 6;
        this.COLS = 7;
        this.board = [];
        this.currentPlayer = 'red';
        this.gameOver = false;
        this.redWins = 0;
        this.blueWins = 0;
        this.initBoard();
        this.setupEventListeners();
        this.render();
    }

    initBoard() {
        this.board = Array(this.ROWS)
            .fill(null)
            .map(() => Array(this.COLS).fill(null));
        this.currentPlayer = 'red';
        this.gameOver = false;
    }

    setupEventListeners() {
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        
        // Add click listeners to cells
        this.updateCellListeners();
    }

    updateCellListeners() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.removeEventListener('click', cell.clickHandler);
            const col = index % this.COLS;
            cell.clickHandler = () => this.makeMove(col);
            cell.addEventListener('click', cell.clickHandler);
        });
    }

    makeMove(col) {
        if (this.gameOver) {
            alert('Game is over! Start a new game.');
            return;
        }

        // Find the lowest available row in the column
        let row = -1;
        for (let r = this.ROWS - 1; r >= 0; r--) {
            if (this.board[r][col] === null) {
                row = r;
                break;
            }
        }

        if (row === -1) {
            alert('Column is full!');
            return;
        }

        // Place the piece
        this.board[row][col] = this.currentPlayer;

        // Check for winner
        if (this.checkWin(row, col)) {
            this.gameOver = true;
            const winner = this.currentPlayer === 'red' ? 'Red' : 'Blue';
            this.updateMessage(`🎉 ${winner} Wins! 🎉`, 'winner');
            
            if (this.currentPlayer === 'red') {
                this.redWins++;
            } else {
                this.blueWins++;
            }
            this.updateStats();
        } else if (this.isBoardFull()) {
            this.gameOver = true;
            this.updateMessage("It's a Draw!", 'draw');
        } else {
            // Switch player
            this.currentPlayer = this.currentPlayer === 'red' ? 'blue' : 'red';
            this.updateMessage(`${this.currentPlayer === 'red' ? 'Red' : 'Blue'}'s Turn`);
            this.updatePlayerIndicator();
        }

        this.render();
    }

    checkWin(row, col) {
        const player = this.board[row][col];
        
        // Check horizontal
        if (this.checkDirection(row, col, player, 0, 1)) return true;
        
        // Check vertical
        if (this.checkDirection(row, col, player, 1, 0)) return true;
        
        // Check diagonal (top-left to bottom-right)
        if (this.checkDirection(row, col, player, 1, 1)) return true;
        
        // Check diagonal (top-right to bottom-left)
        if (this.checkDirection(row, col, player, 1, -1)) return true;
        
        return false;
    }

    checkDirection(row, col, player, rowDelta, colDelta) {
        let count = 1;

        // Check positive direction
        let r = row + rowDelta;
        let c = col + colDelta;
        while (r >= 0 && r < this.ROWS && c >= 0 && c < this.COLS && this.board[r][c] === player) {
            count++;
            r += rowDelta;
            c += colDelta;
        }

        // Check negative direction
        r = row - rowDelta;
        c = col - colDelta;
        while (r >= 0 && r < this.ROWS && c >= 0 && c < this.COLS && this.board[r][c] === player) {
            count++;
            r -= rowDelta;
            c -= colDelta;
        }

        return count >= 4;
    }

    isBoardFull() {
        return this.board.every(row => row.every(cell => cell !== null));
    }

    updateMessage(text, className = '') {
        const messageElement = document.getElementById('message');
        messageElement.textContent = text;
        messageElement.className = className;
    }

    updatePlayerIndicator() {
        const indicator = document.getElementById('playerIndicator');
        const playerSpan = document.getElementById('currentPlayer');
        
        indicator.classList.remove('red', 'blue');
        if (this.currentPlayer === 'red') {
            indicator.classList.add('red');
            playerSpan.textContent = 'Red';
        } else {
            indicator.classList.add('blue');
            playerSpan.textContent = 'Blue';
        }
    }

    updateStats() {
        document.getElementById('redWins').textContent = this.redWins;
        document.getElementById('blueWins').textContent = this.blueWins;
    }

    render() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';

        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');

                if (this.board[row][col] === 'red') {
                    cell.classList.add('red');
                } else if (this.board[row][col] === 'blue') {
                    cell.classList.add('blue');
                }

                boardElement.appendChild(cell);
            }
        }

        this.updateCellListeners();
    }

    resetGame() {
        this.initBoard();
        this.updateMessage(`${this.currentPlayer === 'red' ? 'Red' : 'Blue'}'s Turn`);
        this.updatePlayerIndicator();
        this.render();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ConnectFourGame();
});
