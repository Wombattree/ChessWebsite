import { ChessColour, ChessPieceName } from "../utilities/enums";
//import ChessPiece from "ChessWebsite/client/src/chess/ChessPiece"
import { ChessPiece } from "./ChessPiece";

export class BoardTileInfo
{
    xPosition: number;
    yPosition: number;
    pieceOnTile: ChessPiece = new ChessPiece(ChessPieceName.None, ChessColour.None);

    constructor(xPosition: number, yPosition: number)
    {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
    }

    SetPieceOnTile(pieceOnTile: ChessPiece)
    {
        this.pieceOnTile = pieceOnTile;
    }

    GetTileColour():ChessColour
    {
        if (this.xPosition % 2 === 0)
        {
            return (this.yPosition % 2 === 0 ? ChessColour.White : ChessColour.Black);
        }
        else return (this.yPosition % 2 === 0 ? ChessColour.Black : ChessColour.White);
    }
}