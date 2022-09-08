let grid = document.querySelector('.game-grid')

const Player = (function () {
    const makeMove = function (slotIndex) {

    }

    return {makeMove}
})

const GameBoard = (function () {

    let board = [[null, null, null], [null, null, null], [null, null, null]]

    const players = []
    players.push(Player(), Player())

    const playerMarks = new WeakMap()
    playerMarks.set(players[0], 1)
    playerMarks.set(players[1], 0)

    let currentPlayer = players[0];

    const gameGrid = document.querySelector('.game-grid')
    gameGrid.addEventListener('click', handleClick)

    const restart = document.querySelector('#restart-btn')
    restart.addEventListener('click', restartGame)

    initialRender();

    function convertMarkToSymbol(value) {
        switch (value) {
            case 1:
                return 'x'
            case 0:
                return 'o'
            case null:
                return ''
        }
    }

    function initialRender() {
        let id = 0;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                let div = document.createElement('div')
                div.classList.add('element')
                div.textContent = convertMarkToSymbol(board[i][j])
                div.dataset.id = (id).toString()
                grid.append(div)
                id++;
            }
        }
    }

    function render() {
        for (let i = 0; i < board.length; i++)
            for (let j = 0; j < board[i].length; j++) {
                const cellID = getCellIDFromIndexes(i, j, board.length)
                const element = document.querySelector(`.element[data-id="${cellID}"]`)
                element.textContent = convertMarkToSymbol(board[i][j])
            }
    }

    function getNextPlayer() {
        const notCurrentPlayers = players.filter(el => currentPlayer !== el)
        return notCurrentPlayers[0]
    }

    function getPlayersMark(player) {
        return playerMarks.get(currentPlayer)
    }

    function restartGame() {
        board.forEach(line => line.fill(null))
        currentPlayer = players[0]
        render()
    }

    function removeModal() {
        const modal = document.querySelector('#win-modal')
        modal.ontransitionend = () => {
            modal.remove()
        }
        setTimeout(() => {
            modal.dataset.hidden = "true"
        }, 0)
    }

    function showModal(result) {
        function renderModal() {
            const template = document.querySelector('#modal-template')
            const modTemplate = template.content.cloneNode(true)
            grid.after(modTemplate)
        }

        renderModal()
        const modal = document.querySelector('#win-modal')
        const winText = modal.querySelector('.winText')
        switch (result) {
            case 'win':
                winText.textContent = 'Winner'
                break
            case 'tie':
                winText.textContent = 'Tie'
                break
        }
        const username = modal.querySelector('.userName')
        username.textContent = convertMarkToSymbol(getPlayersMark(currentPlayer))

        const restart = modal.querySelector('button')
        restart.addEventListener('click', restartAfterEndHandler)
        setTimeout(() => {
            modal.dataset.hidden = 'false'
        }, 0)

        const modalBG = document.querySelector('#modal-bg-fill')
        modalBG.addEventListener('click', () => {
            setTimeout(() => {
                modalBG.dataset.hidden = 'true'
            }, 0)
            modalBG.ontransitionend = () => {
                modalBG.remove()
                restartGame()
            }
        })
    }

    function restartAfterEndHandler(event) {
        restartGame()
        removeModal()
    }

    function checkWin(board) {
        const horizontalWin = (() => {
            for (let line of board) {
                const mem = line[0]
                if (mem === null) continue
                if (line.every(el => el === mem)) return true
            }
            return false
        })()
        const verticalWin = (() => {
            for (let i = 0; i < board[0].length; i++) {
                let line = []
                for (let j = 0; j < board.length; j++) line.push(board[j][i])

                const mem = line[0]
                if (mem === null) continue
                if (line.every(el => el === mem)) return true
            }
            return false
        })()
        const diagonalWin = (() => {
            const {diagLeft, diagRight} = (() => {
                const diagLeft = []
                const diagRight = []

                for (let i = 0; i < board.length; i++) {
                    for (let j = 0; j < board[i].length; j++) {
                        if (i === j) diagLeft.push(board[i][j])
                        if (i + j === board.length - 1) diagRight.push(board[i][j])
                    }
                }
                return {diagLeft, diagRight}
            })()

            const rightCorner = board[0][board[0].length - 1]
            const leftCorner = board[0][0]

            if (rightCorner === null && leftCorner === null) return false

            let rCorrect = false
            let lCorrect = false
            if (rightCorner !==null)
                rCorrect = diagLeft.every(el => el === rightCorner)
            if (leftCorner !==null)
                lCorrect = diagLeft.every(el => el === leftCorner)
            return rCorrect || lCorrect
        })()

        return verticalWin || horizontalWin || diagonalWin
    }

    function anyMovesLeft(board){
        for (let line of board)
            for (let el of line)
                if (el === null){
                    return true
                }
        return false
    }

    function getIndexesFromCellID(cellId) {
        const row = cellId % 3
        const col = Math.floor(cellId / 3)
        return {row, col}
    }

    function getCellIDFromIndexes(i, j, size) {
        return i * (size) + j
    }

    const makeMove = function (cellId) {

        const {row, col} = getIndexesFromCellID(cellId)

        const mark = getPlayersMark(currentPlayer)
        board[row][col] = mark

        const markerForHTML = convertMarkToSymbol(mark)
        const cell = grid.querySelector(`.element[data-id="${cellId}"]`)
        cell.textContent = markerForHTML

        if (checkWin(board)) {
            showModal('win')
            return;
        }
        if (!anyMovesLeft(board)){
            showModal('tie')
            return;
        }

        currentPlayer = getNextPlayer()
    }

    function handleClick(event) {
        const cell = event.target.closest('.element')
        const cellId = cell.dataset.id
        makeMove(cellId)
    }

    return {checkWin, getCellIDFromIndexes, anyMovesLeft}
})()

function test() {
    let board = [
        [0, null, null],
        [null, 0, null],
        [null, null, 0]]
    console.assert(GameBoard.checkWin(board))
    // console.assert(GameBoard.getCellIDFromIndexes(1, 2, 3) === 5)
    // console.assert(GameBoard.getCellIDFromIndexes(1, 1, 3) === 4)
    // board = [
    //     [1, 0, 0],
    //     [1, 0, 1],
    //     [0, 1, 1]]
    // console.assert(!GameBoard.anyMovesLeft(board))
}

test()