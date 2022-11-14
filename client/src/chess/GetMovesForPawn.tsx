import GetMovesForPiece from "./GetMovesForPiece";
import { ChessColour, BoardTileNeutrality } from "../utilities/enums";
import MovementOffsets from "./MovementOffsets";
import { BoardPosition, BoardTileData } from "./BoardClasses";
import { MovementInformation } from "./MovementClasses";

export default class GetMovesForPawn
{
    static TryMovePawnForward(currentPosition: BoardPosition, movementOffset: BoardPosition, pieceColour: ChessColour, spacesToMove: number, chessBoard:BoardTileData[][]):MovementInformation | null
    {
        const positionToMoveTo: BoardPosition = new BoardPosition(currentPosition.x + movementOffset.x * spacesToMove, currentPosition.y);
        if (GetMovesForPiece.IsMoveOnBoard(positionToMoveTo) === false) return null;

        const tileToMoveTo: BoardTileData = chessBoard[positionToMoveTo.x][positionToMoveTo.y];
        if (GetMovesForPiece.GetTileNeutrality(tileToMoveTo, pieceColour) !== BoardTileNeutrality.Empty) return null;
        
        const move = new MovementInformation(positionToMoveTo, false);
        move.MoveIsNotAttacking();
        return move;
    }

    static TryMovePawnDiagonal(currentPosition: BoardPosition, movementOffset: BoardPosition, movementOffsetSide: BoardPosition, pieceColour: ChessColour, chessBoard:BoardTileData[][]):MovementInformation | null
    {
        const positionToMoveToDiagonal: BoardPosition = GetMovesForPiece.CombinePositionWithOffset(currentPosition, movementOffset);
        if (GetMovesForPiece.IsMoveOnBoard(positionToMoveToDiagonal) === false) return null;

        const tileToMoveTo: BoardTileData = chessBoard[positionToMoveToDiagonal.x][positionToMoveToDiagonal.y];
        const tileNeutrality = GetMovesForPiece.GetTileNeutrality(tileToMoveTo, pieceColour);

        if (tileNeutrality === BoardTileNeutrality.Friendly) return null;
        if (tileNeutrality !== BoardTileNeutrality.Hostile)
        {
            //En passant
            const positionToMoveToSide: BoardPosition = GetMovesForPiece.CombinePositionWithOffset(currentPosition, movementOffsetSide);
            const tileToSide: BoardTileData = chessBoard[positionToMoveToSide.x][positionToMoveToSide.y];

            if (GetMovesForPiece.GetTileNeutrality(tileToSide, pieceColour) !== BoardTileNeutrality.Hostile) return null;
            if (tileToSide.pieceOnTile.hasPawnMovedTwoSpacesLastTurn === false) return null;
            
            const movementInformation = new MovementInformation(positionToMoveToDiagonal, true);
            movementInformation.MoveIsEnPassant(tileToSide.position);

            return movementInformation;
        }
        return new MovementInformation(positionToMoveToDiagonal, true);
    }

    static GetMovesForPawn(pieceColour: ChessColour, tile:BoardTileData, chessBoard:BoardTileData[][]):MovementInformation[]
    {
        const maxDistanceForward: number = tile.pieceOnTile.hasMoved ? 1 : 2;
        const viableMoves: MovementInformation[] = [];
            
        for (let i = 1; i <= maxDistanceForward; i++)
        {
            let movementResult = this.TryMovePawnForward(tile.position, (pieceColour === ChessColour.White) ? MovementOffsets.up : MovementOffsets.down, pieceColour, i, chessBoard);
            if (movementResult)
            {
                if (i === 2) movementResult.MoveIsPawnMovingTwoSpaces();

                movementResult = this.ShouldPawnBePromoted(pieceColour, movementResult.newPosition, movementResult);
                if (movementResult) 
                {
                    viableMoves.push(movementResult);
                    if (movementResult.isEnemyPieceOnTile) break;
                }
                else break;
            }
            else break;
        }

        let movementResultDiagonalLeft = this.TryMovePawnDiagonal(tile.position, (pieceColour === ChessColour.White) ? MovementOffsets.upLeft : MovementOffsets.downLeft, MovementOffsets.left, pieceColour, chessBoard);
        if (movementResultDiagonalLeft) 
        {
            movementResultDiagonalLeft = this.ShouldPawnBePromoted(pieceColour, movementResultDiagonalLeft.newPosition, movementResultDiagonalLeft);
            if (movementResultDiagonalLeft) viableMoves.push(movementResultDiagonalLeft);
        }

        let movementResultDiagonalRight = this.TryMovePawnDiagonal(tile.position, (pieceColour === ChessColour.White) ? MovementOffsets.upRight : MovementOffsets.downRight, MovementOffsets.right, pieceColour, chessBoard);
        if (movementResultDiagonalRight) 
        {
            movementResultDiagonalRight = this.ShouldPawnBePromoted(pieceColour, movementResultDiagonalRight.newPosition, movementResultDiagonalRight);
            if (movementResultDiagonalRight) viableMoves.push(movementResultDiagonalRight);
        }

        return viableMoves;
    }

    private static ShouldPawnBePromoted(pieceColour: ChessColour, tile:BoardPosition, move: MovementInformation): MovementInformation | null
    {
        if ((pieceColour === ChessColour.White && tile.x === 0) || (pieceColour === ChessColour.Black && tile.x === 7)) move.MoveIsPromotion();
        return move;
    }
}