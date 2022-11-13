import { ChessPieceType, ChessColour, BoardTileState, KingStatus } from "../utilities/enums";
import GetMovesForPiece, { SetThreatenedTiles } from "./GetMovesForPiece";
import { BoardTileData, BoardPosition } from "./BoardClasses";
import { ChessData, GameState } from "./InformationClasses";
import ChessMovementController from "./ChessMovementController";
import { MovementInformation } from "./MovementClasses";
import lodash from "lodash";

export default class ChessController
{
    static StartGame(Update:() => void)
    {
        ChessData.InitialiseChessBoard();
        this.NewTurn();
        Update();
    }
    
    static NewTurn()
    {
        const chessBoard = ChessData.GetChessBoard();
        const currentTurn = ChessData.GetCurrentTurn();
        ChessData.ClearThreat();

        // const chessBoardCopy = this.DeepCopyBoard(ChessData.GetChessBoard());

        // for (let x = 0; x < 8; x++) {
        //     for (let y = 0; y < 8; y++)
        //     {
        //         const copyTile = chessBoardCopy[x][y];
        //         const pieceOnCopyTile = copyTile.pieceOnTile;
    
        //         if (pieceOnCopyTile.type !== ChessPieceType.None)
        //         {
        //             pieceOnCopyTile.viableMoves = GetMovesForPiece(copyTile);
        //             SetThreatenedTiles(pieceOnCopyTile, chessBoardCopy);
        //         }
        //     }
        // }
        let tilesWithPieces: BoardTileData[] = [];
        
        this.GetMovesAndSetThreatened(chessBoard, tilesWithPieces);

        // let chessBoardCopy = lodash.cloneDeep(chessBoard);
        // chessBoardCopy[3][4].pieceOnTile = new ChessPiece(ChessPieceType.Queen, ChessColour.Black);
        // console.log(chessBoardCopy[3][4]);
        // console.log(chessBoard[3][4]);

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

                    this.GetMovesAndSetThreatened(chessBoardCopy);

                    const king = this.GetKing(ChessData.GetCurrentTurn(), chessBoardCopy);

                    if (king && this.CheckKingStatus(ChessData.GetCurrentTurn(), king) !== KingStatus.Check)
                    {
                        stillViableMoves.push(viableMoves[j]);
                        console.log("Viable move");
                    }
                    else if (!king) console.log("No king!");
                    else if (this.CheckKingStatus(ChessData.GetCurrentTurn(), king) === KingStatus.Check) console.log("Check");
                }

                tilesWithPieces[i].pieceOnTile.viableMoves = stillViableMoves;
            }
        }
        
        this.UpdateGameState();
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
                    pieceOnTile.viableMoves = GetMovesForPiece(tile, chessBoard);
                    SetThreatenedTiles(pieceOnTile, chessBoard);
                }
            }
        }
    }
    
    static CheckKingStatus(kingColour: ChessColour, tileToCheck:BoardTileData):KingStatus
    {
        if (kingColour === ChessColour.White && tileToCheck.GetThreat(ChessColour.Black)) return KingStatus.Check;
        if (kingColour === ChessColour.Black && tileToCheck.GetThreat(ChessColour.White)) return KingStatus.Check;
        return KingStatus.Okay;
    }

    // private static DeepCopyBoard(originalBoard: BoardTileData[][]): BoardTileData[][]
    // {
    //     const chessBoardCopy: BoardTileData[][] = [[],[],[],[],[],[],[],[]];

    //     for (let x = 0; x < 8; x++) {
    //         for (let y = 0; y < 8; y++) 
    //         {
    //             const boardTileOriginal = originalBoard[x][y];
    //             const boardTileCopy = new BoardTileData(new BoardPosition(x, y));

    //             const pieceOnTileOriginal = boardTileOriginal.pieceOnTile;
    //             const pieceOnTileCopy = new ChessPiece(pieceOnTileOriginal.type, pieceOnTileOriginal.colour);
    //             pieceOnTileCopy.hasMoved = pieceOnTileOriginal.hasMoved;
    //             pieceOnTileCopy.hasPawnMovedTwoSpacesLastTurn = pieceOnTileOriginal.hasPawnMovedTwoSpacesLastTurn;

    //             boardTileCopy.pieceOnTile = pieceOnTileCopy;

    //             chessBoardCopy[x][y] = boardTileCopy;
    //         }
    //     }

    //     return chessBoardCopy;
    // }

    static EndTurn()
    {
        ChessData.SetSelectedPiece(null);
        ChessData.ToggleCurrentTurn();
        this.ClearBoard(ChessData.GetChessBoard(), true);
        this.NewTurn();
    }
    
    static EndGame(victor: ChessColour)
    {
        const gameState = ChessData.GetGameState();
        ChessData.SetGameState(new GameState(gameState.whiteInCheck, gameState.whiteInCheck, victor));
        console.log("Game Ended");
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
                this.EndTurn();
            }
        }
        //If there is a piece on the tile and it is the colour of the current turn
        else if (tileClicked.pieceOnTile.type !== ChessPieceType.None && tileClicked.pieceOnTile.colour === ChessData.GetCurrentTurn())
        {
            updatedChessBoard = this.ToggleTileSelected(positionClicked, tileClicked, updatedChessBoard)
        }
        //If the tile was blank
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
                if (piece.type === ChessPieceType.King)
                {
                    if (piece.colour === colour) return chessBoard[x][y];
                }
            }
        }
    }
    
    static UpdateGameState()
    {
        const chessBoard = ChessData.GetChessBoard();
        const whiteKing = this.GetKing(ChessColour.White, chessBoard);
        const whiteInCheck = whiteKing ? (whiteKing.GetThreat(ChessColour.Black) ? true : false) : false;
        const blackKing = this.GetKing(ChessColour.Black, chessBoard);
        const blackInCheck = blackKing ? (blackKing.GetThreat(ChessColour.White) ? true : false) : false;
        const checkmateStatus = this.CheckmateStatus();
    
        ChessData.SetGameState(new GameState(whiteInCheck, blackInCheck, checkmateStatus));
    }
    
    static CheckmateStatus():ChessColour | null
    {
        return null;
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
        this.EndTurn();
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
}