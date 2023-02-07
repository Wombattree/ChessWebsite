import React from 'react';
import { BoardPosition } from '../../chess/BoardClasses';
import { GameState } from '../../chess/InformationClasses';
import { ChessColour } from '../../utilities/enums';
import './style.css';

interface Props
{
	gameState: GameState,
    currentTurn: ChessColour,
    playerTurn: ChessColour,
    tileSize: number,
    boardCorner: BoardPosition,
}

function GetTopPosition(cornerPosition:number, tileSize:number):string
{
    return `${cornerPosition - 1.5 * tileSize}px`
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

function GetCheckMessage(whiteInCheck: boolean, blackInCheck: boolean):string
{
    if (whiteInCheck && blackInCheck) return "Both kings are in check";
    if (whiteInCheck) return "The white king is in check";
    if (blackInCheck) return "The black king is in check";
    return "";
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

    if (props.gameState.victor)
    {
        return (
            <div className="informationDisplay" style={style}>
                {GetVictoryMessage(props.gameState.victor)}
            </div>
        );
    }
    else
    {
        return (
            <div className="informationDisplay" style={style}>
                <p>{GetCurrentTurnMessage(props.currentTurn)}: {props.currentTurn === props.playerTurn ? "Your Turn" : "Computer's Turn"}</p>
                <p>{GetCheckMessage(props.gameState.whiteInCheck, props.gameState.blackInCheck)}</p>
            </div>
        )
    }
}