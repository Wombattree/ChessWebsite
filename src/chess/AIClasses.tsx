import { BoardTileData } from "./BoardClasses";
import { MovementInformation } from "./MovementClasses";

export class AISearchResult
{
    readonly value: number;
    readonly tile: BoardTileData;
    readonly move: MovementInformation;

    constructor(value: number, tile: BoardTileData, move: MovementInformation)
    {
        this.value = value;
        this.tile = tile;
        this.move = move;
    }
}