import ChessPiece from "../../chess/ChessPiece";
import GetPieceImage from "../../chess/GetPieceImage";
import { ChessColour, ChessPieceType } from "../../utilities/enums";

interface Props
{
    topOffset: number, 
    leftOffset: number, 
    tileSize: number, 
    pieceName: ChessPieceType, 
    pieceColour: ChessColour, 
    ChoosePromotion: (pieceChosen: ChessPieceType) => void
}

export default function DisplayPromotionImage(props: Props) 
{
    return (
        <img className="displayPromotionImage" 
            style={{top: props.topOffset, left: props.leftOffset, width: props.tileSize, height: props.tileSize}} 
            src={GetPieceImage(new ChessPiece(props.pieceName, props.pieceColour))}
            alt={"Chess Piece"}
            onClick={() => props.ChoosePromotion(props.pieceName)}
        ></img>
    );
}