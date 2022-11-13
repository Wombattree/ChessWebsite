import { ChessColour, ChessPieceType, BoardTileNeutrality } from "../utilities/enums";
import GetMoves from "./GetMovesForStandard";
import GetMovesForPawn from "./GetMovesForPawn";
import { BoardPosition, BoardTileData } from "./BoardClasses";
import { MovementInformation } from "./MovementClasses";
import ChessPiece from "./ChessPiece";

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

export function SetThreatenedTiles(piece: ChessPiece, chessBoard:BoardTileData[][])
{
    const pieceColour: ChessColour = piece.colour;
    const viableMoves: MovementInformation[] = piece.viableMoves;
    for (let i = 0; i < viableMoves.length; i++) 
    {
        if (viableMoves[i].GetIsMoveAttacking())
        {
            const movePosition: BoardPosition = viableMoves[i].newPosition;
            chessBoard[movePosition.x][movePosition.y].SetThreat(pieceColour);
        }
    }
}

// export function WouldMovePutYourKingInCheck(tileToMoveFrom: BoardTileData, moveToMake: MovementInformation): boolean
// {
//     let hypotheticalBoard = DeepCopyBoard(ChessData.GetChessBoard());//[...ChessData.GetChessBoard()];
//     const tileToMoveTo = hypotheticalBoard[moveToMake.newPosition.x][moveToMake.newPosition.y];
    
//     [hypotheticalBoard] = ChessMovementController.MovePiece(tileToMoveFrom.pieceOnTile, tileToMoveFrom, tileToMoveTo, hypotheticalBoard);

//     const king: BoardTileData | undefined = tileToMoveFrom.pieceOnTile.colour === ChessColour.White ? ChessController.GetKing(ChessColour.White, hypotheticalBoard) : ChessController.GetKing(ChessColour.Black, hypotheticalBoard);

//     if (king)
//     {
//         const kingStatus = CheckKingStatus(king.pieceOnTile.colour, king);
//         if (kingStatus === KingStatus.Check) return true;
//         else return false;
//     }

//     return true;
// }

// function DeepCopyBoard(originalBoard: BoardTileData[][]): BoardTileData[][]
// {
//     const chessBoardCopy: BoardTileData[][] = [[],[],[],[],[],[],[],[]];

//     for (let x = 0; x < 8; x++) {
//         for (let y = 0; y < 8; y++) 
//         {
//             const boardTileOriginal = originalBoard[x][y];
//             const boardTileCopy = new BoardTileData(new BoardPosition(x, y));

//             const pieceOnTileOriginal = boardTileOriginal.pieceOnTile;
//             const pieceOnTileCopy = new ChessPiece(pieceOnTileOriginal.type, pieceOnTileOriginal.colour);
//             pieceOnTileCopy.hasMoved = pieceOnTileOriginal.hasMoved;
//             pieceOnTileCopy.hasPawnMovedTwoSpacesLastTurn = pieceOnTileOriginal.hasPawnMovedTwoSpacesLastTurn;

//             boardTileCopy.pieceOnTile = pieceOnTileCopy;

//             chessBoardCopy[x][y] = boardTileCopy;
//         }
//     }

//     return chessBoardCopy;
// }

export default function GetMovesForPiece(tile:BoardTileData, chessBoard: BoardTileData[][]):MovementInformation[]
{
    //const chessBoard: BoardTileData[][] = chessBoard ? chessBoard : ChessData.GetChessBoard();
    const pieceType: ChessPieceType = tile.pieceOnTile.type;
    const pieceColour: ChessColour = tile.pieceOnTile.colour;
    let viableMoves: MovementInformation[] = [];

    switch(pieceType)
    {
        case ChessPieceType.Pawn:
            viableMoves = GetMovesForPawn(pieceColour, tile, chessBoard);
            break;

        case ChessPieceType.Knight:
            viableMoves = GetMoves.GetMovesForKnight(pieceColour, tile, chessBoard);
            break;

        case ChessPieceType.Rook:
            viableMoves = GetMoves.GetMovesForRook(pieceColour, tile, chessBoard);
            break;

        case ChessPieceType.Bishop:
            viableMoves = GetMoves.GetMovesForBishop(pieceColour, tile, chessBoard);
            break;

        case ChessPieceType.Queen:
            viableMoves = GetMoves.GetMovesForQueen(pieceColour, tile, chessBoard);
            break;

        case ChessPieceType.King:
            viableMoves = GetMoves.GetMovesForKing(pieceColour, tile, chessBoard);
            break;

        default:
            console.log(`Couldn't find piece! ${tile.pieceOnTile.type}`);
            break;
    }

    return viableMoves;
}