import * as PIXI from 'pixi.js';
import { Application } from '../../../Application';
import gsap from 'gsap';
import { EventDispatcher } from '../../../EventDispatcher';
import { SystemEvents } from '../../../events/Events';

export class BaseView extends PIXI.Container {

    protected background: PIXI.Graphics;

    constructor() {
        super();
        this.init();
    }

    public show(force: boolean = false) {
        this.visible = true;

        if (force) {
            this.y = 0;
            return;
        }

        this.y = Application.windowSizes().height;
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
            y: -Application.windowSizes().height,
            onComplete: () => this.visible = false
        });
    }

    protected init() {
        EventDispatcher.getInstance().getDispatcher().on(SystemEvents.WINDOW_RESIZE, this.onResize, this);
        this.visible = false;
        this.createBackground();
    }

    protected createBackground() {
        
        let tint: number = 0xffffff;
        if(this.background) {
            tint = this.background.tint;
            this.background.destroy();
            this.background = null;
        }

        this.background = new PIXI.Graphics();
        this.background.beginFill(0xffffff);
        this.background.drawRect(0, 0, Application.windowSizes().width, Application.windowSizes().availableHeight);
        this.background.endFill();
        this.background.tint = tint;

        this.addChildAt(this.background, 0);
    }

    protected onResize(e: any) {
        this.createBackground();
    }

    protected onShowEnd() {

    }
}