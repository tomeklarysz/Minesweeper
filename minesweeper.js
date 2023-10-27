const container = document.querySelector('#container');

const beginner = 9;
const semi = 16;
const pro = 24;

function createBoard(size) {
    for (let i=0; i<size; i++) {
        
        // this way we can use flexbox 
        const column = document.createElement('div');
        column.setAttribute('class', 'column');
        container.appendChild(column);
        for (let j = 0; j < size; j++) {
            const row = document.createElement('button');
            row.setAttribute('class', 'row');
            column.appendChild(row);
        }
    }
}

createBoard(beginner);