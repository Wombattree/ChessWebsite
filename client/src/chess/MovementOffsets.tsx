import BoardPosition from "./BoardPosition";

export const up: BoardPosition = new BoardPosition(-1, 0);
export const down: BoardPosition = new BoardPosition(+1, 0);
export const left: BoardPosition = new BoardPosition(0, -1);
export const right: BoardPosition = new BoardPosition(0, +1);

export const upLeft: BoardPosition = new BoardPosition(-1, -1);
export const upRight: BoardPosition = new BoardPosition(-1, +1);
export const downLeft: BoardPosition = new BoardPosition(+1, -1);
export const downRight: BoardPosition = new BoardPosition(+1, +1);