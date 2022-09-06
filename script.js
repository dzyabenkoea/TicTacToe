let grid = document.querySelector('.game-grid')

function convert(value) {
    switch (value) {
        case 1:
            return 'x'
        case 0:
            return 'o'
        case null:
            return ''
    }
    return value ? 'x' : 'o'
}

// function draw(gameboard) {
//     let id = 0;
//     for (i = 0; i < gameboard.length; i++) {
//         for (j = 0; j < gameboard[i].length; j++) {
//             let div = document.createElement('div')
//             div.classList.add('element')
//             div.textContent = convert(gameboard[i][j])
//             div.dataset.id = (id).toString()
//             grid.append(div)
//             id++;
//         }
//     }
// }

let Tests = (function () {

    const BaseTest = (function () {
        return {
            log: function () {
                name
            }
        }
    })();

    const testGridDraw = () => {
        const board = [
            [null, null, null],
            [1, null, 1],
            [0, 0, 1]]

        draw(board)
        const cells = document.querySelectorAll('.element[data-id]')
        let id = 0;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const drawnContent = document.querySelector(`.element[data-id="${id}"]`).textContent
                const neededContent = convert(board[i][j])
                if (neededContent !== drawnContent) {
                    return false;
                }
                id++;
            }
        }
        return true
    }
    return {testGridDraw}
})();

const Player = (function () {
    const makeMove = function (slotIndex) {

    }

    return {makeMove}
})

const GameBoard = (function () {

    const board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]]

    const players = []
    players.push(Player(), Player())

    const playerMarks = {
        'x': players[0],
        'o': players[1]
    }

    let currentPlayer = players[0];

    const gameGrid = document.querySelector('.game-grid')
    gameGrid.addEventListener('click', handleClick)

    initialRender();

    function initialRender() {
        let id = 0;
        for (i = 0; i < board.length; i++) {
            for (j = 0; j < board[i].length; j++) {
                let div = document.createElement('div')
                div.classList.add('element')
                div.textContent = convert(board[i][j])
                div.dataset.id = (id).toString()
                grid.append(div)
                id++;
            }
        }
    }

    function getNextPlayer() {
        const notCurrentPlayers = players.filter(el => currentPlayer !== el)
        return notCurrentPlayers[0]
    }

    const makeMove = function (cellId) {
        const row = cellId % 3
        const col = cellId / 3

        board[row][col] = playerMarks[currentPlayer]

        currentPlayer = getNextPlayer()
    }

    function handleClick(event) {
        const cell = event.target.closest('.element')
        cell.style.background = 'lightgray'

        const cellId = cell.dataset.id

        makeMove(cellId)

    }


    return {
        render() {

        },
        refresh() {

        },
        checkWin() {

        },
    }
})()

// console.log(Tests.testGridDraw())

const game = GameBoard();

