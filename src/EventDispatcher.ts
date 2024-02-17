import * as PIXI from 'pixi.js';

export class EventDispatcher {

    private static instance: EventDispatcher;
    private dispatcher: PIXI.utils.EventEmitter;

    private constructor() {
        this.init();
    }

    public static getInstance(): EventDispatcher {
        if (!this.instance) {
            this.instance = new EventDispatcher();
        }

        return this.instance;
    }

    public getDispatcher(): PIXI.utils.EventEmitter {
        return this.dispatcher;
    }

    private init() {
        this.dispatcher = new PIXI.utils.EventEmitter();
    }
}