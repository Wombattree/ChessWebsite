import BoardPosition from "./BoardPosition";
import ChessPiece from "./ChessPiece";
import LoadPositionFromFen from "./LoadPositionFromFen";
import TileInfo from "./TileInfo";

export default function SetupBoard(fen:string):TileInfo[][]
{
	let chessBoard:TileInfo[][] = [[],[],[],[],[],[],[],[]];
	const chessBoardPieces:ChessPiece[][] = LoadPositionFromFen(fen);

	for (let x = 0; x < 8; x++) {
		for (let y = 0; y < 8; y++)
		{
			chessBoard[x][y] = new TileInfo(new BoardPosition(x, y));
			if (chessBoardPieces[x][y] !== undefined)
			{
				chessBoard[x][y].SetPieceOnTile(chessBoardPieces[x][y]);
			}
		}
	}

	return chessBoard;
}