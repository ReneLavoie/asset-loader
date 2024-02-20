import { AssetManager } from "../../../../AssetManager";
import { BaseView } from "../BaseView";
import * as PIXI from 'pixi.js';
import {Spine} from 'pixi-spine';
import { Application } from "../../../../Application";

export class GameView extends BaseView {

    private backSprite: PIXI.Sprite;
    private backSpine: Spine;
   
    constructor(id: string) {
        super(id);
    }

    public async show(force: boolean = false) {
        await AssetManager.instance.loadAssetBundle(this.id);

        super.show();
    }

    protected onResize(e: any) {
        super.onResize(e);
    }

    protected async onBundleLoaded(e: any) {
        if (e.id !== this.id) return;

        const texture: PIXI.Texture = await AssetManager.instance.getAsset("background_"+this.id);
        this.backSprite = new PIXI.Sprite(texture); 
        this.backSprite.x = (Application.windowSizes.availableWidth - this.backSprite.width) * 0.5;
        //this.backSpine = await AssetManager.instance.produceSpine("spine_asset");

        this.addChild(this.backSprite);
    }

    protected onHideEnd() {
        if(this.backSprite) {
            this.backSprite.destroy();
            this.backSprite = null;
        }

        if(this.backSpine) {
            this.backSpine.destroy();
            this.backSpine = null;
        }
        
        AssetManager.instance.unloadAssetBundle(this.id);
    }
}