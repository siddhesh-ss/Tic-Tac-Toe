const GameBoard = (() => {
    const row = 3;
    const board = [];

    const player1 = "Player One";
    const player2 = "Player Two";
    const players = [
        {
            playerName : player1,
            token : 'O',
        },
        {
            playerName : player2,
            token : 'X', 
        }
    ];

    for(let i = 0 ; i < row ; i++) {
        board[i] = [];
        for(let j = 0 ; j < row ; j++) {
            board[i].push(Cell());
        }
    }

    const resetBoard = () => {
        board.map(row => row.map(cell => cell.addToken('-')));
    };

    const getBoard  = () => board;

    let activePlayer = players[0];
    const switchPlayer = () => {activePlayer = activePlayer === players[0] ? players[1] : players[0]};

    const getPlayer = () => activePlayer;

    const printBoard = () => {
            console.log(board.map(row => row.map(cell => cell.getValue()).join(" ")).join("\n"));
            console.log("\n");
        }

    const dropToken = (row, col, player) => {
        board[row][col].addToken(player.token);
    }

    const isBoardFull = () => {
        for(let row of board) {
            for(let col of row) {
                if(col.getValue() === '-') return false;
            }
        }
        return true;
    }

    return {
        getBoard,
        switchPlayer,
        getPlayer,
        printBoard,
        dropToken,
        resetBoard,
        isBoardFull,
        row,
    }
})();

function Cell() {
    let value = '-';

    const addToken = (player) => {value = player};

    const getValue = () => value;

    return {
        addToken,
        getValue,
    };
}

function GameController() {
    const board = GameBoard.getBoard();

    function isWin(row, col) {
        if(board[row][0].getValue() === board[row][1].getValue() && board[row][1].getValue() === board[row][2].getValue()) return true;
        if(board[0][col].getValue() === board[1][col].getValue() && board[1][col].getValue() === board[2][col].getValue()) return true;

        if(row === col && board[0][0].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[2][2].getValue()) return true;
        if(row + col === 2 && board[0][2].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[2][0].getValue()) return true;

        return false;
    };

    const playRound = (row, col) => {
        if(board[row][col].getValue() !== '-') return;
        console.log(`${GameBoard.getPlayer().token} is dropped by ${GameBoard.getPlayer().playerName}`);
        GameBoard.dropToken(row, col, GameBoard.getPlayer());

        // Winning Condition.
        if(isWin(row, col)) return "WIN";
        else if(GameBoard.isBoardFull()) return "TIE";

        GameBoard.switchPlayer();
    }

    return {
        playRound,
    };
}

const game = GameController();

function displayBoard() {
    const board = GameBoard.getBoard();
    const boardBox = document.getElementById("board");
    boardBox.textContent = "";
    for(let r = 0 ; r < 3 ; r++) {
        const row = document.createElement("div");
        for(let c = 0 ; c < 3 ; c++) {
            const col = document.createElement("button");
            col.textContent = String(board[r][c].getValue());
            col.classList.add("cell");
            col.dataset.row = r;
            col.dataset.col = c;
            row.appendChild(col);
        }
        row.classList.add("row");
        boardBox.appendChild(row);
    }
}

displayBoard();
function screenController() {
    const boardBox = document.getElementById("board");

    boardBox.addEventListener("click", (e) => {
        const selectedRow = e.target.dataset.row;
        const selectedCol = e.target.dataset.col;
        if(!selectedCol || !selectedRow) return;
        game.playRound(selectedRow, selectedCol);
        displayBoard();
    })
}
screenController();