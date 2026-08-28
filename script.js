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

    const getBoard  = () => board;

    let activePlayer = players[0];
    const switchPlayer = () => {activePlayer = activePlayer === players[0] ? players[1] : players[0]};

    const getPlayer = () => activePlayer;

    const printBoard = () => {
            console.log(board.map(row => row.map(cell => cell.getValue()).join(" ")).join("\n"));
            console.log("\n");
        }

    const dropToken = (row, col, player) => {
        if(board[row][col].getValue() === '-') board[row][col].addToken(player.token);
        else return;
    }

    return {
        getBoard,
        switchPlayer,
        getPlayer,
        printBoard,
        dropToken,
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
    const printNewRound = () => {
        GameBoard.printBoard();
        console.log(`${GameBoard.getPlayer().playerName}'s turn...`);
    };

    const playRound = (row, col) => {
        console.log(`${GameBoard.getPlayer().token} is dropped by ${GameBoard.getPlayer().playerName}`);
        GameBoard.dropToken(row, col, GameBoard.getPlayer());

        GameBoard.switchPlayer();
        printNewRound();
    }

    printNewRound();
    return {
        playRound,
    };
}

const game = GameController();


