export interface ITile {
    row: number;
    col: number;
    isFlipped: boolean;
    hasMine: boolean;
    hasFlag: boolean;
    neighbourMineCount: number;
}

export type Board = ITile[][];