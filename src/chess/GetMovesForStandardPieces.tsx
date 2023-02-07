import GetMovesForPiece from "./GetMovesForPiece";
import { ChessColour } from "../utilities/enums";
import MovementOffsets from "./MovementOffsets";
import { BoardPosition, BoardTileData } from "./BoardClasses";
import { MovementInformation } from "./MovementClasses";

export default class GetMovesForStandardPieces
{
    static GetMovesForKnight(pieceColour: ChessColour, tile:BoardTileData, chessBoard:BoardTileData[][]):MovementInformation[]
    {
        const offsets: BoardPosition[] = MovementOffsets.GetKnightOffsets();
        const viableMoves: MovementInformation[] = GetMovesForPiece.GetMovesForStandard(offsets, 1, pieceColour, tile, chessBoard);

        return viableMoves;
    }

    static GetMovesForRook(pieceColour: ChessColour, tile:BoardTileData, chessBoard:BoardTileData[][]):MovementInformation[]
    {
        const offsets: BoardPosition[] = MovementOffsets.GetCardinalOffsets();
        const viableMoves: MovementInformation[] = GetMovesForPiece.GetMovesForStandard(offsets, 7, pieceColour, tile, chessBoard);

        return viableMoves;
    }

    static GetMovesForBishop(pieceColour: ChessColour, tile:BoardTileData, chessBoard:BoardTileData[][]):MovementInformation[]
    {
        const offsets: BoardPosition[] = MovementOffsets.GetDiagonalOffsets();
        const viableMoves: MovementInformation[] = GetMovesForPiece.GetMovesForStandard(offsets, 7, pieceColour, tile, chessBoard);

        return viableMoves;
    }

    static GetMovesForQueen(pieceColour: ChessColour, tile:BoardTileData, chessBoard:BoardTileData[][]):MovementInformation[]
    {
        const offsets: BoardPosition[] = MovementOffsets.GetCardinalAndDiagonalOffsets();
        const viableMoves: MovementInformation[] = GetMovesForPiece.GetMovesForStandard(offsets, 7, pieceColour, tile, chessBoard);

        return viableMoves;
    }
}