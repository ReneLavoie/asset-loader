import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import { Application } from "../Application";
import { SmoothGraphics as Graphics } from '@pixi/graphics-smooth';

export class LoadingAnim extends PIXI.Container {

    private animAssets: Array<PIXI.Sprite> = [];
    private BALL_SIZE: number = 10;

    constructor() {
        super();
        this.init();
    }

    public destroy() {
        this.animAssets.forEach((e) => e.destroy({texture: true, baseTexture: true}));
    }

    public show() {
        if (this.visible) return;

        this.visible = true;

        this.startAnimation();
    }

    public hide() {
        if (!this.visible) return;

        gsap.to(this, {
            duration: 0.3, alpha: 0, onComplete: () => {
                this.visible = false;
                this.stopAnimation();
            }
        });
    }

    private init() {
        this.visible = false;
        this.createAnim();
    }

    private startAnimation() {
        for (let i = 0; i < 6; i++) {
            this.animAssets[i]
            gsap.to(this.animAssets[i], { alpha: 0.5, repeat: -1, yoyo: true, delay: i * 0.3});
        }
    }

    private stopAnimation() {

    }

    private createAnim() {
        const gfx: Graphics = new Graphics();
        gfx.beginFill(0x8a253d);
        gfx.drawCircle(0, 0, this.BALL_SIZE);
        gfx.endFill();

        const ballTexture: PIXI.Texture = Application.app.renderer.generateTexture(gfx, {resolution: 5});
        const offset: number = ballTexture.width * 0.8;

        for (let i = 0; i < 6; i++) {
            this.animAssets[i] = new PIXI.Sprite(ballTexture);
            this.animAssets[i].anchor.set(0.5);
            this.animAssets[i].alpha = 0;
            this.animAssets[i].x = i === 0 ? this.animAssets[i].width * 0.5 : (i * this.animAssets[i].width) + (i * offset) + this.animAssets[i].width * 0.5;
            this.animAssets[i].y = this.animAssets[i].height * 0.5;
            this.addChild(this.animAssets[i]);
        }
    }
}