

export type GameData = {
    GameId: string;
    Animation: string;
    Background: string;
}
export class Model {

    private _gameIds: GameData[];

    private static _instance: Model;

    private constructor() {}

    public static get instance(): Model {
        if (!this._instance) {
            this._instance = new Model();
        }

        return this._instance;
    }

    public get gameIds(): GameData[] {
        return this._gameIds;
    }

    public set gameIds(value: GameData[]) {
        this._gameIds = value;
    }
}