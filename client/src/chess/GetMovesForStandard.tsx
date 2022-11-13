import { IsMoveOnBoard, GetTileNeutrality, CombinePositionWithOffset } from "./GetMovesForPiece";
import { ChessColour, ChessPieceType, KingStatus, BoardTileNeutrality } from "../utilities/enums";
import MovementOffsets from "./MovementOffsets";
import { BoardPosition, BoardTileData } from "./BoardClasses";
import { MovementInformation } from "./MovementClasses";
import ChessController from "./ChessController";

export default class GetMoves
{
    private static TryMove(currentPosition: BoardPosition, movementOffset: BoardPosition, pieceColour: ChessColour, spacesToMove: number, chessBoard:BoardTileData[][]):MovementInformation | null
    {
        const movementOffsetWithDistance = new BoardPosition(movementOffset.x * spacesToMove, movementOffset.y * spacesToMove);
        const positionToMoveTo: BoardPosition = CombinePositionWithOffset(currentPosition, movementOffsetWithDistance);

        if (IsMoveOnBoard(positionToMoveTo) === false) return null;
        const tileToMoveTo: BoardTileData = chessBoard[positionToMoveTo.x][positionToMoveTo.y];
    
        if (GetTileNeutrality(tileToMoveTo, pieceColour) === BoardTileNeutrality.Friendly) return null;
        if (GetTileNeutrality(tileToMoveTo, pieceColour) === BoardTileNeutrality.Hostile) return new MovementInformation(positionToMoveTo, true);

        return new MovementInformation(positionToMoveTo, false);
    }

    static GetMovesForKnight(pieceColour: ChessColour, tile:BoardTileData, chessBoard:BoardTileData[][]):MovementInformation[]
    {
        const offsets: BoardPosition[] = MovementOffsets.GetKnightOffsets();
        const viableMoves: MovementInformation[] = [];

        for (let i = 0; i < offsets.length; i++) 
        {
            let movementResult = this.TryMove(tile.position, offsets[i], pieceColour, 1, chessBoard);
            if (movementResult)
            {
                viableMoves.push(movementResult);
            }
        }

        return viableMoves;
    }

    static GetMovesForRook(pieceColour: ChessColour, tile:BoardTileData, chessBoard:BoardTileData[][]):MovementInformation[]
    {
        const offsets: BoardPosition[] = MovementOffsets.GetCardinalOffsets();
        const viableMoves: MovementInformation[] = this.GetMovesForStandard(offsets, 7, pieceColour, tile, chessBoard);

        return viableMoves;
    }

    static GetMovesForBishop(pieceColour: ChessColour, tile:BoardTileData, chessBoard:BoardTileData[][]):MovementInformation[]
    {
        const offsets: BoardPosition[] = MovementOffsets.GetDiagonalOffsets();
        const viableMoves: MovementInformation[] = this.GetMovesForStandard(offsets, 7, pieceColour, tile, chessBoard);

        return viableMoves;
    }

    static GetMovesForQueen(pieceColour: ChessColour, tile:BoardTileData, chessBoard:BoardTileData[][]):MovementInformation[]
    {
        const offsets: BoardPosition[] = MovementOffsets.GetCardinalAndDiagonalOffsets();
        const viableMoves: MovementInformation[] = this.GetMovesForStandard(offsets, 7, pieceColour, tile, chessBoard);

        return viableMoves;
    }

    static GetMovesForKing(pieceColour: ChessColour, tile:BoardTileData, chessBoard:BoardTileData[][]):MovementInformation[]
    {
        const offsets: BoardPosition[] = MovementOffsets.GetCardinalAndDiagonalOffsets();
        const viableMoves: MovementInformation[] = this.GetMovesForStandard(offsets, 1, pieceColour, tile, chessBoard);

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

                    for (let j = 1; j <= tilesToCheck; j++) 
                    {
                        const movementOffsetWithDistance = new BoardPosition(offsetToRook.x * j, offsetToRook.y * j);
                        const positionToMoveTo: BoardPosition = CombinePositionWithOffset(tile.position, movementOffsetWithDistance);
                        if (IsMoveOnBoard(positionToMoveTo))
                        {
                            const tileToMoveTo: BoardTileData = chessBoard[positionToMoveTo.x][positionToMoveTo.y];
                            if (tileToMoveTo.pieceOnTile.type === ChessPieceType.None)
                            {
                                if (ChessController.CheckKingStatus(pieceColour, tileToMoveTo) === KingStatus.Okay)
                                {
                                    canCastle = true;
                                }
                                else { canCastle = false; break; }
                            }
                            else { canCastle = false; break; }
                        }
                        else { canCastle = false; break; }
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
                        castlingMove.MoveIsNotAttacking();
                        viableMoves.push(castlingMove);
                    }
                }
            }
        }

        return viableMoves;
    }

    static GetMovesForStandard(offsets: BoardPosition[], maxMovement: number, pieceColour: ChessColour, tile:BoardTileData, chessBoard:BoardTileData[][]):MovementInformation[]
    {
        const viableMoves: MovementInformation[] = [];

        for (let i = 0; i < offsets.length; i++) 
        {
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
}