import React from 'react';
import { BoardPosition, BoardTileData } from '../../chess/BoardClasses';
import { ChessColour, ChessPieceType } from '../../utilities/enums';
import './style.css';

interface Props
{
    tile: BoardTileData,
    tileSize: number,
    boardCorner: BoardPosition,
}

function GetLeftPosition(cornerPosition:number, tileSize:number):string
{
    return `${cornerPosition + tileSize * 11}px`
}

function GetColourFromEnum(currentTurn: ChessColour)
{
    return currentTurn === ChessColour.White ? "White" : "Black";
}

function GetTypeFromEnum(type: ChessPieceType)
{
    switch(type)
    {
        case 0: return "None";
        case 1: return "Pawn";
        case 2: return "Knight";
        case 3: return "Rook";
        case 4: return "Bishop";
        case 5: return "Queen";
        case 6: return "King";
        default: return "Can't find type!";
    }
}

export default function DebugInformation(props: Props) 
{
    const leftOffset = GetLeftPosition(props.boardCorner.x, props.tileSize);

    const style = 
    {
        top: props.boardCorner.x,
        left: leftOffset,
    }
    
    return (
        <div className="debugInformation" style={style}>
            <p>-- Debug --</p>
            
            <p>- Tile Information -</p>
            <p>Position: {`${props.tile.position.x}, ${props.tile.position.y}`}</p>
            <p>Tile Colour: {GetColourFromEnum(props.tile.tileColour)}</p>
            <p>Threatened By White?: {(props.tile.GetThreat(ChessColour.White)).toString()}</p>
            <p>Threatened By Black?: {(props.tile.GetThreat(ChessColour.Black)).toString()}</p>
            
            { props.tile.pieceOnTile.type !== ChessPieceType.None ?
                <div>
                    <p>- Piece On Tile Information -</p>
                    <p>Type: {GetTypeFromEnum(props.tile.pieceOnTile.type)}</p>
                    <p>Colour: {GetColourFromEnum(props.tile.pieceOnTile.colour)}</p>
                    <p>Has Moved?: {(props.tile.pieceOnTile.hasMoved).toString()}</p>
                    { props.tile.pieceOnTile.type === ChessPieceType.Pawn && <p>Has Pawn Moved Two Spaces Last Turn?: {(props.tile.pieceOnTile.hasPawnMovedTwoSpacesLastTurn).toString()}</p> }

                    <p>- Moves -</p>

                    { props.tile.pieceOnTile.viableMoves.map((move) => 
                    (
                        <div key={`${move.newPosition.x},${move.newPosition.y}`}>
                            <p>Move Position: {move.newPosition.x},{move.newPosition.y}</p>
                            { props.tile.pieceOnTile.type === ChessPieceType.King ? <p>Castling?: {(move.GetIsMoveCastling()).toString()}</p> : null }
                            { props.tile.pieceOnTile.type === ChessPieceType.Pawn ?
                                <div>
                                    <p>Pawn Moving Two Spaces?: {(move.GetIsPawnMovingTwoSpaces()).toString()}</p>
                                    <p>Promotion?: {(move.GetIsMovePromotion()).toString()}</p>
                                    <p>En Passant?: {(move.GetIsMoveEnPassant()).toString()}</p>
                                </div> : null
                            }
                        </div>  
                    ))}
                </div> : null
            }
        </div>
    );
}