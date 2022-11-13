import { ChessPieceType, ChessColour, BoardTileState } from "../utilities/enums";
import GetMovesForPiece, { SetThreatenedTiles } from "./GetMovesForPiece";
import { BoardTileData, BoardPosition } from "./BoardClasses";
import { ChessData, GameState } from "./InformationClasses";
import { ChessMovementController } from "./ChessMovementController";

export class ChessController
{
    static StartGame(Update:() => void)
    {
        ChessData.InitialiseChessBoard();
        ChessController.NewTurn();
        Update();
    }
    
    static NewTurn()
    {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++)
            {
                ChessData.GetTileAtPosition(new BoardPosition(x, y)).ClearThreat();
            }
        }

        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++)
            {
                const tile = ChessData.GetTileAtPosition(new BoardPosition(x, y));
                const pieceOnTile = tile.pieceOnTile;
    
                if (pieceOnTile.type !== ChessPieceType.None)
                {
                    pieceOnTile.viableMoves = GetMovesForPiece(tile);
                    SetThreatenedTiles(pieceOnTile);
                }
            }
        }
        
        ChessController.UpdateGameState();
    }
    
    static EndTurn()
    {
        ChessData.SetSelectedPiece(null);
        ChessData.ToggleCurrentTurn();
        ChessController.ClearBoard(ChessData.GetChessBoard(), true);
        ChessController.NewTurn();
    }
    
    static EndGame(victor: ChessColour)
    {
        const gameState = ChessData.GetGameState();
        ChessData.SetGameState(new GameState(gameState.whiteInCheck, gameState.whiteInCheck, victor));
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
            [updatedChessBoard, displayPromotion] = ChessMovementController.MovePiece(tileSelected.pieceOnTile, tileSelected, tileClicked, updatedChessBoard);
            ChessData.SetSelectedPiece(ChessData.GetTileAtPosition(positionClicked));
            updatedChessBoard = ChessController.ClearBoard(updatedChessBoard);
    
            if (displayPromotion === false) 
            {
                ChessController.EndTurn();
            }
        }
        //If there is a piece on the tile and it is the colour of the current turn
        else if (tileClicked.pieceOnTile.type !== ChessPieceType.None && tileClicked.pieceOnTile.colour === ChessData.GetCurrentTurn())
        {
            updatedChessBoard = ChessController.ToggleTileSelected(positionClicked, tileClicked, updatedChessBoard)
        }
        //If the tile was blank
        else updatedChessBoard = ChessController.ClearBoard(updatedChessBoard);
    
        ChessData.SetChessBoard(updatedChessBoard);
        ChessData.SetDisplayPromotion(displayPromotion);

        Update();
    }
    
    static ToggleTileSelected(position: BoardPosition, tile: BoardTileData, chessBoard: BoardTileData[][]):BoardTileData[][]
    {
        const tileState:BoardTileState = (tile.tileState === BoardTileState.Active) ? BoardTileState.None : BoardTileState.Active;
        chessBoard = ChessController.ClearBoard(chessBoard);
    
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
        const whiteKing = ChessController.GetKing(ChessColour.White, chessBoard);
        const whiteInCheck = whiteKing ? (whiteKing.GetThreat(ChessColour.Black) ? true : false) : false;
        const blackKing = ChessController.GetKing(ChessColour.Black, chessBoard);
        const blackInCheck = blackKing ? (blackKing.GetThreat(ChessColour.White) ? true : false) : false;
        const checkmateStatus = ChessController.CheckmateStatus();
    
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
        ChessController.EndTurn();
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