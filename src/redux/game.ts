import { GameStates } from "../GameStates";
import { Board, ITile } from "../ITile";
import { SIZE } from "../consts";

export interface IGame {
    state: GameStates;
    round: number;
    deaths: number;
    board: Board;
}

function getNeighbors(row: number, col: number, board: Board): ITile[] {
    return [
        [row - 1, col - 1], [row - 1, col], [row - 1, col + 1],
        [row, col - 1], [row, col], [row, col + 1],
        [row + 1, col - 1], [row + 1, col], [row + 1, col + 1]
    ]
        .filter(position => position[0] >= 0 && position[0] < SIZE && position[1] >= 0 && position[1] < SIZE)
        .map(position => board[position[0]][position[1]]);
}

export function createBoard(size: number): Board {
    const board: Board = [];
    for (let row = 0; row < size; row++) {
        const rowArray = [];
        for (let col = 0; col < size; col++) {
            rowArray.push({
                row,
                col,
                isFlipped: false,
                hasMine: Math.random() < 0.1,
                neighbourMineCount: 0,
                hasFlag: false
            } as ITile);
        }
        board.push(rowArray);
    }
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const neighbors = getNeighbors(row, col, board);
            board[row][col].neighbourMineCount = neighbors.filter(neighbor => neighbor.hasMine).length;
        }
    }
    return board;
}

export function avalancheFlip(tile: ITile, board: Board) {
    if (!tile.isFlipped) {
        tile.isFlipped = true;
        if (tile.neighbourMineCount === 0) {
            getNeighbors(tile.row, tile.col, board)
                .forEach(neighbor => avalancheFlip(neighbor, board));
        }
    }
}

export function isVictorious(board: Board): boolean {
    return board.flat().filter(tile => !tile.hasMine && !tile.isFlipped).length === 0;
}

export function createNewGame(): IGame {
    return {
        state: GameStates.READY,
        round: 1,
        board: createBoard(SIZE),
        deaths: 0
    };
};