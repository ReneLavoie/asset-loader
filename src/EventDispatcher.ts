import * as PIXI from 'pixi.js';

export class EventDispatcher {

    private static _instance: EventDispatcher;
    private _dispatcher: PIXI.utils.EventEmitter;

    private constructor() {
        this.init();
    }

    public static get instance(): EventDispatcher {
        if (!this._instance) {
            this._instance = new EventDispatcher();
        }

        return this._instance;
    }

    public get dispatcher(): PIXI.utils.EventEmitter {
        return this._dispatcher;
    }

    private init() {
        this._dispatcher = new PIXI.utils.EventEmitter();
    }
}