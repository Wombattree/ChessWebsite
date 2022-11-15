/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './style.css';
import { ChessColour, ChessPieceType } from '../../utilities/enums';
import ChessController from '../../chess/ChessController';
import DisplayPromotion from '../DisplayPromotion/DisplayPromotion';
import DisplayInformation from '../DisplayInformation/DisplayInformation';
import { BoardPosition, BoardTileData } from '../../chess/BoardClasses';
import { ChessData, GameState } from '../../chess/InformationClasses';
import BoardTile from '../BoardTile/BoardTile';
import DebugInformation from '../DebugInformation/DebugInformation';

export default function Chess()
{
	const [chessBoard, SetChessBoard] = useState<BoardTileData[][]>(ChessData.InitialiseChessBoard());
	const [currentTurn, SetCurrentTurn] = useState(ChessColour.White);
	const [playerTurn, SetPlayerTurn] = useState(ChessColour.None);
	const [displayPromotionChoices, SetDisplayPromotionChoices] = useState(false);
	const [currentGameState, SetGameState] = useState(new GameState(false, false, null));

	const [displayDebugInfo, SetDisplayDebugInfo] = useState<BoardTileData | null>(null);

	const debugMode: boolean = false;

	useEffect(() => { ChessController.StartGame(Update); }, []);

	function Update()
	{
		SetChessBoard(ChessData.GetChessBoard());
		SetDisplayPromotionChoices(ChessData.GetDisplayPromotion());
		SetCurrentTurn(ChessData.GetCurrentTurn());
		SetPlayerTurn(ChessData.GetPlayerTurn());
		SetGameState(ChessData.GetGameState());
	}

	function LeftClickedOnTile(position: BoardPosition)
	{	
		if (currentTurn === playerTurn && !currentGameState.victor) ChessController.HandleLeftClickOnTile(position, Update);
	}

	function ChoosePromotion(promotionType: ChessPieceType)
	{
		ChessController.HandleChoosePromotion(promotionType, Update);
	}

	function HoveredOnTile(position: BoardPosition, mouseEnter:boolean)
	{	
		if (mouseEnter) SetDisplayDebugInfo(ChessData.GetTileAtPosition(position));
		else SetDisplayDebugInfo(null);
	}
	
	const screenWidth:number = window.innerWidth;
	const screenHeight:number = window.innerHeight;

	const boardTileSize:number = GetBoardTileSize();
	const boardCornerPosition:BoardPosition = GetBoardCornerPosition();

	function GetBoardTileSize():number
	{
		return (Math.min((screenWidth * 0.6) / 8, (screenHeight * 0.6) / 8));
	}

	function GetBoardCornerPosition():BoardPosition
	{
		return new BoardPosition(screenHeight * 0.5 - boardTileSize * 4, screenWidth * 0.5 - boardTileSize * 4);
	}

	function GetBorderPosition(cornerPosition:number):string
	{
		return `${cornerPosition - 0.25 * boardTileSize}px`
	}

	const borderStyle = 
    {
        top: GetBorderPosition(boardCornerPosition.x),
        left: GetBorderPosition(boardCornerPosition.y),
        width: boardTileSize * 8.5,
        height: boardTileSize * 8.5,
    }

	function GetInnerBorderPosition(cornerPosition:number):string
	{
		return `${cornerPosition - 0.125 * boardTileSize}px`
	}

	const innerBorderStyle = 
    {
        top: GetInnerBorderPosition(boardCornerPosition.x),
        left: GetInnerBorderPosition(boardCornerPosition.y),
        width: boardTileSize * 8.25,
        height: boardTileSize * 8.25,
    }

	return (
		<div>
			<div style={borderStyle} className={`chessBorder backgroundLight`}></div>
			<div style={innerBorderStyle} className={`chessBorder backgroundMedium`}></div>
			
			<DisplayInformation
				gameState={currentGameState}
				currentTurn={currentTurn} 
				playerTurn={playerTurn}
				tileSize={boardTileSize} 
				boardCorner={boardCornerPosition}
			/>

			{ chessBoard.map((boardRow) => (
				boardRow.map((boardTileData) => 
				(
					<BoardTile
						key={`${boardTileData.position.x}, ${boardTileData.position.y}`} 
						boardTileData={boardTileData} 
						tileSize={boardTileSize} 
						boardCorner={boardCornerPosition} 
						LeftClickedOnTile={LeftClickedOnTile}
						HoveredOnTile={HoveredOnTile}
						debugMode={debugMode}
						currentTurn={currentTurn}
					/>
				))
          	))}

			{ displayPromotionChoices ?
                <DisplayPromotion
					currentTurn={currentTurn} 
					tileSize={boardTileSize} 
					boardCorner={boardCornerPosition}
					ChoosePromotion={ChoosePromotion}
				/> : null
            }

			{ displayDebugInfo ?
				<DebugInformation
					tile={displayDebugInfo}
					tileSize={boardTileSize} 
					boardCorner={boardCornerPosition}
				/> : null
		}	
		</div>
	);
}