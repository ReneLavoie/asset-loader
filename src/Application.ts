import * as PIXI from 'pixi.js';
import { BaseSiteApp } from "./pages/BaseSiteApp";
import { DesktopApp } from "./pages/desktop/DesktopApp";
import { SystemEvents, TotalHeap } from "./events/Events";
import { EventDispatcher } from "./EventDispatcher";
import { MathUtils } from "./utils/MathUtils";

type WindowSize = {
    width: number;
    height: number;
    availableWidth: number;
    availableHeight: number;
}

export class Application extends PIXI.Application {

    private static _app: Application;
    private mainContainer: PIXI.Container;

    private pageApp: BaseSiteApp;

    private resizeTimeoutId: NodeJS.Timeout;

    constructor() {
        super(Application.getAppOptions());
        this.init();
    }

    public static get app(): Application {
        return this._app;
    }

    public static  get windowSizes(): WindowSize {
        const NAV_BAR_HEIGHT = 0.9;
        return {
            width: window.visualViewport.width,
            height: window.visualViewport.height,
            availableWidth: window.visualViewport.width,
            availableHeight: window.visualViewport.height * NAV_BAR_HEIGHT
        }
    }

    private init() {
        Application._app = this;
        (globalThis as any).__PIXI_APP__ = this;
        this.mainContainer = new PIXI.Container();

        this.startMeasureHeap();

        window.onresize = this.onResize.bind(this);
        window.onload = async () => {
            const gameContainer: HTMLElement = document.getElementById("gameContainer") as HTMLElement;
            gameContainer.appendChild(this.view as HTMLCanvasElement);
            this.stage.addChild(this.mainContainer);

            this.createApp();

            (this.view as HTMLCanvasElement).style.position = 'absolute';
            (this.view as HTMLCanvasElement).style.left = '50%';
            (this.view as HTMLCanvasElement).style.top = '50%';
            (this.view as HTMLCanvasElement).style.transform = 'translate3d( -50%, -50%, 0 )';
        };
    }

    private startMeasureHeap() {
        if (!window.crossOriginIsolated) {
            console.log('performance.memory is only available in cross-origin-isolated pages');
            return;
        }

        const INTERVAL = 1000;
        setInterval(this.measureHeap, INTERVAL);
    }

    private measureHeap() {
        
        const totalHeap = MathUtils.bytesToGB(window.performance.memory.totalJSHeapSize);
        const usedHeap = MathUtils.bytesToGB(window.performance.memory.usedJSHeapSize);
        
        EventDispatcher.instance.dispatcher.emit(SystemEvents.CURRENT_HEAP_USAGE, {heapSize: totalHeap, heapUsed: usedHeap} as TotalHeap);
    }

    private createApp() {

        if (this.deviceType() === "desktop") {
            this.pageApp = new DesktopApp();

            this.mainContainer.addChild(this.pageApp);
        }
    }

    private static getAppOptions() {
        return {
            backgroundColor: 0x2b2b2a,
            width: this.windowSizes.width,
            height: this.windowSizes.height,
            antialias: true,
            autoDensity: true,
            resolution: 3,
        }
    }

    private onResize() {

        clearTimeout(this.resizeTimeoutId);

        this.resizeTimeoutId = setTimeout(() => {
            this.renderer.resize(Application.windowSizes.width, Application.windowSizes.height);
            EventDispatcher.instance.dispatcher.emit(SystemEvents.WINDOW_RESIZE);
        }, 200);
    }

    private deviceType(): string {
        const ua: string = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "tablet";
        }
        
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return "mobile";
        }
        return "desktop";
    };
}