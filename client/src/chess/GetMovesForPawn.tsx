import { IsMoveOnBoard, GetTileNeutrality, CombinePositionWithOffset } from "./GetMovesForPiece";
import { ChessColour, BoardTileNeutrality } from "../utilities/enums";
import MovementOffsets from "./MovementOffsets";
import { BoardPosition, BoardTileData } from "./BoardClasses";
import { MovementInformation } from "./MovementClasses";

function TryMoveForward(currentPosition: BoardPosition, movementOffset: BoardPosition, pieceColour: ChessColour, spacesToMove: number, chessBoard:BoardTileData[][]):MovementInformation | null
{
    const positionToMoveTo: BoardPosition = new BoardPosition(currentPosition.x + movementOffset.x * spacesToMove, currentPosition.y);
    if (IsMoveOnBoard(positionToMoveTo) === false) return null;

    const tileToMoveTo: BoardTileData = chessBoard[positionToMoveTo.x][positionToMoveTo.y];
    if (GetTileNeutrality(tileToMoveTo, pieceColour) !== BoardTileNeutrality.Empty) return null;
    
    const move = new MovementInformation(positionToMoveTo, false);
    move.MoveIsNotAttacking();
    return move;
}

function TryMoveDiagonal(currentPosition: BoardPosition, movementOffsetDiagonal: BoardPosition, movementOffsetSide: BoardPosition, pieceColour: ChessColour, chessBoard:BoardTileData[][]):MovementInformation | null
{
    const positionToMoveToDiagonal: BoardPosition = CombinePositionWithOffset(currentPosition, movementOffsetDiagonal);
    const tileToMoveTo: BoardTileData = chessBoard[positionToMoveToDiagonal.x][positionToMoveToDiagonal.y];

    if (IsMoveOnBoard(positionToMoveToDiagonal) === false) return null;

    const tileNeutrality = GetTileNeutrality(tileToMoveTo, pieceColour);
    if (tileNeutrality === BoardTileNeutrality.Friendly) return null;
    if (tileNeutrality !== BoardTileNeutrality.Hostile)
    {
        //En passant
        const positionToMoveToSide: BoardPosition = CombinePositionWithOffset(currentPosition, movementOffsetSide);
        const tileToSide: BoardTileData = chessBoard[positionToMoveToSide.x][positionToMoveToSide.y];

        if (GetTileNeutrality(tileToSide, pieceColour) !== BoardTileNeutrality.Hostile) return null;
        if (tileToSide.pieceOnTile.hasPawnMovedTwoSpacesLastTurn === false) return null;
        
        const movementInformation = new MovementInformation(positionToMoveToDiagonal, true);
        movementInformation.MoveIsEnPassant(tileToSide.position);

        return movementInformation;
    }
    return new MovementInformation(positionToMoveToDiagonal, true);
}

export default function GetMovesForPawn(pieceColour: ChessColour, tile:BoardTileData, chessBoard:BoardTileData[][]):MovementInformation[]
{
    const maxDistanceForward: number = tile.pieceOnTile.hasMoved ? 1 : 2;
    const viableMoves: MovementInformation[] = [];
        
    for (let i = 1; i <= maxDistanceForward; i++)
    {
        let movementResult = TryMoveForward(tile.position, (pieceColour === ChessColour.White) ? MovementOffsets.up : MovementOffsets.down, pieceColour, i, chessBoard);
        if (movementResult)
        {
            if (i === 2) movementResult.MoveIsPawnMovingTwoSpaces();

            movementResult = TryAddMove(pieceColour, tile, movementResult);
            if (movementResult) 
            {
                viableMoves.push(movementResult);
                if (movementResult.isEnemyPieceOnTile) break;
            }
            else break;
        }
        else break;
    }

    let movementResultDiagonalLeft = TryMoveDiagonal(tile.position, (pieceColour === ChessColour.White) ? MovementOffsets.upLeft : MovementOffsets.downLeft, MovementOffsets.left, pieceColour, chessBoard);
    if (movementResultDiagonalLeft) 
    {
        movementResultDiagonalLeft = TryAddMove(pieceColour, tile, movementResultDiagonalLeft);
        if (movementResultDiagonalLeft) viableMoves.push(movementResultDiagonalLeft);
    }

    let movementResultDiagonalRight = TryMoveDiagonal(tile.position, (pieceColour === ChessColour.White) ? MovementOffsets.upRight : MovementOffsets.downRight, MovementOffsets.right, pieceColour, chessBoard);
    if (movementResultDiagonalRight) 
    {
        movementResultDiagonalRight = TryAddMove(pieceColour, tile, movementResultDiagonalRight);
        if (movementResultDiagonalRight) viableMoves.push(movementResultDiagonalRight);
    }

    return viableMoves;
}

function TryAddMove(pieceColour: ChessColour, tile:BoardTileData, move: MovementInformation): MovementInformation | null
{
    if (ShouldPawnBePromoted(pieceColour, move.newPosition)) move.MoveIsPromotion();
    return move;
}

function ShouldPawnBePromoted(pieceColour: ChessColour, tileToMoveTo:BoardPosition): boolean
{
    if ((pieceColour === ChessColour.White && tileToMoveTo.x === 0) || (pieceColour === ChessColour.Black && tileToMoveTo.x === 7)) return true;
    else return false;
}