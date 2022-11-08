import React, { useState } from 'react';
import TileInfo from '../../chess/TileInfo';
import { ChessPieceName, TileState } from "../../utilities/enums";
import GetPieceImage from '../../chess/GetPieceImage';
import './style.css';
import BoardPosition from '../../chess/BoardPosition';

const whiteTileColour = "rgb(231 220 220)";
const blackTileColour = "rgb(191 98 98)";

interface Props
{
	tileInfo: TileInfo,
    tileSize: number,
    boardCorner: BoardPosition,
    LeftClickedOnTile: (position: BoardPosition) => void,
    HoveredOnTile: (position: BoardPosition, mouseEnter:boolean) => void,
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

export const BoardTile: React.FC<Props> = (props: Props) =>
{
    function TileClicked()
    {
        //console.log(`${props.tileInfo.xPosition}, ${props.tileInfo.yPosition} tile clicked`);

        props.LeftClickedOnTile(new BoardPosition(props.tileInfo.position.x, props.tileInfo.position.y));
    }

    function ToggleTileHover(mouseEnter:boolean)
    {
        props.HoveredOnTile(new BoardPosition(props.tileInfo.position.x, props.tileInfo.position.y), mouseEnter);
    }

    const topOffset = GetPosition(props.tileInfo.position.x, props.boardCorner.x, props.tileSize);
    const leftOffset = GetPosition(props.tileInfo.position.y, props.boardCorner.y, props.tileSize);

    const tileStyle = 
    {
        top: topOffset,
        left: leftOffset,
        width: props.tileSize,
        height: props.tileSize,
        backgroundColor: GetTileColour(props.tileInfo.position.x, props.tileInfo.position.y),
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
            // onMouseEnter={() => ToggleTileHover(true)}
            //onMouseLeave={() => ToggleTileHover(false)}
            >

            <div className="boardTileText">{`${props.tileInfo.position.x}, ${props.tileInfo.position.y}`}</div>

            { props.tileInfo.tileState === TileState.Active &&
                <div className="boardTile boardTileActive" style={activeStyle}></div>
            }

            { props.tileInfo.tileState === TileState.Hovered &&
                <div className="boardTile boardTileHovered" style={activeStyle}></div>
            }

            { props.tileInfo.tileState === TileState.Moveable &&
                <div className="boardTile boardTileMovable" style={activeStyle}></div>
            }
            
            { props.tileInfo.pieceOnTile.pieceName !== ChessPieceName.None &&
                <img className="boardTileImage" src={GetPieceImage(props.tileInfo.pieceOnTile)} alt={"Chess Piece"}></img>
            }
		</div>
	);
}