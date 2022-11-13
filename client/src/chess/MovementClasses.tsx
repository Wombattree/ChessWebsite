import { BoardPosition } from "./BoardClasses";

export class MovementInformation
{
    readonly newPosition: BoardPosition;
    readonly isEnemyPieceOnTile: boolean;

    private isMoveCastling: boolean = false;
    private castlingKingPosition: BoardPosition | null = null;
    private castlingRookPosition: BoardPosition | null = null;

    private isPromotion: boolean = false;
    private isPawnMovingTwoSpaces: boolean = false;
    private isMoveEnPassant: boolean = false;
    private enPassantPosition: BoardPosition | null = null;

    constructor(newPosition: BoardPosition, isEnemyPieceOnTile: boolean)
    {
        this.newPosition = newPosition;
        this.isEnemyPieceOnTile = isEnemyPieceOnTile;
    }

    MoveIsCastling(kingPosition: BoardPosition, rookPosition: BoardPosition) 
    { 
        this.isMoveCastling = true;
        this.castlingKingPosition = kingPosition;
        this.castlingRookPosition = rookPosition;
    }
    GetIsMoveCastling(): boolean { return this.isMoveCastling; }
    GetKingCastlingPosition(): BoardPosition | null { return this.castlingKingPosition; }
    GetRookCastlingPosition(): BoardPosition | null { return this.castlingRookPosition; }

    MoveIsPromotion() { this.isPromotion = true; }
    GetIsMovePromotion(): boolean { return this.isPromotion; }

    MoveIsPawnMovingTwoSpaces() { this.isPawnMovingTwoSpaces = true; }
    GetIsPawnMovingTwoSpaces(): boolean { return this.isPawnMovingTwoSpaces; }

    MoveIsEnPassant(enPassantPosition: BoardPosition)
    {
        this.isMoveEnPassant = true;
        this.enPassantPosition = enPassantPosition;
    }
    GetIsMoveEnPassant(): boolean { return this.isMoveEnPassant; }
    GetEnPassantPosition(): BoardPosition | null { return this.enPassantPosition; }
}