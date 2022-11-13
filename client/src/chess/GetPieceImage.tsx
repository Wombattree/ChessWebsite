import { ChessPieceType, ChessColour } from "../utilities/enums";
import ChessPiece from "./ChessPiece";

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

export default function GetPieceImage(chessPiece:ChessPiece)
{
    const type = chessPiece.type;
    const colour = chessPiece.colour;
    switch(type)
    {
        case ChessPieceType.Pawn:
            if (colour === ChessColour.White) return whitePawn;
            else return blackPawn;

        case ChessPieceType.Knight:
            if (colour === ChessColour.White) return whiteKnight;
            else return blackKnight;

        case ChessPieceType.Bishop:
            if (colour === ChessColour.White) return whiteBishop;
            else return blackBishop;

        case ChessPieceType.Rook:
            if (colour === ChessColour.White) return whiteRook;
            else return blackRook;

        case ChessPieceType.Queen:
            if (colour === ChessColour.White) return whiteQueen;
            else return blackQueen;

        case ChessPieceType.King:
            if (colour === ChessColour.White) return whiteKing;
            else return blackKing;
        default:
            console.log("No image found");
            return "";
    }
}