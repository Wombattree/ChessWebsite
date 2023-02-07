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
    //The turn gets started as black since the currentTurn is toggled on each turn start, thus the first turn will be white
    private static currentTurn: ChessColour = ChessColour.Black;
    private static playerTurn: ChessColour = ChessColour.None;
    private static computerTurn: ChessColour = ChessColour.None;
    private static displayPromotion: boolean = false;

    static GetChessBoard():BoardTileData[][] { return this.chessBoard; }
    static SetChessBoard(updatedChessBoard: BoardTileData[][]) { this.chessBoard = updatedChessBoard; }

    static GetTileAtPosition(position: BoardPosition):BoardTileData { return this.chessBoard[position.x][position.y]; }

    static GetSelectedPiece():BoardTileData | null { return this.selectedPiece; }
    static SetSelectedPiece(updatedSelectedPiece: BoardTileData | null) { this.selectedPiece = updatedSelectedPiece; }

    static GetGameState():GameState { return this.currentGameState; }
    static SetGameState(updatedGameState: GameState) { this.currentGameState = updatedGameState; }

    static GetCurrentTurn():ChessColour { return this.currentTurn; }
    static SetCurrentTurn(updatedCurrentTurn: ChessColour) { this.currentTurn = updatedCurrentTurn; }
    static ToggleCurrentTurn() { this.currentTurn = (this.currentTurn === ChessColour.White) ? ChessColour.Black : ChessColour.White; }

    static GetPlayerTurn():ChessColour { return this.playerTurn; }
    static GetComputerTurn():ChessColour { return this.computerTurn; }
    static IsItPlayerTurn(): boolean { if (this.playerTurn === this.currentTurn) return true; else return false;}

    static GetDisplayPromotion():boolean { return this.displayPromotion; }
    static SetDisplayPromotion(value: boolean) { this.displayPromotion = value; }

    static InitialiseChessBoard():BoardTileData[][]
    {
        const chessBoard: BoardTileData[][] = [[],[],[],[],[],[],[],[]];
        const chessBoardPieces:ChessPiece[][] = LoadPositionFromFen(this.startingFEN);

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

    static Reset()
    {
        this.SetGameState(new GameState(false, false, null));
        this.SetCurrentTurn(ChessColour.Black);
        this.SetSelectedPiece(null);
        this.SetDisplayPromotion(false);
        this.SetPlayerTurn();
        this.SetChessBoard(this.InitialiseChessBoard());
    }

    static SetPlayerTurn()
    {
        const random = Math.round(Math.random());
        if (random === 0) 
        {
            this.playerTurn = ChessColour.White;
            this.computerTurn = ChessColour.Black;
        }
        else 
        {
            this.playerTurn = ChessColour.Black;
            this.computerTurn = ChessColour.White;
        }
    }

    static ClearThreat()
    {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++)
            {
                this.chessBoard[x][y].ClearThreat();
            }
        }
    }
}