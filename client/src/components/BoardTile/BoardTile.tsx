import React, { useState } from 'react';
import { BoardTileInfo } from '../../chess/TileInfo';
import { ChessPieceName } from "../../utilities/enums";
import { GetPieceImage } from '../../chess/GetPieceImage';
import './style.css';

interface Props
{
	tileInfo: BoardTileInfo,
    tileSize: number,
    boardCornerX: number,
    boardCornerY: number,
}

function GetBackgroundColour(xPosition:number, yPosition:number):string
{
    if (xPosition % 2 === 0)
    {
        return (yPosition % 2 === 0 ? "white" : "#62bfb9");
    }
    else return (yPosition % 2 === 0 ? "#62bfb9" : "white");
}

function GetPosition(position:number, cornerPosition:number, tileSize:number):string
{
    return `${cornerPosition + position * tileSize}px`
}

function TileClicked(event: React.MouseEvent<HTMLDivElement>, tileInfo:BoardTileInfo)
{
    console.log(`${tileInfo.xPosition}, ${tileInfo.yPosition} tile clicked`);
}

export const BoardTile: React.FC<Props> = (props: Props) =>
{
    //const [pieceOnTile, SetPieceOnTile] = useState(ChessPiece.None);

    const tileStyle = 
    {
        top: GetPosition(props.tileInfo.xPosition, props.boardCornerX, props.tileSize),
        left: GetPosition(props.tileInfo.yPosition, props.boardCornerY, props.tileSize),
        width: props.tileSize,
        height: props.tileSize,
        backgroundColor: GetBackgroundColour(props.tileInfo.xPosition, props.tileInfo.yPosition),
    }

	return (
		<div className="boardTile" style={tileStyle} onClick={(event) => TileClicked(event, props.tileInfo)}>
			<div className="boardTileText">{`${props.tileInfo.xPosition}, ${props.tileInfo.yPosition}`}</div>
            
            { props.tileInfo.pieceOnTile.pieceName !== ChessPieceName.None &&
                <img className="boardTileImage" src={GetPieceImage(props.tileInfo.pieceOnTile)} alt={"Chess Piece"}></img>
            }
           
		</div>
	);
}