const container = document.querySelector('#container');

// board sizes e.g. 9x9 and number of mines
const beginnerBoardSize = 9;
const beginnerMines = 10;

const semiBoardSize = 16;
const semiMines = 40;

const proBoardSize = 24;
const proMines = 99;

// function that genereates random index of board array to be a mine
// random from 0 to (max-1) - in pro level max would be 24 so 0-23
function getRandomInt(max) { 
    return Math.floor(Math.random() * max);
}

// creates real board that won't change once mines are placed
function createMyBoard(size) {
    let myBoard = [];
    for (let i=0; i<size; i++) {
        myBoard[i] = [];            // 2D array
        for (let j=0; j<size; j++) {
            myBoard[i][j] = '';
        }
    }
    return myBoard;
}

/*function NearbyMines(arr) {
    arr[0]
} */

// places number of mines dependent of level in random places on board
function placeMineRandom(level) {
    let max;                    //maximum index of board array
    let numberOfMines;          // how many mines in levels
    // assign them
    switch(level) {
        case 'beginner':
            numberOfMines = beginnerMines;
            max = beginnerBoardSize;
            break;
        case 'semi':
            numberOfMines = semiMines;
            max = semiBoardSize;
            break;
        case 'pro':
            numberOfMines = proMines;
            max = proBoardSize;
            break;
        default:
            break;
    }
    let board = createMyBoard(max);     // creating our board with mines
    let i = 0;                          //iterator
    while (i<numberOfMines) {
        let column = getRandomInt(max);  // random int from 0-max for a column in a board
        let row = getRandomInt(max);     // random int from 0-max for a row in a board
      
        if (board[column][row] !== '*') { // check if this random place on board doesn't have a mine already
            board[column][row] = '*';     // placing mine - *
            i++;
        }
    }
    console.table(board);
    return board;
}

// display board;
function createBoard(size) {
    for (let i=0; i<size; i++) {
        
        // this way we can use flexbox 
        const column = document.createElement('div');
        column.setAttribute('class', 'column');
        // column.setAttribute('id);
        container.appendChild(column);
        for (let j = 0; j < size; j++) {
            const row = document.createElement('button');
            row.setAttribute('class', 'row');
            column.appendChild(row);
        }
    }
}

createBoard(semiBoardSize);
placeMineRandom('beginner');
