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
    let gameEnd = false;

    function resetGame() {
        GameBoard.resetBoard();
        gameEnd = false;
    }

    function isWin(row, col) {
        // horizontal and vertical cells check.
        if(board[row][0].getValue() === board[row][1].getValue() && board[row][1].getValue() === board[row][2].getValue()) return true;
        if(board[0][col].getValue() === board[1][col].getValue() && board[1][col].getValue() === board[2][col].getValue()) return true;

        // diagonal cells check.
        if(row === col && board[0][0].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[2][2].getValue()) return true;
        if(row + col === 2 && board[0][2].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[2][0].getValue()) return true;
        return false;
    };

    const playRound = (row, col) => {
        if(gameEnd) return "end";
        if(board[row][col].getValue() !== '-') return;  // return, if cell is already occupied.
        GameBoard.dropToken(row, col, GameBoard.getPlayer());

        if(isWin(row, col)) {               // winning condition.
            gameEnd = true;
            return "WIN";
        }               
        else if(GameBoard.isBoardFull()) {  // tie condition.
            gameEnd = true;
            return "TIE";
        }

        GameBoard.switchPlayer();
    }

    return {
        playRound,
        resetGame,
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
    const msg = document.getElementById("msg");

    function processGameState(round) {
        if(round === "WIN") msg.textContent = `${GameBoard.getPlayer().playerName} is WON`;
        else if(round === "TIE") msg.textContent = `It's TIE`;
        else if(round === 'end') return;
        else {
            msg.textContent = "";
            const token = document.createElement("p");
            const turn = document.createElement("p");
            GameBoard.switchPlayer();
            token.textContent = `${GameBoard.getPlayer().token} is dropped by ${GameBoard.getPlayer().playerName}`;   
            GameBoard.switchPlayer();
            turn.textContent += `${GameBoard.getPlayer().playerName}'s turn...`;

            msg.appendChild(token);
            msg.appendChild(turn);
        }
    }

    boardBox.addEventListener("click", (e) => {
        // If clicked on borders and input not get selected.
        const selectedRow = Number(e.target.dataset.row);
        const selectedCol = Number(e.target.dataset.col);
        // if(!selectedCol || !selectedRow) return;

        // Playin round and processing gamestate.
        const round = game.playRound(selectedRow, selectedCol);
        processGameState(round);
        displayBoard();
    })
}
screenController();