import { ChessColour, ChessPieceName, TileState } from "../utilities/enums";
import BoardPosition from "./BoardPosition";
import ChessPiece from "./ChessPiece";

export default class TileInfo
{
    position: BoardPosition;
    tileState: TileState = TileState.None;
    pieceOnTile: ChessPiece = new ChessPiece(ChessPieceName.None, ChessColour.None);

    constructor(position: BoardPosition)
    {
        this.position = position;
    }

    SetPieceOnTile(pieceOnTile: ChessPiece)
    {
        this.pieceOnTile = pieceOnTile;
    }

    SetTileState(tileState: TileState)
    {
        this.tileState = tileState;
    }

    GetTileColour():ChessColour
    {
        if (this.position.x % 2 === 0)
        {
            return (this.position.y % 2 === 0 ? ChessColour.White : ChessColour.Black);
        }
        else return (this.position.y % 2 === 0 ? ChessColour.Black : ChessColour.White);
    }
}