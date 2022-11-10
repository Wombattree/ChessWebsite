import { ChessPieceName, ChessColour, TileState } from "../utilities/enums";
import BoardPosition from "./BoardPosition";
import ChessPiece from "./ChessPiece";
import { CombinePositionWithOffset } from "./GetMovesForPiece";
import TileInfo from "./TileInfo";
import * as offset from './MovementOffsets';

export function MovePiece(positionToMoveFrom: BoardPosition, positionToMoveTo: BoardPosition, chessBoard: TileInfo[][], EndGame: (victor: ChessColour) => void):[TileInfo[][], boolean]
{
    const tileToMoveFrom = chessBoard[positionToMoveFrom.x][positionToMoveFrom.y];
    const tileToMoveTo = chessBoard[positionToMoveTo.x][positionToMoveTo.y];
    let displayPromotion = false;
    let checkmate = false;

    const tileToMoveFromName: ChessPieceName = tileToMoveFrom.pieceOnTile.pieceName;
    const tileToMoveFromColour: ChessColour = tileToMoveFrom.pieceOnTile.pieceColour;

    const tileToMoveToName: ChessPieceName = tileToMoveTo.pieceOnTile.pieceName;
    const tileToMoveToColour: ChessColour = tileToMoveTo.pieceOnTile.pieceColour;

    if (tileToMoveFromName === ChessPieceName.King && tileToMoveToName === ChessPieceName.Rook && tileToMoveFromColour === tileToMoveToColour)
    {
        //Castling
        const toRight: boolean = (tileToMoveTo.position.y > tileToMoveFrom.position.y);
        const offsetToRook: BoardPosition = toRight ? offset.right : offset.left;
        const offsetToKing: BoardPosition = toRight ? offset.left : offset.right;

        const spacesForKingToMove = 2;
        const kingMovementOffsetWithDistance = new BoardPosition(offsetToRook.x * spacesForKingToMove, offsetToRook.y * spacesForKingToMove);
        const positionForKing: BoardPosition = CombinePositionWithOffset(positionToMoveFrom, kingMovementOffsetWithDistance);

        const spacesForRookToMove = toRight ? 2 : 3;
        const rookMovementOffsetWithDistance = new BoardPosition(offsetToKing.x * spacesForRookToMove, offsetToKing.y * spacesForRookToMove);
        const positionForRook: BoardPosition = CombinePositionWithOffset(positionToMoveTo, rookMovementOffsetWithDistance);

        chessBoard[positionForKing.x][positionForKing.y].SetPieceOnTile(tileToMoveFrom.pieceOnTile);
        chessBoard[positionForRook.x][positionForRook.y].SetPieceOnTile(tileToMoveTo.pieceOnTile);

        tileToMoveFrom.SetPieceOnTile(new ChessPiece(ChessPieceName.None, ChessColour.None));
        tileToMoveTo.SetPieceOnTile(new ChessPiece(ChessPieceName.None, ChessColour.None));
    }
    else
    {   
        if (tileToMoveToName === ChessPieceName.King) 
        {
            checkmate = true;
            Checkmate(tileToMoveFromColour, EndGame);
        }

        tileToMoveTo.SetPieceOnTile(tileToMoveFrom.pieceOnTile);
        tileToMoveFrom.SetPieceOnTile(new ChessPiece(ChessPieceName.None, ChessColour.None));
    }

    if (tileToMoveTo.pieceOnTile.pieceName === ChessPieceName.Pawn)
    {
        //Moved two spaces
        if ((positionToMoveFrom.x === 6 && positionToMoveTo.x === 4) || (positionToMoveFrom.x === 1 && positionToMoveTo.x === 3)) 
        {
            tileToMoveTo.pieceOnTile.PieceMovedTwoSpaces();
        }
        else
        {
            const pieceColour = tileToMoveTo.pieceOnTile.pieceColour;

            //En passant
            const potentialEnPassantPosition = CombinePositionWithOffset(positionToMoveTo, (pieceColour === ChessColour.White ? offset.down : offset.up));
            const potentialEnPassantTile = chessBoard[potentialEnPassantPosition.x][potentialEnPassantPosition.y];
            if (potentialEnPassantTile.pieceOnTile.pieceName === ChessPieceName.Pawn && potentialEnPassantTile.pieceOnTile.movedTwoSpacesLastTurn)
            {
                potentialEnPassantTile.SetPieceOnTile(new ChessPiece(ChessPieceName.None, ChessColour.None));
            }

            //Promotion
            if (checkmate === false)
            {
                if ((pieceColour === ChessColour.White && tileToMoveTo.position.x === 0) || (pieceColour === ChessColour.Black && tileToMoveTo.position.x === 7))
                {
                    displayPromotion = true;
                }
            }
        }
    }

    tileToMoveTo.pieceOnTile.PieceMoved();

    return [chessBoard, displayPromotion];
}

function Checkmate(victor: ChessColour, EndGame: (victor: ChessColour) => void)
{
    EndGame(victor);
}

export function ClearBoard(chessBoard: TileInfo[][], endTurn: boolean, currentTurn: ChessColour):TileInfo[][]
{
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++)
        {
            chessBoard[x][y].SetTileState(TileState.None);

            if (endTurn && chessBoard[x][y].pieceOnTile)
            {
                const pieceOnTile = chessBoard[x][y].pieceOnTile;
                if (pieceOnTile.pieceColour !== currentTurn)
                {
                    pieceOnTile.movedTwoSpacesLastTurn = false;
                }
            }
        }
    }
    return chessBoard;
}