import { ChessColour, ChessPieceType, BoardTileNeutrality } from "../utilities/enums";
import GetMovesForStandardPieces from "./GetMovesForStandardPieces";
import GetMovesForPawn from "./GetMovesForPawn";
import { BoardPosition, BoardTileData } from "./BoardClasses";
import { MovementInformation } from "./MovementClasses";
import ChessPiece from "./ChessPiece";
import GetMovesForKing from "./GetMovesForKing";

export default class GetMovesForPiece
{
    static GetMovesForStandard(offsets: BoardPosition[], maxMovement: number, pieceColour: ChessColour, tile:BoardTileData, chessBoard:BoardTileData[][]):MovementInformation[]
    {
        const viableMoves: MovementInformation[] = [];

        for (let i = 0; i < offsets.length; i++) {
            for (let j = 1; j <= maxMovement; j++)
            {
                let movementResult = this.TryMove(tile.position, offsets[i], pieceColour, j, chessBoard);
                if (movementResult)
                {
                    viableMoves.push(movementResult);
                    if (movementResult.isEnemyPieceOnTile) break;
                }
                else break;
            }
        }

        return viableMoves;
    }

    static TryMove(currentPosition: BoardPosition, movementOffset: BoardPosition, pieceColour: ChessColour, spacesToMove: number, chessBoard:BoardTileData[][]):MovementInformation | null
    {
        const movementOffsetWithDistance = new BoardPosition(movementOffset.x * spacesToMove, movementOffset.y * spacesToMove);
        const positionToMoveTo: BoardPosition = this.CombinePositionWithOffset(currentPosition, movementOffsetWithDistance);

        if (this.IsMoveOnBoard(positionToMoveTo) === false) return null;
        const tileToMoveTo: BoardTileData = chessBoard[positionToMoveTo.x][positionToMoveTo.y];
    
        if (this.GetTileNeutrality(tileToMoveTo, pieceColour) === BoardTileNeutrality.Friendly) return null;
        if (this.GetTileNeutrality(tileToMoveTo, pieceColour) === BoardTileNeutrality.Hostile) return new MovementInformation(positionToMoveTo, true);

        return new MovementInformation(positionToMoveTo, false);
    }

    static IsMoveOnBoard(movePosition: BoardPosition):boolean
    {
        if (movePosition.x < 0 || movePosition.x > 7) return false;
        if (movePosition.y < 0 || movePosition.y > 7) return false;
        return true;
    }

    static GetTileNeutrality(tile:BoardTileData, pieceColour: ChessColour):BoardTileNeutrality
    {
        if (tile.pieceOnTile.type === ChessPieceType.None) return BoardTileNeutrality.Empty;

        else if (pieceColour !== tile.pieceOnTile.colour) return BoardTileNeutrality.Hostile;
        else return BoardTileNeutrality.Friendly;
    }

    static CombinePositionWithOffset(initialPosition:BoardPosition, offset: BoardPosition):BoardPosition
    {
        return new BoardPosition(initialPosition.x + offset.x, initialPosition.y + offset.y);
    }

    static SetThreatenedTiles(piece: ChessPiece, chessBoard:BoardTileData[][])
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

    static GetMoves(tile:BoardTileData, chessBoard: BoardTileData[][]):MovementInformation[]
    {
        const pieceType: ChessPieceType = tile.pieceOnTile.type;
        const pieceColour: ChessColour = tile.pieceOnTile.colour;
        let viableMoves: MovementInformation[] = [];

        switch(pieceType)
        {
            case ChessPieceType.Pawn:
                viableMoves = GetMovesForPawn.GetMovesForPawn(pieceColour, tile, chessBoard);
                break;

            case ChessPieceType.Knight:
                viableMoves = GetMovesForStandardPieces.GetMovesForKnight(pieceColour, tile, chessBoard);
                break;

            case ChessPieceType.Rook:
                viableMoves = GetMovesForStandardPieces.GetMovesForRook(pieceColour, tile, chessBoard);
                break;

            case ChessPieceType.Bishop:
                viableMoves = GetMovesForStandardPieces.GetMovesForBishop(pieceColour, tile, chessBoard);
                break;

            case ChessPieceType.Queen:
                viableMoves = GetMovesForStandardPieces.GetMovesForQueen(pieceColour, tile, chessBoard);
                break;

            case ChessPieceType.King:
                viableMoves = GetMovesForKing.GetMovesForKing(pieceColour, tile, chessBoard);
                break;

            default:
                console.log(`Couldn't find piece! ${tile.pieceOnTile.type}`);
                break;
        }

        return viableMoves;
    }
    
}