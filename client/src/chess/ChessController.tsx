import { ChessPieceType, ChessColour, BoardTileState, KingStatus } from "../utilities/enums";
import GetMovesForPiece from "./GetMovesForPiece";
import { BoardTileData, BoardPosition } from "./BoardClasses";
import { ChessData, GameState } from "./InformationClasses";
import ChessMovementController from "./ChessMovementController";
import { MovementInformation } from "./MovementClasses";
import lodash from "lodash";
import ChessAIController from "./ChessAIController";

export default class ChessController
{
    static StartGame(Update:() => void)
    {
        ChessData.InitialiseChessBoard();
        ChessData.SetPlayerTurn();
        this.NewTurn(Update);
        Update();
    }
    
    private static NewTurn(Update:() => void)
    {
        ChessData.ToggleCurrentTurn();
        const chessBoard = ChessData.GetChessBoard();
        const currentTurn = ChessData.GetCurrentTurn();
        ChessData.ClearThreat();

        let tilesWithPieces: BoardTileData[] = [];
        this.GetMovesAndSetThreatened(chessBoard, tilesWithPieces);
        this.FilterOutMovesThatWouldLeaveKingInCheck(tilesWithPieces, currentTurn, chessBoard);

        const isCheckMate = this.IsCheckMate(currentTurn, tilesWithPieces, chessBoard);
        if (isCheckMate !== ChessColour.None)
        {
            this.EndGame(isCheckMate);
        }
        else this.UpdateGameState();

        if (ChessData.IsItPlayerTurn() === false) 
        {
            ChessAIController.DetermineMove(tilesWithPieces, chessBoard);
            Update();
            this.EndTurn(Update);
        }
    }

    private static IsCheckMate(currentTurn: ChessColour, tilesWithPieces: BoardTileData[], chessBoard: BoardTileData[][]): ChessColour
    {
        if (this.DoesSideHaveAtLeastOneViableMove(tilesWithPieces, currentTurn) === false) return this.GetOpositeChessColour(currentTurn);
        else return this.WhichKingIsInCheckMate(currentTurn, chessBoard);
    }

    private static GetOpositeChessColour(colour: ChessColour)
    {
        if (colour === ChessColour.White) return ChessColour.Black;
        else return ChessColour.White;
    }

    private static FilterOutMovesThatWouldLeaveKingInCheck(tilesWithPieces: BoardTileData[], currentTurn: ChessColour, chessBoard: BoardTileData[][]) 
    {
        for (let i = 0; i < tilesWithPieces.length; i++) 
        {
            if (tilesWithPieces[i].pieceOnTile.colour === currentTurn)
            {
                const viableMoves = tilesWithPieces[i].pieceOnTile.viableMoves;
                let stillViableMoves: MovementInformation[] = [];

                for (let j = 0; j < viableMoves.length; j++)
                {
                    const chessBoardCopy = lodash.cloneDeep(chessBoard);
                    const tileCopy = chessBoardCopy[tilesWithPieces[i].position.x][tilesWithPieces[i].position.y];
                    const viableMoveCopy = tileCopy.pieceOnTile.viableMoves[j];
                    const tileToMoveTo = chessBoardCopy[viableMoveCopy.newPosition.x][viableMoveCopy.newPosition.y];

                    ChessMovementController.MovePiece(tileCopy, tileToMoveTo, chessBoardCopy, viableMoveCopy, true);

                    this.ClearThreat(chessBoardCopy);
                    this.GetMovesAndSetThreatened(chessBoardCopy);

                    const kingTile = this.GetKing(currentTurn, chessBoardCopy);

                    if (kingTile && this.CheckKingStatus(currentTurn, kingTile) !== KingStatus.Check) 
                    {
                        stillViableMoves.push(viableMoves[j]);
                    }
                }

                tilesWithPieces[i].pieceOnTile.viableMoves = stillViableMoves;
            }
        }
    }

    private static DoesSideHaveAtLeastOneViableMove(tilesWithPieces: BoardTileData[], currentTurn: ChessColour): boolean
    {
        for (let i = 0; i < tilesWithPieces.length; i++) 
        {
            if (tilesWithPieces[i].pieceOnTile.colour === currentTurn)
            {
                if (tilesWithPieces[i].pieceOnTile.viableMoves.length > 0) return true;
            }
        }
        return false;
    }

    private static GetMovesAndSetThreatened(chessBoard: BoardTileData[][], tilesWithPieces?: BoardTileData[]) 
    {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) 
            {
                const tile = chessBoard[x][y];
                const pieceOnTile = tile.pieceOnTile;

                if (pieceOnTile.type !== ChessPieceType.None) 
                {
                    if (tilesWithPieces) tilesWithPieces.push(tile);
                    pieceOnTile.viableMoves = GetMovesForPiece.GetMoves(tile, chessBoard);
                    GetMovesForPiece.SetThreatenedTiles(pieceOnTile, chessBoard);
                }
            }
        }
    }
    
    private static WhichKingIsInCheckMate(currentTurn: ChessColour, chessBoard: BoardTileData[][]): ChessColour
    {
        const whiteKing = this.GetKing(ChessColour.White, chessBoard);
        const blackKing = this.GetKing(ChessColour.Black, chessBoard);

        if (whiteKing)
        {
            if (blackKing)
            {
                if (currentTurn === ChessColour.White && this.CheckKingStatus(ChessColour.Black, blackKing)) return ChessColour.White;
                if (currentTurn === ChessColour.Black && this.CheckKingStatus(ChessColour.White, whiteKing)) return ChessColour.Black; 
            }
            else return ChessColour.Black; 
        }
        else return ChessColour.White;
        return ChessColour.None;
    }

    static CheckKingStatus(kingColour: ChessColour, tileToCheck:BoardTileData):KingStatus
    {
        if (kingColour === ChessColour.White && tileToCheck.GetThreat(ChessColour.Black)) return KingStatus.Check;
        if (kingColour === ChessColour.Black && tileToCheck.GetThreat(ChessColour.White)) return KingStatus.Check;
        return KingStatus.Okay;
    }

    static EndTurn(Update:() => void)
    {
        ChessData.SetSelectedPiece(null);
        this.ClearBoard(ChessData.GetChessBoard(), true);
        this.NewTurn(Update);
    }
    
    static EndGame(victor: ChessColour)
    {
        const gameState = ChessData.GetGameState();
        ChessData.SetGameState(new GameState(gameState.whiteInCheck, gameState.blackInCheck, victor));
    }
    
    static HandleLeftClickOnTile(positionClicked: BoardPosition, Update:() => void)
    {	
        let updatedChessBoard: BoardTileData[][] = [...ChessData.GetChessBoard()];
    
        const tileClicked = ChessData.GetTileAtPosition(positionClicked);
        let displayPromotion = false;
        let tileSelected = ChessData.GetSelectedPiece();
    
        //If the tile clicked can be moved to and a piece is currently selected
        if (tileClicked.tileState === BoardTileState.Moveable && tileSelected)
        {
            displayPromotion = ChessMovementController.MovePiece(tileSelected, tileClicked, updatedChessBoard);
            ChessData.SetSelectedPiece(ChessData.GetTileAtPosition(positionClicked));
            updatedChessBoard = this.ClearBoard(updatedChessBoard);
    
            if (displayPromotion === false) 
            {
                this.EndTurn(Update);
            }
        }
        //If there is a piece on the tile and it is the colour of the current turn
        else if (tileClicked.pieceOnTile.type !== ChessPieceType.None && tileClicked.pieceOnTile.colour === ChessData.GetCurrentTurn())
        {
            updatedChessBoard = this.ToggleTileSelected(positionClicked, tileClicked, updatedChessBoard)
        }
        //If the tile was blank and can't be moved to
        else updatedChessBoard = this.ClearBoard(updatedChessBoard);
    
        ChessData.SetChessBoard(updatedChessBoard);
        ChessData.SetDisplayPromotion(displayPromotion);

        Update();
    }
    
    static ToggleTileSelected(position: BoardPosition, tile: BoardTileData, chessBoard: BoardTileData[][]):BoardTileData[][]
    {
        const tileState:BoardTileState = (tile.tileState === BoardTileState.Active) ? BoardTileState.None : BoardTileState.Active;
        chessBoard = this.ClearBoard(chessBoard);
    
        if (tileState === BoardTileState.Active)
        {
            ChessData.SetSelectedPiece(ChessData.GetTileAtPosition(position));
    
            for (let i = 0; i < tile.pieceOnTile.viableMoves.length; i++) 
            {
                const move = tile.pieceOnTile.viableMoves[i];
                chessBoard[move.newPosition.x][move.newPosition.y].tileState = BoardTileState.Moveable;
            }
        }
    
        chessBoard[position.x][position.y].tileState = tileState;
    
        return chessBoard;
    }
    
    static GetKing(colour: ChessColour, chessBoard: BoardTileData[][])
    {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++)
            {
                const piece = chessBoard[x][y].pieceOnTile;
                if (piece.type === ChessPieceType.King && piece.colour === colour)
                {
                    return chessBoard[x][y];
                }
            }
        }
    }
    
    static UpdateGameState()
    {
        const chessBoard = ChessData.GetChessBoard();
        const whiteKing = this.GetKing(ChessColour.White, chessBoard);
        const whiteInCheck = whiteKing ? (whiteKing.GetThreat(ChessColour.Black) ? true : false) : true;
        const blackKing = this.GetKing(ChessColour.Black, chessBoard);
        const blackInCheck = blackKing ? (blackKing.GetThreat(ChessColour.White) ? true : false) : true;
    
        ChessData.SetGameState(new GameState(whiteInCheck, blackInCheck, null));
    }
    
    static Checkmate(victor: ChessColour, EndGame: (victor: ChessColour) => void)
    {
        EndGame(victor);
    }
    
    static HandleChoosePromotion(promotionType: ChessPieceType, Update:() => void)
    {
        const selectedPiece = ChessData.GetSelectedPiece();
        if (selectedPiece)
        {
            const promotionTile = ChessData.GetTileAtPosition(selectedPiece.position);
            promotionTile.pieceOnTile.type = promotionType;
        }
        this.EndTurn(Update);
        Update();
    }
    
    static ClearBoard(chessBoard: BoardTileData[][], endTurn?: boolean):BoardTileData[][]
    {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++)
            {
                const tile = chessBoard[x][y];
                tile.tileState = BoardTileState.None;
    
                if (endTurn && tile.pieceOnTile.type === ChessPieceType.Pawn)
                {
                    const pieceOnTile = tile.pieceOnTile;
                    if (pieceOnTile.colour === ChessData.GetCurrentTurn())
                    {
                        pieceOnTile.hasPawnMovedTwoSpacesLastTurn = false;
                    }
                }
            }
        }
        
        return chessBoard;
    }

    static ClearThreat(chessBoard: BoardTileData[][])
    {
        chessBoard.forEach((row) => {
            row.forEach((tile) =>
            {
                tile.ClearThreat();
            });
        });
    }
}