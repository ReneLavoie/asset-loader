
import * as PIXI from 'pixi.js';
import { Application } from './Application';
import { Assets } from '@pixi/assets';
import { EventDispatcher } from './EventDispatcher';
import { SystemEvents } from './events/Events';
import {ISkeletonData, Spine} from 'pixi-spine';
import { MathUtils } from './utils/MathUtils';

export class AssetManager {

    private static _instance: AssetManager;
    private bundles: Map<string, object>;

    private constructor() {}

    public async init() {
        await this.initAssetManager();
        this.bundles = new Map();
    }

    public static get instance(): AssetManager {
        if(!this._instance) {
            this._instance = new AssetManager();
        }

        return this._instance;
    }

    public async getAsset(assetId: string): Promise<any> {
        try{
            return await Assets.get(assetId);
        } catch (error) {
            console.error('Error getting asset:', error);
        }
    }

    public async produceSpine(assetId: string): Promise<Spine> {
        try{
            const spineData = await this.loadAsset(assetId);
            return new Spine(spineData.spineData);
        } catch (error) {
            console.error('Error getting spine data:', error);
        }
    }

    public async loadAssetBundle(bundle: string): Promise<void> {
        EventDispatcher.instance.dispatcher.emit(SystemEvents.BUNDLE_LOADING);
        try{
            const bundleAssets = await Assets.loadBundle(bundle);
            this.bundles.set(bundle, bundleAssets);
            this.evaluateTotalMemory(bundleAssets);
            EventDispatcher.instance.dispatcher.emit(SystemEvents.BUNDLE_LOADED,{id: bundle, assets: bundleAssets});
        } catch (error) {
            console.error('Error loading bundle:', error);
        }
    }

    public async unloadAssetBundle(bundle: string): Promise<any> {
        try{
            await Assets.unloadBundle(bundle);
            this.clearPixiCache(bundle);
        } catch (error) {
            console.error('Error unloading bundle:', error);
        }
    }

    public async loadAsset(path: string): Promise<any> {
        try {
        return await PIXI.Assets.load(path);
        } catch (error) {
            console.error('Error loading asset:', error);
        }
    }

    public async unloadAsset(path: string): Promise<any> {
        try{
            return await PIXI.Assets.unload(path);
        } catch (error) {
            console.error('Error unloading asset:', error);
        }
    }

    private async initAssetManager() {
        try{
            await Assets.init({ manifest: "./assets/manifest.json" });
        } catch (error) {
            console.error('Error initializing manifest:', error);
        }
    }

    private clearPixiCache(bundle: string) {
        if(!this.bundles.has(bundle)) return;

        const bundleAssets = this.bundles.get(bundle);
        for (const key in bundleAssets) {
            if (bundleAssets.hasOwnProperty(key)) {
                PIXI.Texture.removeFromCache(key);
            }
        }
        this.bundles.delete(bundle);
    }

    private evaluateTotalMemory(bundle: any) {
        let totalMemory: number = 0;
        for (const key in bundle) {
            if (bundle.hasOwnProperty(key)) {
                totalMemory += MathUtils.imageSizeInByte(bundle[key].width, bundle[key].height);
            }
        }

        EventDispatcher.instance.dispatcher.emit(SystemEvents.MEMORY_UPDATE, totalMemory);
    }

    private async loadJson(url: string): Promise<any> {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Network response was not ok (status: ${response.status})`);
          }
          const data = await response.json() as ISkeletonData; 
          console.log(data); 
          return data; 
        } catch (error) {
          console.error('Error loading json file:', error);
        }
      }

}