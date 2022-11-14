import lodash from "lodash";
import { ChessColour, ChessPieceType } from "../utilities/enums";
import { AISearchResult } from "./AIClasses";
import { BoardTileData } from "./BoardClasses";
import ChessMovementController from "./ChessMovementController";
import { ChessData } from "./InformationClasses";
import { MovementInformation } from "./MovementClasses";

export default class ChessAIController
{
    static DetermineMove(tilesWithPieces: BoardTileData[], chessBoard: BoardTileData[][])
    {
        const computerTurn = ChessData.GetComputerTurn();
        const computerTiles: BoardTileData[] = tilesWithPieces.filter((tile) => tile.pieceOnTile.colour === computerTurn)

        let bestMoveValue: number = -1000000;
        let bestMoves: AISearchResult[] = [];
        
        computerTiles.forEach((tile) => 
        {
            const viableMoves: MovementInformation[] = tile.pieceOnTile.viableMoves;
            
            viableMoves.forEach((move, moveIndex) =>
            {
                const chessBoardCopy = lodash.cloneDeep(chessBoard);
                const tileCopy = chessBoardCopy[tile.position.x][tile.position.y];
                const moveCopy = tileCopy.pieceOnTile.viableMoves[moveIndex];
                const tileToMoveTo = chessBoardCopy[moveCopy.newPosition.x][moveCopy.newPosition.y];

                ChessMovementController.MovePiece(tileCopy, tileToMoveTo, chessBoardCopy, moveCopy, true);
                const boardValue = this.EvaluateBoard(computerTurn, chessBoardCopy);

                if (boardValue > bestMoveValue) 
                {
                    bestMoves = [];
                    bestMoveValue = boardValue;
                    bestMoves.push(new AISearchResult(boardValue, tile, move));
                }
                else if (boardValue === bestMoveValue)
                {
                    bestMoves.push(new AISearchResult(boardValue, tile, move));
                }
            });
        });

        if (bestMoves.length > 0)
        {
            const chosenMove: AISearchResult = bestMoves[this.PickRandomlyFromBestMoves(bestMoves)];
            this.PlayMove(chosenMove, chessBoard);
        }
        else console.log("No moves!");
    }

    private static PlayMove(move: AISearchResult, chessBoard: BoardTileData[][])
    {
        const tileToMoveTo = chessBoard[move.move.newPosition.x][move.move.newPosition.y];
        ChessMovementController.MovePiece(move.tile, tileToMoveTo, chessBoard, move.move);
    }

    private static EvaluateBoard(computerColour: ChessColour, chessBoard: BoardTileData[][]): number
    {
        let boardValue: number = 0;

        chessBoard.forEach((row) => {
            row.forEach((tile) =>
            {
                const piece = tile.pieceOnTile;
                let pieceValue = this.GetValueFromPiece(piece.type);

                if (piece.colour === computerColour) boardValue += pieceValue;
                else boardValue -= pieceValue;
            });
        });

        return boardValue;
    }

    private static GetValueFromPiece(piece: ChessPieceType): number
    {
        switch (piece) 
        {
            case ChessPieceType.Pawn: return 100;
            case ChessPieceType.Knight: return 300;
            case ChessPieceType.Bishop: return 300;
            case ChessPieceType.Rook: return 500;
            case ChessPieceType.Queen: return 900;
            default: return 0;
        }
    }

    private static PickRandomlyFromBestMoves(bestMoves: AISearchResult[]): number
    {
        return Math.round(Math.random() * (bestMoves.length - 1));
    }
}