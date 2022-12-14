import React from 'react';
import { BoardPosition } from '../../chess/BoardClasses';
import { ChessColour, ChessPieceType } from "../../utilities/enums";
import DisplayPromotionImage from '../DisplayPromotionImage/DisplayPromotionImage';
import './style.css';

interface Props
{
	currentTurn: ChessColour,
    tileSize: number,
    boardCorner: BoardPosition,
    ChoosePromotion: (pieceChosen: ChessPieceType) => void,
}

class PromotionImage
{
    boardPosition: number;
    piece: ChessPieceType;

    constructor(boardPosition: number, piece: ChessPieceType)
    {
        this.boardPosition = boardPosition;
        this.piece = piece;
    }
}

const promotionImages: PromotionImage[] = 
[
    new PromotionImage(2, ChessPieceType.Queen),
    new PromotionImage(3, ChessPieceType.Rook),
    new PromotionImage(4, ChessPieceType.Bishop),
    new PromotionImage(5, ChessPieceType.Knight),
]

function GetTopPosition(cornerPosition:number, tileSize:number)
{
    return cornerPosition + 8.25 * tileSize;
}

function GetLeftPosition(tileSize:number):string
{
    const screenWidth: number = window.innerWidth;
    return `${screenWidth * 0.5 - 4 * tileSize}px`
}

function GetImagePosition(position:number, cornerPosition:number, tileSize:number):number
{
    return cornerPosition + position * tileSize;
}

function GetWidth(tileSize:number):string
{
    return `${8 * tileSize}px`
}

export default function DisplayPromotion(props: Props) 
{
    const topOffset = GetTopPosition(props.boardCorner.x, props.tileSize);
    const imageTopOffset = topOffset + 50;
    const leftOffset = GetLeftPosition(props.tileSize);
    const width = GetWidth(props.tileSize);

    const style = 
    {
        top: topOffset,
        left: leftOffset,
        width: width,
    }

    return (
        <div className="displayPromotionHeader" style={style}>
            Which piece would you like your pawn to become?
            
            {promotionImages.map((promotionImage) => 
            (
                <DisplayPromotionImage
                    key={promotionImage.boardPosition}
                    topOffset={imageTopOffset} 
                    leftOffset={GetImagePosition(promotionImage.boardPosition, props.boardCorner.y, props.tileSize)} 
                    tileSize={props.tileSize}
                    pieceName={promotionImage.piece}
                    pieceColour={props.currentTurn}
                    ChoosePromotion={props.ChoosePromotion}
                />
            ))}
        </div>
    );
}