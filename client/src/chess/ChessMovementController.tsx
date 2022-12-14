import { ChessPieceType } from "../utilities/enums";
import { BoardPosition, BoardTileData } from "./BoardClasses";
import ChessController from "./ChessController";
import ChessPiece from "./ChessPiece";
import { MovementInformation } from "./MovementClasses";

export default class ChessMovementController
{
    static MovePiece(tileToMoveFrom: BoardTileData, tileToMoveTo: BoardTileData, chessBoard: BoardTileData[][], movementInformation?: MovementInformation, checkingMoveValidity?: boolean): boolean
    {
        const pieceToMove: ChessPiece = tileToMoveFrom.pieceOnTile;
        const move: MovementInformation | null = movementInformation ? movementInformation : this.FindMoveFromPiece(pieceToMove.viableMoves, tileToMoveTo);
        let displayPromotion = false;

        if (move)
        {
            if (move.GetIsMoveCastling()) this.Castle(move, chessBoard, tileToMoveFrom, tileToMoveTo);
            else
            {
                if (tileToMoveTo.pieceOnTile.type === ChessPieceType.King && checkingMoveValidity === false) 
                {
                    this.Move(tileToMoveTo, tileToMoveFrom);
                    ChessController.Checkmate(tileToMoveTo.pieceOnTile.colour, ChessController.EndGame);
                }
                else
                {
                    this.Move(tileToMoveTo, tileToMoveFrom);
                    
                    if (move.GetIsMoveEnPassant()) this.EnPassant(move, chessBoard);
                    
                    if (move.GetIsPawnMovingTwoSpaces()) tileToMoveTo.pieceOnTile.hasPawnMovedTwoSpacesLastTurn = true;

                    if (move.GetIsMovePromotion()) displayPromotion = true;
                }

                tileToMoveTo.pieceOnTile.hasMoved = true;
            }
        }
        else console.log("Couldn't find move!");
    
        return displayPromotion;
    }

    private static Move(tileToMoveTo: BoardTileData, tileToMoveFrom: BoardTileData) 
    {
        tileToMoveTo.pieceOnTile = tileToMoveFrom.pieceOnTile;
        tileToMoveFrom.ClearTile();
    }

    private static EnPassant(move: MovementInformation, chessBoard: BoardTileData[][]) 
    {
        const enPassantPosition = move.GetEnPassantPosition();
        if (enPassantPosition) 
        {
            const enPassantTile = chessBoard[enPassantPosition.x][enPassantPosition.y];
            enPassantTile.ClearTile();
        }
    }

    private static Castle(move: MovementInformation, chessBoard: BoardTileData[][], tileToMoveFrom: BoardTileData, tileToMoveTo: BoardTileData) 
    {
        const kingPosition: BoardPosition | null = move.GetKingCastlingPosition();
        const rookPosition: BoardPosition | null = move.GetRookCastlingPosition();

        if (kingPosition && rookPosition) {
            const kingTile = chessBoard[kingPosition.x][kingPosition.y];
            const rookTile = chessBoard[rookPosition.x][rookPosition.y];

            kingTile.pieceOnTile = tileToMoveFrom.pieceOnTile;
            kingTile.pieceOnTile.hasMoved = true;

            rookTile.pieceOnTile = tileToMoveTo.pieceOnTile;
            rookTile.pieceOnTile.hasMoved = true;

            tileToMoveFrom.ClearTile();
            tileToMoveTo.ClearTile();
        }
    }

    private static FindMoveFromPiece(moves: MovementInformation[], tileToMoveTo: BoardTileData): MovementInformation | null
    {
        for (let i = 0; i < moves.length; i++) 
        {
            const newPosition = moves[i].newPosition;
            if (newPosition.x === tileToMoveTo.position.x && newPosition.y === tileToMoveTo.position.y) return moves[i];
        }
        return null;
    } 
}