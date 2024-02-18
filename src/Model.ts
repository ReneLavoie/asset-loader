import { EventDispatcher } from "./EventDispatcher";
import { SystemEvents } from "./events/Events";

export type Painting = {
    available: boolean;
    name: string;
    year: number;
}

export class Model {

    private language: string;

    private static _instance: Model;

    private constructor() {
        this.init();
        this.language = "bg";
    }

    public static get instance(): Model {
        if(!this._instance) {
            this._instance = new Model();
        }

        return this._instance;
    }

    public getLanguage(): string {
        return this.language; 
    }

    private init() {
        EventDispatcher.instance.dispatcher.on(SystemEvents.LANGUAGE_CHANGE, this.onLanguageChange, this);
    }

    private onLanguageChange(lang: any) {
        this.language = lang;
    }
}