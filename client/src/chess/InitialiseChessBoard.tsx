import { ChessPiece } from "./ChessPiece";
import LoadPositionFromFen from "./LoadPositionFromFen";
import { BoardTileInfo } from "./TileInfo";

export default function SetupBoard(fen:string):BoardTileInfo[][]
{
	let chessBoard:BoardTileInfo[][] = [[],[],[],[],[],[],[],[]];
	const chessBoardPieces:ChessPiece[][] = LoadPositionFromFen(fen);

	for (let x = 0; x < 8; x++) {
		for (let y = 0; y < 8; y++)
		{
			chessBoard[x][y] = new BoardTileInfo(x, y);
			if (chessBoardPieces[x][y] !== undefined)
			{
				chessBoard[x][y].SetPieceOnTile(chessBoardPieces[x][y]);
			}
		}
	}

	return chessBoard;
}