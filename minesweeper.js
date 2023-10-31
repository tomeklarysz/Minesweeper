const container = document.querySelector('#container');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.close-button');
const modalBody = document.querySelector('.modal-body .verdict');

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
            row.style.backgroundColor = 'darkgray';
            row.style.borderColor = 'darkgray';
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

    function paintNumbers(x, y) {
        if (board[x][y] == '1') tails[x][y].style.color = 'blue';
        else if (board[x][y] == '2') tails[x][y].style.color = 'green';
        else if (board[x][y] == '3') tails[x][y].style.color = 'red';
        else if (board[x][y] == '4') tails[x][y].style.color = 'darkblue';
        else if (board[x][y] == '5') tails[x][y].style.color = 'brown';
        else if (board[x][y] == '*') {
            tails[x][y].style.backgroundColor = 'red';
            tails[x][y].style.fontWeight = '800';
        }
        // ADD NUMBERS TO 8
    }

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
            modal.classList.add('active');
            modalBody.textContent = "You won!";
            modal.style.color = 'limegreen';
        }
    }
    let checkedTails = [];
    let colorTails = [];
    function neighbourCheck(board, i, j) {

        let isChecked = false;
        let isColored = false;
        
        for (let p=0; p<checkedTails.length; p++) {
            if (i == checkedTails[p][0] && j == checkedTails[p][1]) {
                isChecked = true;
                // break;
            }
        }
        for (let p=0; p<colorTails.length; p++) {
            if (i == colorTails[p][0] && j == colorTails[p][1]) {
                isColored = true;
                // break;
            }
        }
            
        console.log(`starting check on ${i}, ${j}`);
        //checking if we are on the board
        function isCol(i) {
            return Boolean(i>=0 && i< board.length);
        }
        function isRow(j) {
            return Boolean(j>=0 && j< board.length);
        }
        
        if (!isCol || !isRow) return false;
        

        function changeTails(x, y) {
            if (!isColored) {
                tails[x][y].style.backgroundColor = 'lightgray';
                tails[x][y].style.borderColor = 'lightgray';
                tails[x][y].textContent = board[x][y];
                paintNumbers(x, y);
            }
            if (board[x][y] !== ' ') colorTails.push([x, y]);
            checkedTails.push([i, j]);
        }
        if (!isChecked) {
            // console.log(heckedTails.includes([i, j]));
            if (isCol(i-1) && isRow(j-1)) {
                changeTails(i-1, j-1);
            } 
            if (isCol(i) && isRow(j-1)) {
                changeTails(i, j-1);
                
            } 
            if (isCol(i+1) && isRow(j-1)) {
                changeTails(i+1, j-1);
                 
            }
            if (isCol(i+1) && isRow(j)) {
                changeTails(i+1, j);            
                
            }
            if (isCol(i+1) && isRow(j+1)) {
                changeTails(i+1, j+1);
                
            }
            if (isCol(i) && isRow(j+1)) {
                changeTails(i, j+1);
                
            }
            if (isCol(i-1) && isRow(j+1)) {
                changeTails(i-1, j+1);
                
            }
            if (isCol(i-1) && isRow(j)) {
                changeTails(i-1, j);
                
            }
            // checkedTails.push([i, j]);
            if (isCol(i-1) && isRow(j-1) && board[i-1][j-1] === ' ') neighbourCheck(board, i-1, j-1);
            if (isCol(i) && isRow(j-1) && board[i][j-1] === ' ') neighbourCheck(board, i, j-1);
            if (isCol(i+1) && isRow(i+1) && board[i+1][j-1] === ' ') neighbourCheck(board, i+1, j-1);
            if (isCol(i+1) && isRow(j) && board[i+1][j] === ' ') neighbourCheck(board, i+1, j);
            if (isCol(i+1) && isRow(j+1) && board[i+1][j+1] === ' ') neighbourCheck(board, i+1, j+1);
            if (isCol(i) && isRow(j+1) && board[i][j+1] === ' ') neighbourCheck(board, i, j+1);
            if (isCol(i-1) && isRow(j+1) && board[i-1][j+1] === ' ') neighbourCheck(board, i-1, j+1);
            if (isCol(i-1) && isRow(j)  && board[i-1][j] === ' ') neighbourCheck(board, i-1, j);

        }
        console.log(checkedTails);
        return true;
         
    }

    // adding event listeners
    for (let i=0; i<size; i++) {
        for (let j=0; j<size; j++) {
            tails[i][j].addEventListener('click', () => {
                // console.log(tails[i][j].textContent);
                if (tails[i][j].textContent !== '#') {
                     tails[i][j].style.backgroundColor = 'lightgray';
                     tails[i][j].style.borderColor = 'lightgray';
                     if (board[i][j] === '*') {
                        // shows whole board
                        for (let k=0; k<size; k++) {
                            for (let l=0; l<size; l++) {
                                tails[k][l].textContent = board[k][l];
                                tails[k][l].style.backgroundColor = 'lightgray';
                                tails[k][l].style.borderColor = 'lightgray';
                                paintNumbers(k, l);
                            }
                        }
                        modal.classList.add('active');
                        modalBody.textContent = "You lost!";
                        modal.style.color = 'red';
     
                     // don't add to flagcounter when it was already added from this tail
                     } else { 
                        if (board[i][j] === ' ') neighbourCheck(board, i, j);
                        tails[i][j].textContent = board[i][j];
                        paintNumbers(i, j);
                     }
                }
                check();
            });
            // right click to flag mine
            tails[i][j].addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (tails[i][j].style.backgroundColor === 'darkgray') {
                    if (tails[i][j].textContent !== '#') {
                        tails[i][j].textContent = '#'; 
                        flagsCounter++;
                    } else {
                        tails[i][j].textContent = '';
                        flagsCounter--;
                    }
                }
                check();
            });

        }
    }
    console.log(tails);
    return board;
}

closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
})

let myBoard = play('easy', easyBoardSize, easyMines);
console.table(myBoard);
console.log(`number of mines: ${mediumMines}`);
