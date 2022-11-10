import React, { useState } from 'react';
import './style.css';
import { BoardTile } from '../BoardTile/BoardTile';
import InitialiseChessBoard from '../../chess/InitialiseChessBoard';
import { ChessColour, ChessPieceName, TileState } from '../../utilities/enums';
import GetMovesForPiece from '../../chess/GetMovesForPiece';
import TileInfo from '../../chess/TileInfo';
import BoardPosition from '../../chess/BoardPosition';
import { ClearBoard, MovePiece } from '../../chess/ChessController';
import DisplayPromotion from '../DisplayPromotion/DisplayPromotion';
import DisplayInformation from '../DisplayInformation/DisplayInformation';

const startingFEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

class GameState
{
	whiteInCheck: boolean = false;
	blackInCheck: boolean = false;
	victor: ChessColour | null = null;
}

function GetBoardTileSize(screenWidth:number, screenHeight:number):number
{
	return (Math.max(screenWidth / 20, screenHeight / 20));
}

function GetBoardCornerPosition(screenWidth:number, screenHeight:number, boardTileSize:number):BoardPosition
{
	return new BoardPosition(screenHeight * 0.5 - boardTileSize * 4, screenWidth * 0.5 - boardTileSize * 4);
}

export default function Chess()
{
	const [chessBoard, UpdateChessBoard] = useState(InitialiseChessBoard(startingFEN));
	const [currentTurn, SetCurrentTurn] = useState(ChessColour.White);
	const [selectedPiecePosition, UpdateSelectedPiecePosition] = useState<BoardPosition | null>(null);
	const [displayPromotionChoices, SetDisplayPromotionChoices] = useState(false);
	const [currentGameState, SetGameState] = useState(new GameState());

	function LeftClickedOnTile(position: BoardPosition)
	{	
		let chessBoardCopy = [...chessBoard];
		const tile = chessBoard[position.x][position.y];

		if (tile.tileState === TileState.Moveable && selectedPiecePosition)
		{
			const [updatedChessBoard, displayPromotion] = MovePiece(new BoardPosition(selectedPiecePosition.x, selectedPiecePosition.y), position, chessBoardCopy, EndGame);
			chessBoardCopy = updatedChessBoard;
			SetDisplayPromotionChoices(displayPromotion);
			UpdateSelectedPiecePosition(position);
			chessBoardCopy = ClearBoard(chessBoardCopy, true, currentTurn);
			if (displayPromotion === false) EndTurn();
		}
		else if (tile.pieceOnTile.pieceName !== ChessPieceName.None)
		{
			if (tile.pieceOnTile.pieceColour === currentTurn)
			{
				chessBoardCopy = ToggleTileSelected(position, tile, chessBoardCopy)
			}
		}
		else chessBoardCopy = ClearBoard(chessBoardCopy, false, ChessColour.None);

		UpdateChessBoard(chessBoardCopy);
	}

	function ToggleTileSelected(position: BoardPosition, tile: TileInfo, chessBoard: TileInfo[][]):TileInfo[][]
	{
		const tileState:TileState = (tile.tileState === TileState.Active) ? TileState.None : TileState.Active;
		chessBoard = ClearBoard(chessBoard, false, ChessColour.None);

		if (tileState === TileState.Active)
		{
			UpdateSelectedPiecePosition(position);
			chessBoard = GetMovesForPiece(tile, chessBoard);
		}

		chessBoard[position.x][position.y].SetTileState(tileState);

		return chessBoard;
	}

	function NewTurn()
	{
		
	}

	function EndTurn()
	{
		UpdateSelectedPiecePosition(null);
		if (currentTurn === ChessColour.White) SetCurrentTurn(ChessColour.Black);
		else SetCurrentTurn(ChessColour.White);
	}

	function EndGame(victor: ChessColour)
	{
		const gameState = currentGameState;
		gameState.victor = victor;
		SetGameState(gameState);
	}

	function HoveredOnTile(position: BoardPosition, mouseEnter:boolean)
	{	
		let chessBoardCopy = [...chessBoard];
		const tile = chessBoard[position.x][position.y];

		let tileState:TileState = TileState.None;

		if (tile.tileState !== TileState.Active)
		{
			if (mouseEnter) tileState = TileState.Hovered;
			else tileState = TileState.None;
		}
		else tileState = TileState.Active;
		
		chessBoardCopy[position.x][position.y].SetTileState(tileState);

		UpdateChessBoard(chessBoardCopy);
	}

	function ChoosePromotion(promotionPiece: ChessPieceName)
	{
		if (selectedPiecePosition)
		{
			const promotionTile = chessBoard[selectedPiecePosition.x][selectedPiecePosition.y];
			promotionTile.pieceOnTile.pieceName = promotionPiece;
			SetDisplayPromotionChoices(false);
		}
		EndTurn();
	}
	
	const screenWidth:number = window.innerWidth;
	const screenHeight:number = window.innerHeight;

	const boardTileSize:number = GetBoardTileSize(screenWidth, screenHeight);
	const boardCornerPosition:BoardPosition = GetBoardCornerPosition(screenWidth, screenHeight, boardTileSize);

	return (
		<div>
			<DisplayInformation
				victor={currentGameState.victor}
				currentTurn={currentTurn} 
				tileSize={boardTileSize} 
				boardCorner={boardCornerPosition} 
			/>

			{chessBoard.map((boardRow) => 
			(
				boardRow.map((boardTileInfo) => 
				(
					<BoardTile 
						key={`${boardTileInfo.position.x}, ${boardTileInfo.position.y}`} 
						tileInfo={boardTileInfo} 
						tileSize={boardTileSize} 
						boardCorner={boardCornerPosition} 
						LeftClickedOnTile={LeftClickedOnTile}
						HoveredOnTile={HoveredOnTile}
					/>
				))
          	))}

			{ displayPromotionChoices &&
                <DisplayPromotion
					currentTurn={currentTurn} 
					tileSize={boardTileSize} 
					boardCorner={boardCornerPosition}
					ChoosePromotion={ChoosePromotion}
				/>
            }
		</div>
	);
}