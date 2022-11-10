import ChessPiece from "../../chess/ChessPiece";
import GetPieceImage from "../../chess/GetPieceImage";
import { ChessColour, ChessPieceName } from "../../utilities/enums";

interface Props
{
    topOffset: number, 
    leftOffset: number, 
    tileSize: number, 
    pieceName: ChessPieceName, 
    pieceColour: ChessColour, 
    ChoosePromotion: (pieceChosen: ChessPieceName) => void
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