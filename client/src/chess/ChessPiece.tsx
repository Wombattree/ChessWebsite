import { ChessColour, ChessPieceName } from "../utilities/enums";

export class ChessPiece
{
    pieceName: ChessPieceName = ChessPieceName.None;
    pieceColour: ChessColour = ChessColour.None;

    constructor(pieceName: ChessPieceName, pieceColour: ChessColour)
    {
        this.pieceName = pieceName;
        this.pieceColour = pieceColour;
    }
}