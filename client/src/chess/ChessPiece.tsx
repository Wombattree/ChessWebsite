import { ChessColour, ChessPieceName } from "../utilities/enums";
import BoardPosition from "./BoardPosition";

export default class ChessPiece
{
    pieceName: ChessPieceName = ChessPieceName.None;
    pieceColour: ChessColour = ChessColour.None;
    hasMoved: boolean = false;
    movedTwoSpacesLastTurn: boolean = false;
    viableMoves: BoardPosition[] = [];

    constructor(pieceName: ChessPieceName, pieceColour: ChessColour)
    {
        this.pieceName = pieceName;
        this.pieceColour = pieceColour;
    }

    PieceMoved() { this.hasMoved = true; }
    PieceMovedTwoSpaces() { this.movedTwoSpacesLastTurn = true; }
    
    SetViableMoves(viableMoves: BoardPosition[]) { this.viableMoves = viableMoves; }
    ClearViableMoves() { this.viableMoves = []; }
}