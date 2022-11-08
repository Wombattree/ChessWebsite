import { ChessPieceName, ChessColour } from "../utilities/enums";
import ChessPiece from "./ChessPiece";

function GetPieceFromLetter(letter:string):ChessPieceName
{
    switch(letter)
    {
        case "p": return ChessPieceName.Pawn;
        case "n": return ChessPieceName.Knight;
        case "r": return ChessPieceName.Rook;
        case "b": return ChessPieceName.Bishop;
        case "k": return ChessPieceName.King;
        case "q": return ChessPieceName.Queen;
        default: console.log(`Piece not found! "${letter}"`); return ChessPieceName.None;
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
                const pieceName:ChessPieceName = (GetPieceFromLetter(character.toLowerCase()))

                piecePositions[yPosition][xPosition] = new ChessPiece(pieceName, pieceColour);
                xPosition++;
            }
        }
    });

    return piecePositions;
}