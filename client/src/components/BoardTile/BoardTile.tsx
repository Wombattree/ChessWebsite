import React from 'react';
import { ChessColour, ChessPieceType, BoardTileState } from "../../utilities/enums";
import GetPieceImage from '../../chess/GetPieceImage';
import './style.css';
import { BoardPosition, BoardTileData } from '../../chess/BoardClasses';

const whiteTileColour = "rgb(231 220 220)";
const blackTileColour = "rgb(191 98 98)";

interface Props
{
	boardTileData: BoardTileData,
    tileSize: number,
    boardCorner: BoardPosition,
    LeftClickedOnTile: (position: BoardPosition) => void,
    HoveredOnTile: (position: BoardPosition, mouseEnter: boolean) => void,
    debugMode: boolean,
    currentTurn: ChessColour,
}

function GetTileColour(xPosition:number, yPosition:number):string
{
    if (xPosition % 2 === 0)
    {
        return (yPosition % 2 === 0 ? whiteTileColour : blackTileColour);
    }
    else return (yPosition % 2 === 0 ? blackTileColour : whiteTileColour);
}

function GetPosition(position:number, cornerPosition:number, tileSize:number):string
{
    return `${cornerPosition + position * tileSize}px`
}

function ShowWhiteThreatenedTiles(props: Props): boolean
{
    if (props.debugMode && props.boardTileData.GetThreat(ChessColour.White) && props.currentTurn === ChessColour.White) return true;
    else return false;
}

function ShowBlackThreatenedTiles(props: Props): boolean
{
    if (props.debugMode && props.boardTileData.GetThreat(ChessColour.Black) && props.currentTurn === ChessColour.Black) return true;
    else return false;
}

export default function BoardTile (props: Props)
{
    function TileClicked()
    {
        props.LeftClickedOnTile(new BoardPosition(props.boardTileData.position.x, props.boardTileData.position.y));
    }

    function ToggleTileHover(mouseEnter:boolean)
    {
        if (props.debugMode) props.HoveredOnTile(props.boardTileData.position, mouseEnter);
    }

    const topOffset = GetPosition(props.boardTileData.position.x, props.boardCorner.x, props.tileSize);
    const leftOffset = GetPosition(props.boardTileData.position.y, props.boardCorner.y, props.tileSize);

    const tileStyle = 
    {
        top: topOffset,
        left: leftOffset,
        width: props.tileSize,
        height: props.tileSize,
        backgroundColor: GetTileColour(props.boardTileData.position.x, props.boardTileData.position.y),
    }

    const activeStyle = 
    {
        top: topOffset,
        left: leftOffset,
        width: props.tileSize,
        height: props.tileSize,
    }

	return (
		<div className="boardTile" style={tileStyle} 
            onClick={() => TileClicked()} 
            onMouseEnter={() => ToggleTileHover(true)}
            onMouseLeave={() => ToggleTileHover(false)}
            >

            <div className="boardTileText">{`${props.boardTileData.position.x}, ${props.boardTileData.position.y}`}</div>

            { props.boardTileData.tileState === BoardTileState.Active &&
                <div className="boardTile boardTileActive" style={activeStyle}></div>
            }

            { props.boardTileData.tileState === BoardTileState.Hovered &&
                <div className="boardTile boardTileHovered" style={activeStyle}></div>
            }

            { props.boardTileData.tileState === BoardTileState.Moveable &&
                <div className="boardTile boardTileMovable" style={activeStyle}></div>
            }

            { ShowWhiteThreatenedTiles(props) &&
                <div className="boardTile boardTileThreatenedWhite" style={activeStyle}></div>
            }

            { ShowBlackThreatenedTiles(props) &&
                <div className="boardTile boardTileThreatenedBlack" style={activeStyle}></div>
            }
            
            { props.boardTileData.pieceOnTile.type !== ChessPieceType.None &&
                <img className="boardTileImage" src={GetPieceImage(props.boardTileData.pieceOnTile)} alt={"Chess Piece"}></img>
            }
		</div>
	);
}