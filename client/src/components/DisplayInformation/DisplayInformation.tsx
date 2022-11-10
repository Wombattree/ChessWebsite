import React from 'react';
import BoardPosition from '../../chess/BoardPosition';
import { ChessColour } from '../../utilities/enums';
import './style.css';

interface Props
{
	victor: ChessColour | null,
    currentTurn: ChessColour,
    tileSize: number,
    boardCorner: BoardPosition,
}

function GetTopPosition(cornerPosition:number, tileSize:number):string
{
    return `${cornerPosition - 0.75 * tileSize}px`
}

function GetLeftPosition(tileSize:number):string
{
    const screenWidth: number = window.innerWidth;
    return `${screenWidth * 0.5 - 4 * tileSize}px`
}

function GetWidth(tileSize:number):string
{
    return `${8 * tileSize}px`
}

function GetVictoryMessage(victor: ChessColour):string
{
    if (victor === ChessColour.White) return "Checkmate, white wins!";
    else if (victor === ChessColour.Black) return "Checkmate, black wins!";
    else return "Draw!";
}

function GetCurrentTurnMessage(currentTurn: ChessColour)
{
    return currentTurn === ChessColour.White ? "White" : "Black";
}

export default function DisplayInformation(props: Props) 
{
    const topOffset = GetTopPosition(props.boardCorner.x, props.tileSize);
    const leftOffset = GetLeftPosition(props.tileSize);
    const width = GetWidth(props.tileSize);
    
    const style = 
    {
        top: topOffset,
        left: leftOffset,
        width: width,
    }

    if (props.victor)
    {
        return (
            <div className="informationDisplay" style={style}>
                {GetVictoryMessage(props.victor)}
            </div>
        );
    }
    else
    {
        return (
            <div className="informationDisplay" style={style}>
                Current Turn: {GetCurrentTurnMessage(props.currentTurn)}
            </div>
        )
    }
}