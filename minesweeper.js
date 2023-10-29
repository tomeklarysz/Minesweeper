const container = document.querySelector('#container');

// board sizes e.g. 9x9 and number of mines
const beginnerBoardSize = 9;
const beginnerMines = 10;

const semiBoardSize = 16;
const semiMines = 40;

const proBoardSize = 24;
const proMines = 99;
 
// function that genereates random integer from 0 to (max-1) - in pro level max would be 24 so 0-23
function getRandomInt(max) { 
    return Math.floor(Math.random() * max);
}

// creates real, empty board that won't change once mines are placed
function createEmptyBoard(size) {
    let myBoard = [];
    for (let i=0; i<size; i++) {
        myBoard[i] = [];            // 2D array
        for (let j=0; j<size; j++) {
            myBoard[i][j] = '';
        }
    }
    return myBoard;
}
// function to check how many mines are nearby
function NearbyMines(arr, col, row) {   //arr is our board, col and row are its indexes
    let count = 0;

    //checking if we are near edge of the board
    const isNotNorth = Boolean(col-1 >= 0); 
    const isNotSouth = Boolean(col+1 < arr.length);
    const isNotWest = Boolean(row-1 >= 0);
    const isNotEast = Boolean(row+1 < arr.length);
    
    if (isNotNorth && isNotWest && arr[col-1][row-1] === '*') count++; // checking west side
    if (isNotWest && arr[col][row-1] === '*') count++;
    if (isNotSouth && isNotWest && arr[col+1][row-1] === '*') count++;
    if (isNotSouth && arr[col+1][row] === '*') count++;            // south
    if (isNotSouth && isNotEast && arr[col+1][row+1] === '*') count++; // east
    if (isNotEast && arr[col][row+1] === '*') count++;
    if (isNotNorth && isNotEast && arr[col-1][row+1] === '*') count++;
    if (isNotNorth && arr[col-1][row] === '*') count++;            // north
    return count;
}

// places number of mines dependent of level in random places on board
function placeMineRandom(level) {
    let max;                    // maximum index of board array
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
    let board = createEmptyBoard(max);     // creating our board with mines
    let i = 0;                          //iterator
    while (i<numberOfMines) {
        let column = getRandomInt(max);  // random int from 0-max for a column in a board
        let row = getRandomInt(max);     // random int from 0-max for a row in a board
      
        if (board[column][row] !== '*') { // check if this random place on board doesn't have a mine already
            board[column][row] = '*';     // placing mine - *
            i++;
        }
    }
    // console.table(board);
    return board;
}

//function to create real board with mines and numbers;
function createRealBoard(level) {
    let realBoard = placeMineRandom(level);
    for (let i=0; i<realBoard.length; i++) {
        for (let j=0; j<realBoard.length; j++) {
            if (realBoard[i][j] !== '*') {
                realBoard[i][j] = NearbyMines(realBoard, i, j);
            }
        }
    }
    return realBoard;
}

// display board;
function createBoard(level, size) {
    const board = createRealBoard(level);     // integrate real board with the one we display
    
    // looping to create grid and add listeners
    for (let i=0; i<size; i++) {
        // this way we can use flexbox 
        const column = document.createElement('div');
        column.setAttribute('class', 'column');
        container.appendChild(column);
        for (let j=0; j<size; j++) {
            const row = document.createElement('button');
            row.setAttribute('class', 'row');
            column.appendChild(row);
        }
    }
    const rows = document.querySelectorAll('.row');
    const arr = Array.from(rows);
    const tails = [];
    //convert nodelist to 2d array
    while(arr.length) {
        tails.push(arr.splice(0, size));
    }

    // adding event listener
    for (let i=0; i<size; i++) {
        for (let j=0; j<size; j++) {
            tails[i][j].addEventListener('click', () => {
                if (board[i][j] === '*') {
                // shows whole board
                    for (let k=0; k<size; k++) {
                        for (let l=0; l<size; l++) {
                            tails[k][l].textContent = board[k][l];
                        }
                    }
                    const body = document.querySelector('body');
                    const lostDiv = document.createElement('div');
                    lostDiv.setAttribute('id', 'lost');
                    lostDiv.textContent = "You lost!";
                    
                    body.appendChild(lostDiv);
                    container.style.opacity = 0.4;

                } else {
                    tails[i][j].textContent = board[i][j];
                }
            });
        }
    }
    return board;
}

let myBoard = createBoard('semi', semiBoardSize);
console.table(myBoard);
