import { IsMoveOnBoard, GetTileNeutrality, MovementResult, CombinePositionWithOffset } from "./GetMovesForPiece";
import { ChessColour, TileNeutrality } from "../utilities/enums";
import BoardPosition from "./BoardPosition";
import TileInfo from "./TileInfo";

const upLeft: BoardPosition = new BoardPosition(-2, -1);
const upRight: BoardPosition = new BoardPosition(-2, +1);
const downLeft: BoardPosition = new BoardPosition(+2, -1);
const downRight: BoardPosition = new BoardPosition(+2, +1);

const leftUp: BoardPosition = new BoardPosition(-1, -2);
const rightUp: BoardPosition = new BoardPosition(-1, +2);
const leftDown: BoardPosition = new BoardPosition(+1, -2);
const rightDown: BoardPosition = new BoardPosition(+1, +2);

function TryMove(currentPosition: BoardPosition, movementOffset: BoardPosition, pieceColour: ChessColour, chessBoard:TileInfo[][]):MovementResult | null
{
    const positionToMoveTo: BoardPosition = CombinePositionWithOffset(currentPosition, movementOffset);

    if (IsMoveOnBoard(positionToMoveTo) === false) return null;
    const tileToMoveTo: TileInfo = chessBoard[positionToMoveTo.x][positionToMoveTo.y];
 
    if (GetTileNeutrality(tileToMoveTo, pieceColour) === TileNeutrality.Friendly) return null;
    if (GetTileNeutrality(tileToMoveTo, pieceColour) === TileNeutrality.Hostile) return new MovementResult(positionToMoveTo, true);
    else return new MovementResult(positionToMoveTo, false);
}

export default function GetMovesForKnight(pieceColour: ChessColour, tile:TileInfo, chessBoard:TileInfo[][]):BoardPosition[]
{
    const offsets: BoardPosition[] = [upLeft, upRight, downLeft, downRight, leftUp, rightUp, leftDown, rightDown];
    const viableMoves: BoardPosition[] = [];

    for (let i = 0; i < offsets.length; i++) 
    {
        let movementResult = TryMove(tile.position, offsets[i], pieceColour, chessBoard);
        if (movementResult)
        {
            viableMoves.push(new BoardPosition(movementResult.newPosition.x, movementResult.newPosition.y));
            //chessBoard[movementResult.newPosition.x][movementResult.newPosition.y].SetTileState(TileState.Moveable);
        }
    }

    return viableMoves;
}