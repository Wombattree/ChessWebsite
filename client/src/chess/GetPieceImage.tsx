import { ChessPieceName, ChessColour } from "../utilities/enums";
import { ChessPiece } from "./ChessPiece";

import blackPawn from "./assets/blackPawn.png";
import whitePawn from "./assets/whitePawn.png";
import blackKnight from "./assets/blackKnight.png";
import whiteKnight from "./assets/whiteKnight.png";
import blackBishop from "./assets/blackBishop.png";
import whiteBishop from "./assets/whiteBishop.png";
import blackRook from "./assets/blackRook.png";
import whiteRook from "./assets/whiteRook.png";
import blackQueen from "./assets/blackQueen.png";
import whiteQueen from "./assets/whiteQueen.png";
import blackKing from "./assets/blackKing.png";
import whiteKing from "./assets/whiteKing.png";

export function GetPieceImage(chessPiece:ChessPiece)
{
    switch(chessPiece.pieceName)
    {
        case ChessPieceName.Pawn:
            if (chessPiece.pieceColour === ChessColour.White) return whitePawn;
            else return blackPawn;

        case ChessPieceName.Knight:
            if (chessPiece.pieceColour === ChessColour.White) return whiteKnight;
            else return blackKnight;

        case ChessPieceName.Bishop:
            if (chessPiece.pieceColour === ChessColour.White) return whiteBishop;
            else return blackBishop;

        case ChessPieceName.Rook:
            if (chessPiece.pieceColour === ChessColour.White) return whiteRook;
            else return blackRook;

        case ChessPieceName.Queen:
            if (chessPiece.pieceColour === ChessColour.White) return whiteQueen;
            else return blackQueen;

        case ChessPieceName.King:
            if (chessPiece.pieceColour === ChessColour.White) return whiteKing;
            else return blackKing;
        default:
            console.log("No image found");
            return "";
    }
}