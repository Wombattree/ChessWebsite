import GetMovesForPiece from "./GetMovesForPiece";
import { ChessColour, ChessPieceType, KingStatus } from "../utilities/enums";
import MovementOffsets from "./MovementOffsets";
import { BoardPosition, BoardTileData } from "./BoardClasses";
import { MovementInformation } from "./MovementClasses";
import ChessController from "./ChessController";

export default class GetMovesForKing
{
    static GetMovesForKing(pieceColour: ChessColour, tile:BoardTileData, chessBoard:BoardTileData[][]):MovementInformation[]
    {
        const offsets: BoardPosition[] = MovementOffsets.GetCardinalAndDiagonalOffsets();
        const viableMoves: MovementInformation[] = GetMovesForPiece.GetMovesForStandard(offsets, 1, pieceColour, tile, chessBoard);

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
                        const positionToMoveTo: BoardPosition = GetMovesForPiece.CombinePositionWithOffset(tile.position, movementOffsetWithDistance);
                        if (GetMovesForPiece.IsMoveOnBoard(positionToMoveTo))
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
                        const kingPositionAfterCastle: BoardPosition = GetMovesForPiece.CombinePositionWithOffset(tile.position, kingMovementOffsetWithDistance);

                        const spacesForRookToMove = rookToRight ? 2 : 3;
                        const rookMovementOffsetWithDistance = new BoardPosition(offsetToKing.x * spacesForRookToMove, offsetToKing.y * spacesForRookToMove);
                        const rookPositionAfterCastle: BoardPosition = GetMovesForPiece.CombinePositionWithOffset(rookTiles[i].position, rookMovementOffsetWithDistance);

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
}