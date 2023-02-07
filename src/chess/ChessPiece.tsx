import { ChessColour, ChessPieceType } from "../utilities/enums";
import { MovementInformation } from "./MovementClasses";

export default class ChessPiece
{
    private _pieceType: ChessPieceType = ChessPieceType.None;
    private _pieceColour: ChessColour = ChessColour.None;

    private _hasMoved: boolean = false;
    private _pawnMovedTwoSpacesLastTurn: boolean = false;
    private _viableMoves: MovementInformation[] = [];

    constructor(pieceName: ChessPieceType, pieceColour: ChessColour)
    {
        this._pieceType = pieceName;
        this._pieceColour = pieceColour;
    }

    get type(): ChessPieceType { return this._pieceType; }
    set type(value: ChessPieceType) { this._pieceType = value; }

    get colour(): ChessColour { return this._pieceColour; }
    set colour(value: ChessColour) { this._pieceColour = value; }

    get hasMoved(): boolean { return this._hasMoved; }
    set hasMoved(hasMoved: boolean) { this._hasMoved = hasMoved; }

    get hasPawnMovedTwoSpacesLastTurn(): boolean { return this._pawnMovedTwoSpacesLastTurn; }
    set hasPawnMovedTwoSpacesLastTurn(hasMoved: boolean) { this._pawnMovedTwoSpacesLastTurn = hasMoved; }
    
    set viableMoves(viableMoves: MovementInformation[]) { this._viableMoves = viableMoves; }
    get viableMoves():MovementInformation[] { return this._viableMoves; }
    ClearViableMoves() { this._viableMoves = []; }
}