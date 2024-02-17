import { EventDispatcher } from "./EventDispatcher";
import { SystemEvents } from "./events/Events";

export type Painting = {
    available: boolean;
    name: string;
    year: number;
}

export class Model {

    private language: string;
    private paintings: Painting[];

    private static instance: Model;

    constructor() {
        this.init();
        this.language = "bg";
    }

    public static getInstance(): Model {
        if(!Model.instance) {
            Model.instance = new Model();
        }

        return Model.instance;
    }

    public getLanguage(): string {
        return this.language; 
    }

    public setPaintingData(data: Record<string, Painting[]>) {
        this.paintings = data.paintings;
    }

    public getPaintingData(id: number): Painting {
        return this.paintings[id];
    }

    private init() {
        EventDispatcher.getInstance().getDispatcher().on(SystemEvents.LANGUAGE_CHANGE, this.onLanguageChange, this);
    }

    private onLanguageChange(lang: any) {
        this.language = lang;
    }
}