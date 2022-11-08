import { ChessColour, ChessPieceName } from "../utilities/enums";

export default class ChessPiece
{
    pieceName: ChessPieceName = ChessPieceName.None;
    pieceColour: ChessColour = ChessColour.None;
    hasMoved: boolean = false;
    hasMovedTwoSpaces: boolean = false;

    constructor(pieceName: ChessPieceName, pieceColour: ChessColour)
    {
        this.pieceName = pieceName;
        this.pieceColour = pieceColour;
    }

    PieceMoved() { this.hasMoved = true; }
    PieceMovedTwoSpaces() { this.hasMovedTwoSpaces = true; }
}