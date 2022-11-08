import { ChessColour, ChessPieceName, TileNeutrality } from "../utilities/enums";
import { GetMovesForRook, GetMovesForBishop, GetMovesForQueen, GetMovesForKing } from "./GetMovesForStandard";
import GetMovesForKnight from "./GetMovesForKnight";
import GetMovesForPawn from "./GetMovesForPawn";
import BoardPosition from "./BoardPosition";
import TileInfo from "./TileInfo";

export class MovementResult
{
    newPosition: BoardPosition;
    isEnemyPieceOnTile: boolean;

    constructor(newPosition: BoardPosition, isEnemyPieceOnTile: boolean)
    {
        this.newPosition = newPosition;
        this.isEnemyPieceOnTile = isEnemyPieceOnTile;
    }
}

export function IsMoveOnBoard(movePosition: BoardPosition):boolean
{
    if (movePosition.x < 0 || movePosition.x > 7) return false;
    if (movePosition.y < 0 || movePosition.y > 7) return false;
    return true;
}

export function GetTileNeutrality(tile:TileInfo, pieceColour: ChessColour):TileNeutrality
{
    if (tile.pieceOnTile.pieceName === ChessPieceName.None) return TileNeutrality.Empty;

    else if (pieceColour !== tile.pieceOnTile.pieceColour) return TileNeutrality.Hostile;
    else return TileNeutrality.Friendly;
}

export function CombinePositionWithOffset(initialPosition:BoardPosition, offset: BoardPosition):BoardPosition
{
    return new BoardPosition(initialPosition.x + offset.x, initialPosition.y + offset.y);
}

export default function GetMovesForPiece(tile:TileInfo, chessBoard:TileInfo[][]):TileInfo[][]
{
    const pieceName: ChessPieceName = tile.pieceOnTile.pieceName;
    const pieceColour: ChessColour = tile.pieceOnTile.pieceColour;

    switch(pieceName)
    {
        case ChessPieceName.Pawn:
            chessBoard = GetMovesForPawn(pieceColour, tile, chessBoard);
            break;

        case ChessPieceName.Knight:
            chessBoard = GetMovesForKnight(pieceColour, tile, chessBoard);
            break;

        case ChessPieceName.Rook:
            chessBoard = GetMovesForRook(pieceColour, tile, chessBoard);
            break;

        case ChessPieceName.Bishop:
            chessBoard = GetMovesForBishop(pieceColour, tile, chessBoard);
            break;

        case ChessPieceName.Queen:
            chessBoard = GetMovesForQueen(pieceColour, tile, chessBoard);
            break;

        case ChessPieceName.King:
            chessBoard = GetMovesForKing(pieceColour, tile, chessBoard);
            break;

        default:
            console.log(`Couldn't find piece! ${tile.pieceOnTile.pieceName}`);
            break;
    }
    
    return chessBoard;
}