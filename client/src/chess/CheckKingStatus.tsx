import { ChessColour, KingStatus } from "../utilities/enums";
import { BoardTileData } from "./BoardClasses";

export function CheckKingStatus(kingColour: ChessColour, tileToCheck:BoardTileData):KingStatus
{
    if (kingColour === ChessColour.White && tileToCheck.GetThreat(ChessColour.Black)) return KingStatus.Check;
    if (kingColour === ChessColour.Black && tileToCheck.GetThreat(ChessColour.White)) return KingStatus.Check;
    return KingStatus.Okay;
}