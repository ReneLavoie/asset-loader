import * as PIXI from 'pixi.js';
import { Application } from '../../../Application';
import gsap from 'gsap';
import { EventDispatcher } from '../../../EventDispatcher';
import { SystemEvents } from '../../../events/Events';
import { Events } from '../events/Events';

export abstract class BaseView extends PIXI.Container {

    protected background: PIXI.Graphics;
    private _id: string;

    constructor(id: string) {
        super();
        this._id = id;
        this.init();
    }

    public get id(): string {
        return this._id;
    }

    public async show(force: boolean = false) {
        this.visible = true;

        if (force) {
            this.y = 0;
            return;
        }

        this.y = Application.windowSizes.height;
        gsap.to(this, { 
            duration: 1, 
            ease: "power2.out", 
            y: 0,
            onComplete: this.onShowEnd,
            callbackScope: this
        });
    }

    public hide() {
        gsap.to(this, {
            duration: 1,
            ease: "power2.out",
            y: -Application.windowSizes.height,
            onComplete: () => {
                this.visible = false;
                this.onHideEnd();}
        });
    }

    protected init() {
        EventDispatcher.instance.dispatcher.on(SystemEvents.WINDOW_RESIZE, this.onResize, this);
        EventDispatcher.instance.dispatcher.on(SystemEvents.BUNDLE_LOADED, this.onBundleLoaded, this);
        this.visible = false;
    }

    protected onResize(e: any) {
        
    }

    protected onShowEnd() {
        EventDispatcher.instance.dispatcher.emit(Events.PAGE_SHOWN);
    }

    protected async onBundleLoaded(e: any) {

    }

    protected onHideEnd() {}
}