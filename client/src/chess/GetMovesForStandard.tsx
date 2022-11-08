import { IsMoveOnBoard, GetTileNeutrality, MovementResult, CombinePositionWithOffset } from "./GetMovesForPiece";
import { ChessColour, TileNeutrality, TileState } from "../utilities/enums";
import BoardPosition from "./BoardPosition";
import TileInfo from "./TileInfo";
import * as offset from "./MovementOffsets";

function TryMove(currentPosition: BoardPosition, movementOffset: BoardPosition, pieceColour: ChessColour, spacesToMove: number, chessBoard:TileInfo[][]):MovementResult | null
{
    const movementOffsetWithDistance = new BoardPosition(movementOffset.x * spacesToMove, movementOffset.y * spacesToMove);
    const positionToMoveTo: BoardPosition = CombinePositionWithOffset(currentPosition, movementOffsetWithDistance);

    if (IsMoveOnBoard(positionToMoveTo) === false) return null;
    const tileToMoveTo: TileInfo = chessBoard[positionToMoveTo.x][positionToMoveTo.y];
 
    if (GetTileNeutrality(tileToMoveTo, pieceColour) === TileNeutrality.Friendly) return null;
    if (GetTileNeutrality(tileToMoveTo, pieceColour) === TileNeutrality.Hostile) return new MovementResult(positionToMoveTo, true);
    else return new MovementResult(positionToMoveTo, false);
}

export function GetMovesForRook(pieceColour: ChessColour, tile:TileInfo, chessBoard:TileInfo[][]):TileInfo[][]
{
    const offsets: BoardPosition[] = [offset.up, offset.right, offset.down, offset.left];
    chessBoard = GetMovesForStandard(offsets, 7, pieceColour, tile, chessBoard);

    return chessBoard;
}

export function GetMovesForBishop(pieceColour: ChessColour, tile:TileInfo, chessBoard:TileInfo[][]):TileInfo[][]
{
    const offsets: BoardPosition[] = [offset.upLeft, offset.upRight, offset.downLeft, offset.downRight];
    chessBoard = GetMovesForStandard(offsets, 7, pieceColour, tile, chessBoard);

    return chessBoard;
}

export function GetMovesForQueen(pieceColour: ChessColour, tile:TileInfo, chessBoard:TileInfo[][]):TileInfo[][]
{
    const offsets: BoardPosition[] = [offset.up, offset.right, offset.down, offset.left, offset.upLeft, offset.upRight, offset.downLeft, offset.downRight];
    chessBoard = GetMovesForStandard(offsets, 7, pieceColour, tile, chessBoard);

    return chessBoard;
}

export function GetMovesForKing(pieceColour: ChessColour, tile:TileInfo, chessBoard:TileInfo[][]):TileInfo[][]
{
    const offsets: BoardPosition[] = [offset.up, offset.right, offset.down, offset.left, offset.upLeft, offset.upRight, offset.downLeft, offset.downRight];
    chessBoard = GetMovesForStandard(offsets, 1, pieceColour, tile, chessBoard);

    return chessBoard;
}

function GetMovesForStandard(offsets: BoardPosition[], maxMovement: number, pieceColour: ChessColour, tile:TileInfo, chessBoard:TileInfo[][]):TileInfo[][]
{
    for (let i = 0; i < offsets.length; i++) 
    {
        for (let j = 1; j <= maxMovement; j++)
        {
            let movementResult = TryMove(tile.position, offsets[i], pieceColour, j, chessBoard);
            if (movementResult)
            {
                chessBoard[movementResult.newPosition.x][movementResult.newPosition.y].SetTileState(TileState.Moveable);
                if (movementResult.isEnemyPieceOnTile) break;
            }
            else break;
        }
    }

    return chessBoard;
}