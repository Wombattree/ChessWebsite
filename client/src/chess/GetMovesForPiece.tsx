import { ChessColour, ChessPieceType, BoardTileNeutrality, KingStatus } from "../utilities/enums";
import { GetMovesForRook, GetMovesForBishop, GetMovesForQueen, GetMovesForKing, GetMovesForKnight } from "./GetMovesForStandard";
import GetMovesForPawn from "./GetMovesForPawn";
import { BoardPosition, BoardTileData } from "./BoardClasses";
import { ChessData } from "./InformationClasses";
import { MovementInformation } from "./MovementClasses";
import ChessPiece from "./ChessPiece";
import { ChessMovementController } from "./ChessMovementController";
import { ChessController } from "./ChessController";
import { CheckKingStatus } from "./CheckKingStatus";

export function IsMoveOnBoard(movePosition: BoardPosition):boolean
{
    if (movePosition.x < 0 || movePosition.x > 7) return false;
    if (movePosition.y < 0 || movePosition.y > 7) return false;
    return true;
}

export function GetTileNeutrality(tile:BoardTileData, pieceColour: ChessColour):BoardTileNeutrality
{
    if (tile.pieceOnTile.type === ChessPieceType.None) return BoardTileNeutrality.Empty;

    else if (pieceColour !== tile.pieceOnTile.colour) return BoardTileNeutrality.Hostile;
    else return BoardTileNeutrality.Friendly;
}

export function CombinePositionWithOffset(initialPosition:BoardPosition, offset: BoardPosition):BoardPosition
{
    return new BoardPosition(initialPosition.x + offset.x, initialPosition.y + offset.y);
}

export function SetThreatenedTiles(piece: ChessPiece):BoardTileData[][]
{
    const chessBoard:BoardTileData[][] = ChessData.GetChessBoard();
    const pieceColour: ChessColour = piece.colour;
    const viableMoves: MovementInformation[] = piece.viableMoves;
    for (let i = 0; i < viableMoves.length; i++) 
    {
        if (viableMoves[i].GetIsMoveCastling() === false)
        {
            const movePosition: BoardPosition = viableMoves[i].newPosition;
            chessBoard[movePosition.x][movePosition.y].SetThreat(pieceColour);
        }
    }
    return chessBoard;
}

export function WouldMovePutYourKingInCheck(tileToMoveFrom: BoardTileData, moveToMake: MovementInformation): boolean
{
    let hypotheticalBoard = DeepCopyBoard(ChessData.GetChessBoard());//[...ChessData.GetChessBoard()];
    const tileToMoveTo = hypotheticalBoard[moveToMake.newPosition.x][moveToMake.newPosition.y];
    
    [hypotheticalBoard] = ChessMovementController.MovePiece(tileToMoveFrom.pieceOnTile, tileToMoveFrom, tileToMoveTo, hypotheticalBoard);

    const king: BoardTileData | undefined = tileToMoveFrom.pieceOnTile.colour === ChessColour.White ? ChessController.GetKing(ChessColour.White, hypotheticalBoard) : ChessController.GetKing(ChessColour.Black, hypotheticalBoard);

    if (king)
    {
        const kingStatus = CheckKingStatus(king.pieceOnTile.colour, king);
        if (kingStatus === KingStatus.Check) return true;
        else return false;
    }

    return true;
}

function DeepCopyBoard(originalBoard: BoardTileData[][]): BoardTileData[][]
{
    const chessBoardCopy: BoardTileData[][] = [[],[],[],[],[],[],[],[]];

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) 
        {
            const boardTileOriginal = originalBoard[x][y];
            const boardTileCopy = new BoardTileData(new BoardPosition(x, y));

            const pieceOnTileOriginal = boardTileOriginal.pieceOnTile;
            const pieceOnTileCopy = new ChessPiece(pieceOnTileOriginal.type, pieceOnTileOriginal.colour);
            pieceOnTileCopy.hasMoved = pieceOnTileOriginal.hasMoved;
            pieceOnTileCopy.hasPawnMovedTwoSpacesLastTurn = pieceOnTileOriginal.hasPawnMovedTwoSpacesLastTurn;

            boardTileCopy.pieceOnTile = pieceOnTileCopy;

            chessBoardCopy[x][y] = boardTileCopy;
        }
    }

    return chessBoardCopy;
}

export default function GetMovesForPiece(tile:BoardTileData):MovementInformation[]
{
    const chessBoard: BoardTileData[][] = ChessData.GetChessBoard();
    const pieceType: ChessPieceType = tile.pieceOnTile.type;
    const pieceColour: ChessColour = tile.pieceOnTile.colour;
    let viableMoves: MovementInformation[] = [];

    switch(pieceType)
    {
        case ChessPieceType.Pawn:
            viableMoves = GetMovesForPawn(pieceColour, tile, chessBoard);
            break;

        case ChessPieceType.Knight:
            viableMoves = GetMovesForKnight(pieceColour, tile, chessBoard);
            break;

        case ChessPieceType.Rook:
            viableMoves = GetMovesForRook(pieceColour, tile, chessBoard);
            break;

        case ChessPieceType.Bishop:
            viableMoves = GetMovesForBishop(pieceColour, tile, chessBoard);
            break;

        case ChessPieceType.Queen:
            viableMoves = GetMovesForQueen(pieceColour, tile, chessBoard);
            break;

        case ChessPieceType.King:
            viableMoves = GetMovesForKing(pieceColour, tile, chessBoard);
            break;

        default:
            console.log(`Couldn't find piece! ${tile.pieceOnTile.type}`);
            break;
    }

    return viableMoves;
}