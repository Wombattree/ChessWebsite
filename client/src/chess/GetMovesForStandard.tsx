import { IsMoveOnBoard, GetTileNeutrality, CombinePositionWithOffset, WouldMovePutYourKingInCheck } from "./GetMovesForPiece";
import { ChessColour, ChessPieceType, KingStatus, BoardTileNeutrality } from "../utilities/enums";
import MovementOffsets from "./MovementOffsets";
import { CheckKingStatus } from "./CheckKingStatus";
import { BoardPosition, BoardTileData } from "./BoardClasses";
import { MovementInformation } from "./MovementClasses";
import { ChessData } from "./InformationClasses";

function TryMove(currentPosition: BoardPosition, movementOffset: BoardPosition, pieceColour: ChessColour, spacesToMove: number, chessBoard:BoardTileData[][]):MovementInformation | null
{
    const movementOffsetWithDistance = new BoardPosition(movementOffset.x * spacesToMove, movementOffset.y * spacesToMove);
    const positionToMoveTo: BoardPosition = CombinePositionWithOffset(currentPosition, movementOffsetWithDistance);
    const currentTile: BoardTileData = ChessData.GetTileAtPosition(currentPosition);

    if (IsMoveOnBoard(positionToMoveTo) === false) return null;
    const tileToMoveTo: BoardTileData = chessBoard[positionToMoveTo.x][positionToMoveTo.y];
 
    if (GetTileNeutrality(tileToMoveTo, pieceColour) === BoardTileNeutrality.Friendly) return null;
    if (GetTileNeutrality(tileToMoveTo, pieceColour) === BoardTileNeutrality.Hostile) return new MovementInformation(positionToMoveTo, true);
    if (WouldMovePutYourKingInCheck(currentTile, new MovementInformation(positionToMoveTo, false))) return null;

    return new MovementInformation(positionToMoveTo, false);
}

export function GetMovesForKnight(pieceColour: ChessColour, tile:BoardTileData, chessBoard:BoardTileData[][]):MovementInformation[]
{
    const offsets: BoardPosition[] = MovementOffsets.GetKnightOffsets();
    const viableMoves: MovementInformation[] = [];

    for (let i = 0; i < offsets.length; i++) 
    {
        let movementResult = TryMove(tile.position, offsets[i], pieceColour, 1, chessBoard);
        if (movementResult)
        {
            viableMoves.push(movementResult);
        }
    }

    return viableMoves;
}

export function GetMovesForRook(pieceColour: ChessColour, tile:BoardTileData, chessBoard:BoardTileData[][]):MovementInformation[]
{
    const offsets: BoardPosition[] = MovementOffsets.GetCardinalOffsets();
    const viableMoves: MovementInformation[] = GetMovesForStandard(offsets, 7, pieceColour, tile, chessBoard);

    return viableMoves;
}

export function GetMovesForBishop(pieceColour: ChessColour, tile:BoardTileData, chessBoard:BoardTileData[][]):MovementInformation[]
{
    const offsets: BoardPosition[] = MovementOffsets.GetDiagonalOffsets();
    const viableMoves: MovementInformation[] = GetMovesForStandard(offsets, 7, pieceColour, tile, chessBoard);

    return viableMoves;
}

export function GetMovesForQueen(pieceColour: ChessColour, tile:BoardTileData, chessBoard:BoardTileData[][]):MovementInformation[]
{
    const offsets: BoardPosition[] = MovementOffsets.GetCardinalAndDiagonalOffsets();
    const viableMoves: MovementInformation[] = GetMovesForStandard(offsets, 7, pieceColour, tile, chessBoard);

    return viableMoves;
}

export function GetMovesForKing(pieceColour: ChessColour, tile:BoardTileData, chessBoard:BoardTileData[][]):MovementInformation[]
{
    const offsets: BoardPosition[] = MovementOffsets.GetCardinalAndDiagonalOffsets();
    const viableMoves: MovementInformation[] = GetMovesForStandard(offsets, 1, pieceColour, tile, chessBoard);

    // Castling
    if (tile.pieceOnTile.hasMoved === false)
    {
        const rookTiles: BoardTileData[] = [chessBoard[0][0], chessBoard[0][7], chessBoard[7][0], chessBoard[7][7]];
        
        for (let i = 0; i < rookTiles.length; i++) 
        {
            let canCastle: boolean = false;

            if (rookTiles[i].pieceOnTile.type === ChessPieceType.Rook && rookTiles[i].pieceOnTile.hasMoved === false && rookTiles[i].pieceOnTile.colour === pieceColour)
            {
                const rookToRight: boolean = (rookTiles[i].position.y > tile.position.y);
                const offsetToRook: BoardPosition = rookToRight ? MovementOffsets.right : MovementOffsets.left;
                const offsetToKing: BoardPosition = rookToRight ? MovementOffsets.left : MovementOffsets.right;

                const tilesToCheck: number = rookToRight ? 2 : 3;

                for (let index = 1; index <= tilesToCheck; index++) 
                {
                    const positionToMoveTo: BoardPosition = CombinePositionWithOffset(tile.position, offsetToRook);
                    if (IsMoveOnBoard(positionToMoveTo))
                    {
                        const tileToMoveTo: BoardTileData = chessBoard[positionToMoveTo.x][positionToMoveTo.y];
                        if (tileToMoveTo.pieceOnTile.type === ChessPieceType.None)
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
                    const spacesForKingToMove = 2;
                    const kingMovementOffsetWithDistance = new BoardPosition(offsetToRook.x * spacesForKingToMove, offsetToRook.y * spacesForKingToMove);
                    const kingPositionAfterCastle: BoardPosition = CombinePositionWithOffset(tile.position, kingMovementOffsetWithDistance);

                    const spacesForRookToMove = rookToRight ? 2 : 3;
                    const rookMovementOffsetWithDistance = new BoardPosition(offsetToKing.x * spacesForRookToMove, offsetToKing.y * spacesForRookToMove);
                    const rookPositionAfterCastle: BoardPosition = CombinePositionWithOffset(rookTiles[i].position, rookMovementOffsetWithDistance);

                    const castlingMove = new MovementInformation(rookTiles[i].position, false);
                    castlingMove.MoveIsCastling(kingPositionAfterCastle, rookPositionAfterCastle);
                    viableMoves.push(castlingMove);
                }
            }
        }
    }

    return viableMoves;
}

function GetMovesForStandard(offsets: BoardPosition[], maxMovement: number, pieceColour: ChessColour, tile:BoardTileData, chessBoard:BoardTileData[][]):MovementInformation[]
{
    const viableMoves: MovementInformation[] = [];

    for (let i = 0; i < offsets.length; i++) 
    {
        for (let j = 1; j <= maxMovement; j++)
        {
            let movementResult = TryMove(tile.position, offsets[i], pieceColour, j, chessBoard);
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