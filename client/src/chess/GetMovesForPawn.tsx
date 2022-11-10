import { IsMoveOnBoard, GetTileNeutrality, MovementResult, CombinePositionWithOffset } from "./GetMovesForPiece";
import { ChessColour, TileNeutrality, TileState } from "../utilities/enums";
import BoardPosition from "./BoardPosition";
import TileInfo from "./TileInfo";
import * as offset from "./MovementOffsets";

function TryMoveForward(currentPosition: BoardPosition, movementOffset: BoardPosition, pieceColour: ChessColour, spacesToMove: number, chessBoard:TileInfo[][]):MovementResult | null
{
    const positionToMoveTo: BoardPosition = new BoardPosition(currentPosition.x + movementOffset.x * spacesToMove, currentPosition.y);
    if (IsMoveOnBoard(positionToMoveTo) === false) return null;

    const tileToMoveTo: TileInfo = chessBoard[positionToMoveTo.x][positionToMoveTo.y];
    if (GetTileNeutrality(tileToMoveTo, pieceColour) !== TileNeutrality.Empty) return null;
    return new MovementResult(positionToMoveTo, false);
}

function TryMoveDiagonal(currentPosition: BoardPosition, movementOffsetDiagonal: BoardPosition, movementOffsetSide: BoardPosition, pieceColour: ChessColour, chessBoard:TileInfo[][]):MovementResult | null
{
    const positionToMoveToDiagonal: BoardPosition = CombinePositionWithOffset(currentPosition, movementOffsetDiagonal);
    const tileToMoveTo: TileInfo = chessBoard[positionToMoveToDiagonal.x][positionToMoveToDiagonal.y];

    if (IsMoveOnBoard(positionToMoveToDiagonal) === false) return null;

    const tileNeutrality = GetTileNeutrality(tileToMoveTo, pieceColour);
    if (tileNeutrality === TileNeutrality.Friendly) return null;
    if (tileNeutrality !== TileNeutrality.Hostile)
    {
        //En passant
        const positionToMoveToSide: BoardPosition = CombinePositionWithOffset(currentPosition, movementOffsetSide);
        const tileToSide: TileInfo = chessBoard[positionToMoveToSide.x][positionToMoveToSide.y];
        if (GetTileNeutrality(tileToSide, pieceColour) !== TileNeutrality.Hostile) return null;
        if (tileToSide.pieceOnTile.movedTwoSpacesLastTurn === false) return null;
        else return new MovementResult(positionToMoveToDiagonal, true);
    }
    return new MovementResult(positionToMoveToDiagonal, true);
}

export default function GetMovesForPawn(pieceColour: ChessColour, tile:TileInfo, chessBoard:TileInfo[][]):TileInfo[][]
{
    const maxDistanceForward: number = tile.pieceOnTile.hasMoved ? 1 : 2;
        
    for (let i = 1; i <= maxDistanceForward; i++)
    {
        let movementResult = TryMoveForward(tile.position, (pieceColour === ChessColour.White) ? offset.up : offset.down, pieceColour, i, chessBoard);
        if (movementResult)
        {
            chessBoard[movementResult.newPosition.x][movementResult.newPosition.y].SetTileState(TileState.Moveable);
            if (movementResult.isEnemyPieceOnTile) break;
        }
        else break;
    }

    let movementResultDiagonalLeft = TryMoveDiagonal(tile.position, (pieceColour === ChessColour.White) ? offset.upLeft : offset.downLeft, offset.left, pieceColour, chessBoard);
    if (movementResultDiagonalLeft)
    {
        chessBoard[movementResultDiagonalLeft.newPosition.x][movementResultDiagonalLeft.newPosition.y].SetTileState(TileState.Moveable);
    }

    let movementResultDiagonalRight = TryMoveDiagonal(tile.position, (pieceColour === ChessColour.White) ? offset.upRight : offset.downRight, offset.right, pieceColour, chessBoard);
    if (movementResultDiagonalRight)
    {
        chessBoard[movementResultDiagonalRight.newPosition.x][movementResultDiagonalRight.newPosition.y].SetTileState(TileState.Moveable);
    }

    return chessBoard;
}