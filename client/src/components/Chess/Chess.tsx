import React, { useState } from 'react';
import './style.css';
import { BoardTileInfo } from '../../chess/TileInfo';
import { BoardTile } from '../BoardTile/BoardTile';
import { ChessPieceName, ChessColour } from '../../utilities/enums';
import { GetPieceImage } from '../../chess/GetPieceImage';
import { ChessPiece } from '../../chess/ChessPiece';
import InitialiseChessBoard from '../../chess/InitialiseChessBoard';

function GetBoardTileSize(screenWidth:number, screenHeight:number):number
{
	return (Math.max(screenWidth / 20, screenHeight / 20));
}

function GetBoardCornerPosition(screenWidth:number, screenHeight:number, boardTileSize:number):number[]
{
	return [screenHeight * 0.5 - boardTileSize * 4, screenWidth * 0.5 - boardTileSize * 4];
}

export default function Chess() 
{
	//const chessBoard:BoardTileInfo[][] = InitialiseChessBoard("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
	const [chessBoard, UpdateChessBoard] = useState(InitialiseChessBoard("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"));

	function SetTileActive(xPosition:number, yPosition:number)
	{
		
	}

	const screenWidth:number = window.innerWidth;
	const screenHeight:number = window.innerHeight;

	const boardTileSize:number = GetBoardTileSize(screenWidth, screenHeight);
	const boardCornerPosition:number[] = GetBoardCornerPosition(screenWidth, screenHeight, boardTileSize);

	return (
		<div>
			{chessBoard.map((boardRow) => 
			(
				boardRow.map((boardTileInfo) => 
				(
					<BoardTile 
						key={`${boardTileInfo.xPosition}, ${boardTileInfo.yPosition}`} 
						tileInfo={boardTileInfo} tileSize={boardTileSize} boardCornerX={boardCornerPosition[0]} boardCornerY={boardCornerPosition[1]} 
					/>
				))
          	))}
		</div>
	);
}