import { ChessColour } from "../utilities/enums";
import { BoardTileData, BoardPosition } from "./BoardClasses";
import ChessPiece from "./ChessPiece";
import LoadPositionFromFen from "./LoadPositionFromFen";

export class GameState
{
	readonly whiteInCheck: boolean = false;
	readonly blackInCheck: boolean = false;
	readonly victor: ChessColour | null = null;

	constructor(whiteInCheck: boolean, blackInCheck: boolean, victor: ChessColour | null)
	{
		this.whiteInCheck = whiteInCheck;
		this.blackInCheck = blackInCheck;
		this.victor = victor;
	}
}

export class ChessData
{
    private static readonly startingFEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    private static chessBoard: BoardTileData[][] = this.InitialiseChessBoard();
    private static selectedPiece: BoardTileData | null = null;
    private static currentGameState: GameState = new GameState(false, false, null);
    private static currentTurn: ChessColour = ChessColour.White;
    private static displayPromotion: boolean = false;

    static GetChessBoard():BoardTileData[][] { return ChessData.chessBoard; }
    static SetChessBoard(updatedChessBoard: BoardTileData[][]) { ChessData.chessBoard = updatedChessBoard; }

    static GetTileAtPosition(position: BoardPosition):BoardTileData { return ChessData.chessBoard[position.x][position.y]; }

    static GetSelectedPiece():BoardTileData | null { return ChessData.selectedPiece; }
    static SetSelectedPiece(updatedSelectedPiece: BoardTileData | null) { ChessData.selectedPiece = updatedSelectedPiece; }

    static GetGameState():GameState { return ChessData.currentGameState; }
    static SetGameState(updatedGameState: GameState) { ChessData.currentGameState = updatedGameState; }

    static GetCurrentTurn():ChessColour { return ChessData.currentTurn; }
    static SetCurrentTurn(updatedCurrentTurn: ChessColour) { ChessData.currentTurn = updatedCurrentTurn; }
    static ToggleCurrentTurn() { ChessData.currentTurn = (ChessData.currentTurn === ChessColour.White) ? ChessColour.Black : ChessColour.White; }

    static GetDisplayPromotion():boolean { return this.displayPromotion; }
    static SetDisplayPromotion(value: boolean) { this.displayPromotion = value; }

    static InitialiseChessBoard():BoardTileData[][]
    {
        const chessBoard:BoardTileData[][] = [[],[],[],[],[],[],[],[]];
        const chessBoardPieces:ChessPiece[][] = LoadPositionFromFen(ChessData.startingFEN);

        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++)
            {
                chessBoard[x][y] = new BoardTileData(new BoardPosition(x, y));
                if (chessBoardPieces[x][y] !== undefined)
                {
                    chessBoard[x][y].pieceOnTile = chessBoardPieces[x][y];
                }
            }
        }

        return chessBoard;
    }
}