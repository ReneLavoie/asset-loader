
import * as PIXI from 'pixi.js';
import { Application } from './Application';
import { Assets } from '@pixi/assets';
import { EventDispatcher } from './EventDispatcher';
import { SystemEvents } from './events/Events';

export class AssetManager {

    private static _instance: AssetManager;

    private constructor() {
        
    }
    public init(options?: PIXI.AssetInitOptions) {
        Assets.init(options);
    }

    public static get instance(): AssetManager {
        if(this._instance) {
            this._instance = new AssetManager();
        }

        return this._instance;
    }

    public async loadAssetBundle(bundle: string): Promise<void> {
        //this.loadingScreen.show();
        EventDispatcher.instance.dispatcher.emit(SystemEvents.BUNDLE_LOADING);
        const bundleAssets = await Assets.loadBundle(bundle);
        //this.loadingScreen.hide();

        EventDispatcher.instance.dispatcher.emit(SystemEvents.BUNDLE_LOADED,{id: bundle, assets: bundleAssets});
    }

    public unloadAssetBundle(bundle: string): void {
        Assets.unloadBundle(bundle);
    }

}