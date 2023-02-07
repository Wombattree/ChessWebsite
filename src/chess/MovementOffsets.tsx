import { BoardPosition } from "./BoardClasses";

export default class MovementOffsets
{
    static readonly up: BoardPosition = new BoardPosition(-1, 0);
    static readonly down: BoardPosition = new BoardPosition(+1, 0);
    static readonly left: BoardPosition = new BoardPosition(0, -1);
    static readonly right: BoardPosition = new BoardPosition(0, +1);

    static readonly upLeft: BoardPosition = new BoardPosition(-1, -1);
    static readonly upRight: BoardPosition = new BoardPosition(-1, +1);
    static readonly downLeft: BoardPosition = new BoardPosition(+1, -1);
    static readonly downRight: BoardPosition = new BoardPosition(+1, +1);

    static readonly knightUpLeft: BoardPosition = new BoardPosition(-2, -1);
    static readonly knightUpRight: BoardPosition = new BoardPosition(-2, +1);
    static readonly knightDownLeft: BoardPosition = new BoardPosition(+2, -1);
    static readonly knightDownRight: BoardPosition = new BoardPosition(+2, +1);

    static readonly knightLeftUp: BoardPosition = new BoardPosition(-1, -2);
    static readonly knightRightUp: BoardPosition = new BoardPosition(-1, +2);
    static readonly knightLeftDown: BoardPosition = new BoardPosition(+1, -2);
    static readonly knightRightDown: BoardPosition = new BoardPosition(+1, +2);

    static GetCardinalOffsets():BoardPosition[]
    {
        return [
            MovementOffsets.up,
            MovementOffsets.down,
            MovementOffsets.left,
            MovementOffsets.right,
        ]
    }

    static GetDiagonalOffsets():BoardPosition[]
    {
        return [
            MovementOffsets.upLeft,
            MovementOffsets.upRight,
            MovementOffsets.downLeft,
            MovementOffsets.downRight,
        ]
    }

    static GetCardinalAndDiagonalOffsets():BoardPosition[]
    {
        return [
            ...MovementOffsets.GetCardinalOffsets(),
            ...MovementOffsets.GetDiagonalOffsets()
        ]
    }

    static GetKnightOffsets():BoardPosition[]
    {
        return [
            MovementOffsets.knightUpLeft, 
            MovementOffsets.knightUpRight, 
            MovementOffsets.knightDownLeft, 
            MovementOffsets.knightDownRight, 
            MovementOffsets.knightLeftUp, 
            MovementOffsets.knightRightUp, 
            MovementOffsets.knightLeftDown, 
            MovementOffsets.knightRightDown
        ];
    }
}