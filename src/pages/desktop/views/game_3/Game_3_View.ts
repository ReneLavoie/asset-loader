import { Application } from "../../../../Application";
import { EventDispatcher } from "../../../../EventDispatcher";
import { SystemEvents } from "../../../../events/Events";
import { Events } from "../../events/Events";
import { BaseView } from "../BaseView";
import * as PIXI from 'pixi.js';
import { AssetManager } from "../../../../AssetManager";

export class Game_3_View extends BaseView {

    private backSprite: PIXI.Sprite;
   
    constructor() {
        super();
    }

    public show(force: boolean = false) {
        super.show();
    }

    protected init() {
        super.init();
        this.background.tint = 0xccc7bc;
        EventDispatcher.instance.dispatcher.on(SystemEvents.BUNDLE_LOADED, this.onBundleLoaded, this);
        EventDispatcher.instance.dispatcher.on(SystemEvents.LANGUAGE_CHANGE, this.onLanguageChange, this);
        AssetManager.instance.loadAssetBundle("game_3");
    }

    protected onResize(e: any) {
        super.onResize(e);
    }

    private async onBundleLoaded(e: any) {
        if (e.id !== "game_3") return;

        this.backSprite = new PIXI.Sprite(e.assets.background); 

        this.addChild(this.backSprite);
    }

    protected onShowEnd() {

        EventDispatcher.instance.dispatcher.emit(Events.PAGE_SHOWN);
    }

    protected onLanguageChange(lang: string) {
        
    }
}