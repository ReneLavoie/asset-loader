import * as PIXI from 'pixi.js';
import { Application } from "../../../../Application";
import { SmoothGraphics } from '@pixi/graphics-smooth';
import gsap from 'gsap';
import { EventDispatcher } from '../../../../EventDispatcher';
import { Events } from '../../events/Events';

export class NavIndicator extends PIXI.Container {

    private background: PIXI.Sprite;
    private arrow: PIXI.Text
    private dir: number;
    private size: number;
    private active: boolean;

    constructor(dir: number, size: number, active: boolean) {
        super();

        this.dir = dir;
        this.size = size;
        this.active = active;

        this.init();
    }

    public destroy() {
        super.destroy();

        gsap.killTweensOf(this.background);

        if(this.background) {
            this.background.destroy({baseTexture: true, texture: true});
            this.background = null;
        }

        if(this.arrow) {
            this.arrow.destroy();
            this.arrow = null;
        }

        gsap.killTweensOf(this);
        this.off("pointerup", this.onMouseUp, this);
        this.off("mouseover", this.onMouseOver, this);
    }

    public deactivate() {
        this.active = false;
    }

    public activate() {
        this.active = true;
    }

    public show() {

        if (this.visible || !this.active ) {
            return;
        }

        this.visible = true;
        this.alpha = 0;

        gsap.to(this, { duration: 0.3, alpha: 1 });
    }

    public hide() {
        if (!this.visible) {
            return;
        }

        gsap.to(this, { duration: 0.3, alpha: 0, onComplete: () => this.visible = false });
    }

    private init() {
        
        this.interactive = true;
        this.visible = false;
        this.on("pointerup", this.onMouseUp, this);
        this.on("mouseover", this.onMouseOver, this);
        this.on("mouseout", this.onMouseOut, this);
        this.on("pointerdown", this.onPointerDown, this);
        this.createBackground();
        this.createArrow();
    }

    private createBackground() {

        const gfx: SmoothGraphics = new SmoothGraphics();
        gfx.beginFill(0xffffff);
        gfx.drawCircle(0, 0, this.size);
        gfx.endFill();
        gfx.alpha = 0.5;
        const texture:  PIXI.Texture = Application.getApp().renderer.generateTexture(gfx, {resolution: 5});

        this.background =  new PIXI.Sprite(texture);
        this.background.anchor.set(0.5);

        this.addChild(this.background);
    
    }

    private createArrow() {
        this.arrow = new PIXI.Text(this.dir === 1 ? '>' : '<', { fontFamily: 'Arial', fontSize: this.size * 1.5, fill: 0xffffff, align: 'center' });
        this.arrow.alpha = 0.5;
        this.arrow.anchor.set(0.5);
        this.addChild(this.arrow);
    }

    private playClickAnim() {

        if(gsap.isTweening(this.background)) return;

        gsap.to(this.background, {
            duration: 0.2,
            width: this.background.width * 1.3,
            height: this.background.height * 1.3,
            repeat: 1,
            yoyo: true,
        });
    }

    private onMouseUp(e:PIXI.FederatedPointerEvent) {
        e.stopPropagation();

        this.playClickAnim();

        EventDispatcher.getInstance().getDispatcher().emit(Events.SCROLL_BTN_CLICK, this.dir);
    }

    private onPointerDown(e:PIXI.FederatedPointerEvent) {  
        e.stopPropagation();
    }

    private onMouseOver() {
        this.background.scale.set(1.2);
    }

    private onMouseOut() {
        this.background.scale.set(1);
    }
}