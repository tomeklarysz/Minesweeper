const container = document.querySelector('#container');

// board sizes e.g. 9x9 and number of mines
const easyBoardSize = 9;
const easyMines = 10;

const mediumBoardSize = 16;
const mediumMines = 40;

const hardBoardSize = 24;
const hardMines = 99;
 
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
    
    //checking if we are on the board
    const isCol = Boolean(col>=0 && col < arr.length);
    const isRow = Boolean(row>=0 && row < arr.length);
    if (!isCol || !isRow) return count;

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
    if (isNotNorth && arr[col-1][row] === '*') count++;           // north
    
    return count;
}

// places number of mines dependent of level in random places on board
function placeMineRandom(level) {
    let max;                    // maximum index of board array
    let numberOfMines;          // how many mines in levels
    // assign them
    switch(level) {
        case 'easy':
            numberOfMines = easyMines;
            max = easyBoardSize;
            break;
        case 'medium':
            numberOfMines = mediumMines;
            max = mediumBoardSize;
            break;
        case 'hard':
            numberOfMines = hardMines;
            max = hardBoardSize;
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
                if (NearbyMines(realBoard, i, j) == 0) {
                    realBoard[i][j] = ' ';      // so it looks empty
                } else {
                    realBoard[i][j] = NearbyMines(realBoard, i, j);
                }
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
    
    return board;
}

//basically main function
function play(level, size, mines) {
    const board = createBoard(level, size);
    const rows = document.querySelectorAll('.row');
    const arr = Array.from(rows);
    const tails = [];
    //convert nodelist to 2d array
    while(arr.length) {
        tails.push(arr.splice(0, size));
    }
    let flagsCounter = 0;       // how many flags used by a player
    let didWin = false;         // boolean to check if player won

    // check if player won
    function check() {
        let howManyFilled = 0;  // how many tails were clicked
        for (let i=0; i<size; i++) {
            for (let j=0; j<size; j++) {
                if (tails[i][j].textContent == '') {
                    break;
                } else {
                    howManyFilled++;
                }
            }
        }
        console.log(`flags used: ${flagsCounter}`);
        if (howManyFilled == Math.pow(size, 2)) didWin = true;  // if every tail was clicked, player win
        // create info about winning 
        if (didWin && flagsCounter === mines) {
            const body = document.querySelector('body');
            const winDiv = document.createElement('div');
            winDiv.setAttribute('id', 'win');
            winDiv.textContent = "You won!";
                
            body.appendChild(winDiv);
            container.style.opacity = 0.4;
        }
    }

    function neighbourCheck(board, i, j) {
        //checking if we are on the board
        const isCol = Boolean(i>=0 && i< board.length);
        const isRow = Boolean(j>=0 && j< board.length);

        //checking if we are near edge of the board
        const isNotNorth = Boolean(i-1 >= 0); 
        const isNotSouth = Boolean(i+1 < board.length);
        const isNotWest = Boolean(j-1 >= 0);
        const isNotEast = Boolean(j+1 < board.length);

        let arr = [[]];
        function changeTails(x, y) {
            tails[x][y].style.backgroundColor = 'lightgray';
            tails[x][y].style.borderColor = 'lightgray';
            tails[x][y].textContent = board[x][y];
            if (board[x][y] === ' ') {
                arr.push([x, y]);
            }
        }
        if (isCol && isRow && isNotNorth && isNotWest) changeTails(i-1, j-1); // checking west side
        if (isCol && isRow && isNotWest) changeTails(i, j-1);
        if (isCol && isRow && isNotSouth && isNotWest) changeTails(i+1, j-1);
        if (isCol && isRow && isNotSouth) changeTails(i+1, j);            // south
        if (isCol && isRow && isNotSouth && isNotEast) changeTails(i+1, j+1); // east
        if (isCol && isRow && isNotEast) changeTails(i, j+1);
        if (isCol && isRow && isNotNorth && isNotEast) changeTails(i-1, j+1);
        if (isCol && isRow && isNotNorth) changeTails(i-1, j);           // north
        
        if (arr.length > 0) {
            neighbourCheck(board, arr[i][0], arr[i][1]);
        }
        
    }

    // adding event listeners
    for (let i=0; i<size; i++) {
        for (let j=0; j<size; j++) {
            tails[i][j].addEventListener('click', () => {
                tails[i][j].style.backgroundColor = 'lightgray';
                tails[i][j].style.borderColor = 'lightgray';
                if (board[i][j] === '*') {
                    if (tails[i][j] !== '#') {
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
                    }

                // don't add to flagcounter when it was already added from this tail
                } else { 
                    if (board[i][j] === ' ') neighbourCheck(board, i, j);
                    if (tails[i][j].textContent === '#') {
                        flagsCounter--;
                        tails[i][j].style.backgroundColor = 'darkgray';
                        tails[i][j].style.borderColor = 'darkgray';
                    }
                    tails[i][j].textContent = board[i][j];
                }
                check();
            });
            // right click to flag mine
            tails[i][j].addEventListener('contextmenu', (e) => {
                e.preventDefault();
                tails[i][j].style.backgroundColor = 'lightgray';
                tails[i][j].style.borderColor = 'lightgray';
                if (tails[i][j].textContent !== '#') {
                    tails[i][j].textContent = '#'; 
                    flagsCounter++;
                }
                check();
            });

        }
    }
    return board;
}

let myBoard = play('easy', easyBoardSize, easyMines);
console.table(myBoard);
console.log(`number of mines: ${mediumMines}`);
