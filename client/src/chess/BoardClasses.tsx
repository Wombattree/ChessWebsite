import { ChessColour, ChessPieceType, BoardTileState } from "../utilities/enums";
import ChessPiece from "./ChessPiece";

export class BoardTileData
{
    private readonly _position: BoardPosition;
    private _tileState: BoardTileState = BoardTileState.None;
    private _tileColour: ChessColour;
    private _pieceOnTile: ChessPiece = new ChessPiece(ChessPieceType.None, ChessColour.None);
    private _threatenedByWhite: boolean = false;
    private _threatenedByBlack: boolean = false;

    constructor(position: BoardPosition)
    {
        this._position = position;
        this._tileColour = BoardTileData.GetTileColour(this._position);
    }

    get position(): BoardPosition { return this._position; }

    get tileState(): BoardTileState { return this._tileState; }
    set tileState(value: BoardTileState) { this._tileState = value; }

    get tileColour(): ChessColour { return this._tileColour; }
    set tileColour(value: ChessColour) { this._tileColour = value; }

    get pieceOnTile(): ChessPiece { return this._pieceOnTile; }
    set pieceOnTile(value: ChessPiece) { this._pieceOnTile = value; }

    GetThreat(colour: ChessColour): boolean
    {
        if (colour === ChessColour.White) return this._threatenedByWhite;
        else return this._threatenedByBlack;
    }
    SetThreat(colour: ChessColour)
    {
        if (colour === ChessColour.White) this._threatenedByWhite = true;
        else this._threatenedByBlack = true;
    }
    ClearThreat()
    {
        this._threatenedByWhite = false;
        this._threatenedByBlack = false;
    }

    static GetTileColour(position: BoardPosition):ChessColour
    {
        if (position.x % 2 === 0) return (position.y % 2 === 0 ? ChessColour.White : ChessColour.Black);
        else return (position.y % 2 === 0 ? ChessColour.Black : ChessColour.White);
    }

    ClearTile() { this.pieceOnTile = new ChessPiece(ChessPieceType.None, ChessColour.None ); }
}

export class BoardPosition
{   
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }
}