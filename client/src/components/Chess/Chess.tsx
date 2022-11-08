import React, { useState } from 'react';
import './style.css';
import { BoardTile } from '../BoardTile/BoardTile';
import InitialiseChessBoard from '../../chess/InitialiseChessBoard';
import { ChessColour, ChessPieceName, TileState } from '../../utilities/enums';
import GetMovesForPiece, { CombinePositionWithOffset } from '../../chess/GetMovesForPiece';
import TileInfo from '../../chess/TileInfo';
import BoardPosition from '../../chess/BoardPosition';
import ChessPiece from '../../chess/ChessPiece';
import * as offset from '../../chess/MovementOffsets';

const startingFEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

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
	const [selectedPiecePosition, UpdateSelectedPiecePosition] = useState<BoardPosition | null>(null);

	function LeftClickedOnTile(position: BoardPosition)
	{	
		let chessBoardCopy = [...chessBoard];
		const tile = chessBoard[position.x][position.y];

		if (tile.tileState === TileState.Moveable && selectedPiecePosition)
		{
			chessBoardCopy = MovePiece(new BoardPosition(selectedPiecePosition.x, selectedPiecePosition.y), position, chessBoardCopy);
			chessBoardCopy = ClearBoard(chessBoardCopy);
		}
		else if (tile.pieceOnTile.pieceName !== ChessPieceName.None)
		{
			chessBoardCopy = ToggleTileSelected(position, tile, chessBoardCopy)
		}
		else chessBoardCopy = ClearBoard(chessBoardCopy);

		UpdateChessBoard(chessBoardCopy);
	}

	function ToggleTileSelected(position: BoardPosition, tile: TileInfo, chessBoard: TileInfo[][]):TileInfo[][]
	{
		const tileState:TileState = (tile.tileState === TileState.Active) ? TileState.None : TileState.Active;
		chessBoard = ClearBoard(chessBoard);

		if (tileState === TileState.Active)
		{
			UpdateSelectedPiecePosition(position);
			chessBoard = GetMovesForPiece(tile, chessBoard);
		}

		chessBoard[position.x][position.y].SetTileState(tileState);

		return chessBoard;
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

	function ClearBoard(chessBoard: TileInfo[][]):TileInfo[][]
	{
		for (let x = 0; x < 8; x++) {
			for (let y = 0; y < 8; y++)
			{
				chessBoard[x][y].SetTileState(TileState.None);
			}
		}
		return chessBoard;
	}

	function MovePiece(positionToMoveFrom: BoardPosition, positionToMoveTo: BoardPosition, chessBoard: TileInfo[][]):TileInfo[][]
	{
		const tileToMoveFrom = chessBoard[positionToMoveFrom.x][positionToMoveFrom.y];
		const tileToMoveTo = chessBoard[positionToMoveTo.x][positionToMoveTo.y];

		tileToMoveTo.SetPieceOnTile(tileToMoveFrom.pieceOnTile);
		tileToMoveFrom.SetPieceOnTile(new ChessPiece(ChessPieceName.None, ChessColour.None));

		if (tileToMoveTo.pieceOnTile.pieceName === ChessPieceName.Pawn)
		{
			//Moved two spaces
			if ((positionToMoveFrom.x === 6 && positionToMoveTo.x === 4) || (positionToMoveFrom.x === 1 && positionToMoveTo.x === 3)) 
			{
				tileToMoveTo.pieceOnTile.PieceMovedTwoSpaces();
				//IMPLEMENT A WAY TO REMOVE MOVEDTWOSPACES THE TURN AFTER, EN PASSANT CAN ONLY BE DONE IMMEDIATELY AFTER THE PIECE MOVED TWO SPACES
			}
			else
			{
				const pieceColour = tileToMoveTo.pieceOnTile.pieceColour;

				//En passant
				const potentionEnPassantPosition = CombinePositionWithOffset(positionToMoveTo, (pieceColour === ChessColour.White ? offset.down : offset.up));
				const potentionEnPassantTile = chessBoard[potentionEnPassantPosition.x][potentionEnPassantPosition.y];
				if (potentionEnPassantTile.pieceOnTile.pieceName === ChessPieceName.Pawn && potentionEnPassantTile.pieceOnTile.hasMovedTwoSpaces)
				{
					potentionEnPassantTile.SetPieceOnTile(new ChessPiece(ChessPieceName.None, ChessColour.None));
				}

				//Promotion
				if ((pieceColour === ChessColour.White && tileToMoveTo.position.x === 0) || (pieceColour === ChessColour.Black && tileToMoveTo.position.x === 7))
				{
					tileToMoveTo.SetPieceOnTile(new ChessPiece(ChessPieceName.Queen, pieceColour));
					tileToMoveTo.pieceOnTile.PieceMoved();
				}
			}
		}

		tileToMoveTo.pieceOnTile.PieceMoved();

		UpdateSelectedPiecePosition(null);

		return chessBoard;
	}

	const screenWidth:number = window.innerWidth;
	const screenHeight:number = window.innerHeight;

	const boardTileSize:number = GetBoardTileSize(screenWidth, screenHeight);
	const boardCornerPosition:BoardPosition = GetBoardCornerPosition(screenWidth, screenHeight, boardTileSize);

	return (
		<div>
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
		</div>
	);
}