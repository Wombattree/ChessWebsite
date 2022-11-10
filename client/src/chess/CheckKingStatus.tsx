import { ChessColour, KingStatus } from "../utilities/enums";
import TileInfo from "./TileInfo";

export default function CheckKingStatus(kingColour: ChessColour, tileToCheck:TileInfo):KingStatus
{
    if (kingColour === ChessColour.White && tileToCheck.threatenedByBlack) return KingStatus.Check;
    if (kingColour === ChessColour.Black && tileToCheck.threatenedByWhite) return KingStatus.Check;
    return KingStatus.Okay;
}