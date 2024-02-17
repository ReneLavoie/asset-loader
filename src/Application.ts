import * as PIXI from 'pixi.js';
import { BaseSiteApp } from "./pages/BaseSiteApp";
import { DesktopApp } from "./pages/desktop/DesktopApp";
import { LoadingView } from "./loadingView/LoadingView";
import WebFont from "webfontloader";
import { Assets } from '@pixi/assets';
import { SystemEvents } from "./events/Events";
import { EventDispatcher } from "./EventDispatcher";
import { LocalizationManager } from "./LocalizationManager";
import { Model, Painting } from './Model';

export class Application extends PIXI.Application {

    private static app: Application;
    private mainContainer: PIXI.Container;

    private pageApp: BaseSiteApp;

    private loadingScreen: LoadingView;

    private assetManifest: any;

    private resizeTimeoutId: NodeJS.Timeout;

    constructor() {
        super(Application.getAppOptions());
        this.init();
    }

    public static getApp(): Application {
        return this.app;
    }

    public static windowSizes() {
        const NAV_BAR_HEIGHT = 0.9;
        return {
            width: window.visualViewport.width,
            height: window.visualViewport.height,
            availableWidth: window.visualViewport.width,
            availableHeight: window.visualViewport.height * NAV_BAR_HEIGHT
        }
    }

    public async loadAssetBundle(bundle: string): Promise<void> {
        this.loadingScreen.show();
        EventDispatcher.getInstance().getDispatcher().emit(SystemEvents.BUNDLE_LOADING);
        const bundleAssets = await Assets.loadBundle(bundle);
        this.loadingScreen.hide();

        EventDispatcher.getInstance().getDispatcher().emit(SystemEvents.BUNDLE_LOADED,{id: bundle, assets: bundleAssets});
    }

    private init() {
        Application.app = this;
        (globalThis as any).__PIXI_APP__ = this;
        this.mainContainer = new PIXI.Container();

        window.onresize = this.onResize.bind(this);
        window.onload = async () => {
            const gameContainer: HTMLElement = document.getElementById("gameContainer") as HTMLElement;
            gameContainer.appendChild(this.view as HTMLCanvasElement);
            this.stage.addChild(this.mainContainer);
            this.renderer.resolution = 3;
            await this.loadFont();
            await this.loadLocalizationData();
            await this.loadPaintingData();
            this.createLoadingScreen();
            await this.initAssetManager();
            this.createApp();

            (this.view as HTMLCanvasElement).style.position = 'absolute';
            (this.view as HTMLCanvasElement).style.left = '50%';
            (this.view as HTMLCanvasElement).style.top = '50%';
            (this.view as HTMLCanvasElement).style.transform = 'translate3d( -50%, -50%, 0 )';
        };
    }

    private createApp() {

        if (this.deviceType() === "desktop") {
            this.pageApp = new DesktopApp();

            this.mainContainer.addChild(this.pageApp);
        }
    }

    private async initAssetManager() {
        await this.loadJsonAssetManifest();
        Assets.init({ manifest: this.assetManifest });
    }

    private createLoadingScreen() {
        this.loadingScreen = new LoadingView();
        this.stage.addChild(this.loadingScreen);
    }

    private async loadJsonAssetManifest() {
        const response = await fetch("./assets/manifest.json");
        const json = await response.json();
        this.assetManifest = json;
    }

    private async loadPaintingData() {
        const response = await fetch("./assets/paintings.json");
        const data: Record<string, Painting[]> = await response.json();
        Model.getInstance().setPaintingData(data);
    }

    private async loadLocalizationData() {
        const response = await fetch("./assets/localization/languages.json");

        const data: Record<string, Record<string, string>> = await response.json();

        LocalizationManager.getInstance().setData(data);
    }

    private static getAppOptions() {
        return {
            backgroundColor: 0x2b2b2a,
            width: this.windowSizes().width,
            height: this.windowSizes().height,
            antialias: true,
            autoDensity: true,
            resolution: 3,
        }
    }

    private onResize() {

        clearTimeout(this.resizeTimeoutId);

        this.resizeTimeoutId = setTimeout(() => {
            this.renderer.resize(Application.windowSizes().width, Application.windowSizes().height);
            EventDispatcher.getInstance().getDispatcher().emit(SystemEvents.WINDOW_RESIZE);
        }, 200);
    }

    private async loadFont(): Promise<void> {
        return new Promise((resolve, reject) => {
            WebFont.load({
                google: {families: ['Marck Script']},
                active: () => {resolve();},
                inactive: () => {reject(new Error('Font loading failed'));}
            });
        });
    }

    private deviceType(): string {
        const ua: string = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "tablet";
        }
        else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return "mobile";
        }
        return "desktop";
    };
}