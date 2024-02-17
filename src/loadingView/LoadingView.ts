import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import { Application } from "../Application";
import { LoadingAnim } from "./LoadingAnim";
import { BaseView } from '../pages/desktop/views/BaseView';

export class LoadingView extends BaseView {

    private loadingAnim: LoadingAnim;

    constructor() {
        super();

        this.init();
    }

    public show() {
        if (this.visible) return;

        this.visible = true;

        gsap.to(this.loadingAnim, { duration: 0.3, alpha: 0.5, onComplete: () => this.loadingAnim.show() });
    }

    public hide() {
        if (!this.visible) return;

        gsap.to(this.background, { duration: 0.3, alpha: 0, onComplete: () => { this.visible = false } });
    }

    protected init() {
        super.init();

        this.createLoadingAnim();
    }

    protected createBackground() {
        if(this.background) {
            this.background.destroy();
            this.background = null;
        }

        this.background = new PIXI.Graphics();
        this.background.beginFill(0xffffff);
        this.background.drawRect(0, 0, Application.windowSizes().width, Application.windowSizes().height);
        this.background.endFill();

        this.background.alpha = 0;

        this.addChild(this.background);
    }

    protected onResize(e: any) {
        super.onResize(e);

        this.createBackground();
        this.createLoadingAnim();
    }

    private createLoadingAnim() {

        if(this.loadingAnim) {
            this.loadingAnim.destroy();
            this.loadingAnim = null;
        }

        this.loadingAnim = new LoadingAnim();

        this.loadingAnim.x = (Application.windowSizes().width - this.loadingAnim.width) * 0.5;
        this.loadingAnim.y = (Application.windowSizes().height - this.loadingAnim.height) * 0.5;

        this.addChild(this.loadingAnim);
    }
}