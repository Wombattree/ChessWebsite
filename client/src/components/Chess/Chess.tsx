/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './style.css';
import { BoardTile } from '../BoardTile/BoardTile';
import InitialiseChessBoard from '../../chess/InitialiseChessBoard';
import { ChessColour, ChessPieceName, TileState } from '../../utilities/enums';
import GetMovesForPiece, { SetThreatenedTiles } from '../../chess/GetMovesForPiece';
import TileInfo from '../../chess/TileInfo';
import BoardPosition from '../../chess/BoardPosition';
import { ClearBoard, MovePiece } from '../../chess/ChessController';
import DisplayPromotion from '../DisplayPromotion/DisplayPromotion';
import DisplayInformation from '../DisplayInformation/DisplayInformation';

const startingFEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

export class GameState
{
	whiteInCheck: boolean = false;
	blackInCheck: boolean = false;
	victor: ChessColour | null = null;

	constructor(whiteInCheck: boolean, blackInCheck: boolean, victor: ChessColour | null)
	{
		this.whiteInCheck = whiteInCheck;
		this.blackInCheck = blackInCheck;
		this.victor = victor;
	}
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
	const [currentGameState, SetGameState] = useState(new GameState(false, false, null));

	const showThreatenedTiles: boolean = true;

	useEffect(() => { NewTurn(); }, []);

	function GetKing(colour: ChessColour)
	{
		for (let x = 0; x < 8; x++) {
			for (let y = 0; y < 8; y++)
			{
				const piece = chessBoard[x][y].pieceOnTile;
				if (piece.pieceName === ChessPieceName.King)
				{
					if (piece.pieceColour === colour) return chessBoard[x][y];
				}
			}
		}
	}

	function UpdateGameState()
	{
		const whiteKing = GetKing(ChessColour.White);
		const whiteInCheck = whiteKing ? (whiteKing.threatenedByBlack ? true : false) : false;
		const blackKing = GetKing(ChessColour.Black);
    	const blackInCheck = blackKing ? (blackKing.threatenedByWhite ? true : false) : false;
		const checkmateStatus = CheckmateStatus();

		SetGameState(new GameState(whiteInCheck, blackInCheck, checkmateStatus));
	}

	function CheckmateStatus():ChessColour | null
	{
		return null;
	}

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

			for (let i = 0; i < tile.pieceOnTile.viableMoves.length; i++) 
			{
				const move = tile.pieceOnTile.viableMoves[i];
				chessBoard[move.x][move.y].SetTileState(TileState.Moveable);
			}
		}

		chessBoard[position.x][position.y].SetTileState(tileState);

		return chessBoard;
	}

	function NewTurn()
	{
		for (let x = 0; x < 8; x++) {
			for (let y = 0; y < 8; y++)
			{
				const tile = chessBoard[x][y];
				const pieceOnTile = tile.pieceOnTile;
				tile.ClearThreat();
				if (pieceOnTile.pieceName !== ChessPieceName.None)
				{
					const viableMoves = GetMovesForPiece(tile, chessBoard);
					tile.pieceOnTile.SetViableMoves(viableMoves);
					SetThreatenedTiles(pieceOnTile.pieceColour, viableMoves, chessBoard);
				}
			}
		}

		UpdateGameState();
	}

	function EndTurn()
	{
		UpdateSelectedPiecePosition(null);
		if (currentTurn === ChessColour.White) SetCurrentTurn(ChessColour.Black);
		else SetCurrentTurn(ChessColour.White);

		NewTurn();
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
				gameState={currentGameState}
				currentTurn={currentTurn} 
				tileSize={boardTileSize} 
				boardCorner={boardCornerPosition}
			/>

			{ chessBoard.map((boardRow) => 
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
						showThreatenedTiles={showThreatenedTiles}
						turn={currentTurn}
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