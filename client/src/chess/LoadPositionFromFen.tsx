import { ChessPieceType, ChessColour } from "../utilities/enums";
import ChessPiece from "./ChessPiece";

function GetPieceFromLetter(letter:string):ChessPieceType
{
    switch(letter)
    {
        case "p": return ChessPieceType.Pawn;
        case "n": return ChessPieceType.Knight;
        case "r": return ChessPieceType.Rook;
        case "b": return ChessPieceType.Bishop;
        case "k": return ChessPieceType.King;
        case "q": return ChessPieceType.Queen;
        default: console.log(`Piece not found! "${letter}"`); return ChessPieceType.None;
    }
}

export default function LoadPositionFromFen(fen:string):ChessPiece[][]
{
    let piecePositions:ChessPiece[][] = [[],[],[],[],[],[],[],[]];

    const fenSplit:string[] = fen.split("");
    let xPosition:number = 0;
    let yPosition:number = 0;

    const isNumberRegex = /[0-9]/;
    const isUpperCaseRegex = /[A-Z]/;

    fenSplit.forEach(character => 
    {
        if (character === "/")
        {
            xPosition = 0;
            yPosition++;
        }
        else
        {
            if (isNumberRegex.test(character))
            {
                xPosition += parseInt(character);
            }
            else
            {
                const pieceColour:ChessColour = (isUpperCaseRegex.test(character) ? ChessColour.White : ChessColour.Black);
                const pieceName:ChessPieceType = (GetPieceFromLetter(character.toLowerCase()))

                piecePositions[yPosition][xPosition] = new ChessPiece(pieceName, pieceColour);
                xPosition++;
            }
        }
    });

    return piecePositions;
}