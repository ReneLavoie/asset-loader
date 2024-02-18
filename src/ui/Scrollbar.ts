import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import { BaseUIComponent } from './BaseUIComponent';
import { EventDispatcher } from '../EventDispatcher';

export enum Orientation {
    VERTIVAL,
    HORIZONTAL
}

export class Scrollbar extends PIXI.Container {

    private background: PIXI.Graphics;
    private orientation: Orientation;
    private contentRect: PIXI.Rectangle;
    private targetWidth: number;
    private targetHeight: number;
    private scroller: PIXI.Graphics;

    constructor(orientation: Orientation, width: number, height: number, contentRect: PIXI.Rectangle) {
        super();
        this.orientation = orientation;
        this.contentRect = contentRect;
        this.targetWidth = width;
        this.targetHeight = height;
        this.init();
    }

    public destroy() {
        super.destroy();

        if (this.background) {
            this.background.destroy();
        }

        if (this.scroller) {
            this.scroller.destroy();
        }
    }

    public update(x: number) {
        this.scroller.x = x;
    }

    public show() {
        if (this.visible) return;

        this.visible = true;
        gsap.to(this, { duration: 0.3, alpha: 1 });
    }

    public hide() {
        if (!this.visible) return;

        gsap.to(this, { duration: 0.3, alpha: 0, onComplete: () => { this.visible = false } });
    }

    protected init() {
        this.visible = false;
        this.alpha = 0;
        this.createBackground();

        EventDispatcher.instance.dispatcher.on('resize', this.onResize, this);
        setTimeout(() => { this.createScroller() }, 100);
        this.visible = false;
    }

    protected createBackground() {
        this.background = new PIXI.Graphics();
        this.background.beginFill(0xffffff);
        this.background.drawRoundedRect(0, 0, this.targetWidth, this.targetHeight, 6);
        this.background.endFill();
        this.background.alpha = 0.3;
        this.addChild(this.background);
    }

    private createScroller() {
        const targetWidth: number = (this.width / this.contentRect.width) * this.width;
        this.scroller = new PIXI.Graphics();
        this.scroller.beginFill(0xffffff);
        this.scroller.drawRoundedRect(0, 0, targetWidth, this.targetHeight, 6);
        this.scroller.endFill();
        this.scroller.alpha = 0.6;
        this.addChild(this.scroller);
    }

    private onResize(e: any) {

    }
}