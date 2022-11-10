import { IsMoveOnBoard, GetTileNeutrality, MovementResult, CombinePositionWithOffset } from "./GetMovesForPiece";
import { ChessColour, ChessPieceName, KingStatus, TileNeutrality } from "../utilities/enums";
import BoardPosition from "./BoardPosition";
import TileInfo from "./TileInfo";
import * as offset from "./MovementOffsets";
import CheckKingStatus from "./CheckKingStatus";

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

export function GetMovesForRook(pieceColour: ChessColour, tile:TileInfo, chessBoard:TileInfo[][]):BoardPosition[]
{
    const offsets: BoardPosition[] = [offset.up, offset.right, offset.down, offset.left];
    const viableMoves: BoardPosition[] = GetMovesForStandard(offsets, 7, pieceColour, tile, chessBoard);

    return viableMoves;
}

export function GetMovesForBishop(pieceColour: ChessColour, tile:TileInfo, chessBoard:TileInfo[][]):BoardPosition[]
{
    const offsets: BoardPosition[] = [offset.upLeft, offset.upRight, offset.downLeft, offset.downRight];
    const viableMoves: BoardPosition[] = GetMovesForStandard(offsets, 7, pieceColour, tile, chessBoard);

    return viableMoves;
}

export function GetMovesForQueen(pieceColour: ChessColour, tile:TileInfo, chessBoard:TileInfo[][]):BoardPosition[]
{
    const offsets: BoardPosition[] = [offset.up, offset.right, offset.down, offset.left, offset.upLeft, offset.upRight, offset.downLeft, offset.downRight];
    const viableMoves: BoardPosition[] = GetMovesForStandard(offsets, 7, pieceColour, tile, chessBoard);

    return viableMoves;
}

export function GetMovesForKing(pieceColour: ChessColour, tile:TileInfo, chessBoard:TileInfo[][]):BoardPosition[]
{
    const offsets: BoardPosition[] = [offset.up, offset.right, offset.down, offset.left, offset.upLeft, offset.upRight, offset.downLeft, offset.downRight];
    const viableMoves: BoardPosition[] = GetMovesForStandard(offsets, 1, pieceColour, tile, chessBoard);

    // Castling
    if (tile.pieceOnTile.hasMoved === false)
    {
        const rookTiles: TileInfo[] = [chessBoard[0][0], chessBoard[0][7], chessBoard[7][0], chessBoard[7][7]];
        
        for (let i = 0; i < rookTiles.length; i++) 
        {
            let canCastle: boolean = false;
            if (rookTiles[i].pieceOnTile.pieceName === ChessPieceName.Rook && rookTiles[i].pieceOnTile.hasMoved === false && rookTiles[i].pieceOnTile.pieceColour === pieceColour)
            {
                const toRight: boolean = (rookTiles[i].position.y > tile.position.y);
                const offsetToRook: BoardPosition = toRight ? offset.right : offset.left;
                const tilesToCheck: number = toRight ? 2 : 3;

                for (let index = 1; index <= tilesToCheck; index++) 
                {
                    const positionToMoveTo: BoardPosition = CombinePositionWithOffset(tile.position, offsetToRook);
                    if (IsMoveOnBoard(positionToMoveTo))
                    {
                        const tileToMoveTo: TileInfo = chessBoard[positionToMoveTo.x][positionToMoveTo.y];
                        if (tileToMoveTo.pieceOnTile.pieceName === ChessPieceName.None)
                        {
                            if (CheckKingStatus(pieceColour, tileToMoveTo) === KingStatus.Okay)
                            {
                                canCastle = true;
                            }
                        }
                    }
                }

                if (canCastle)
                {
                    viableMoves.push(new BoardPosition(rookTiles[i].position.x, rookTiles[i].position.y));
                }
            }
        }
    }

    return viableMoves;
}

function GetMovesForStandard(offsets: BoardPosition[], maxMovement: number, pieceColour: ChessColour, tile:TileInfo, chessBoard:TileInfo[][]):BoardPosition[]
{
    const viableMoves: BoardPosition[] = [];

    for (let i = 0; i < offsets.length; i++) 
    {
        for (let j = 1; j <= maxMovement; j++)
        {
            let movementResult = TryMove(tile.position, offsets[i], pieceColour, j, chessBoard);
            if (movementResult)
            {
                viableMoves.push(new BoardPosition(movementResult.newPosition.x, movementResult.newPosition.y));
                if (movementResult.isEnemyPieceOnTile) break;
            }
            else break;
        }
    }

    return viableMoves;
}