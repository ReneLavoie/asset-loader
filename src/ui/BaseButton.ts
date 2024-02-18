import { BaseUIComponent } from './BaseUIComponent';
import { gsap } from 'gsap';
import * as PIXI from 'pixi.js';

export abstract class BaseButton extends BaseUIComponent {


    constructor() {
        super();

    }

    public enable() {
        this.interactive = true;
        gsap.killTweensOf(this);
        gsap.to(this, {alpha: 1, duration: 0.3});
    }

    public disable() {
        this.interactive = false;
        gsap.killTweensOf(this);
        gsap.to(this, {alpha: 0.6, duration: 0.3});
    }

    public destroy() {
        super.destroy();

        this.off('pointerdown', this.onDown, this);
        this.off('pointerup', this.onUp, this);
        this.off('pointerupoutside', this.onUpOutside, this);
        this.off('pointerover', this.onOver, this);
        this.off('pointerout', this.onOut, this);
    }

    protected init() {
        super.init();
        this.interactive = true;

        this.on('pointerdown', this.onDown, this);
        this.on('pointerup', this.onUp, this);
        this.on('pointerupoutside', this.onUpOutside, this);
        this.on('pointerover', this.onOver, this);
        this.on('pointerout', this.onOut, this);
    }

    protected onDown(e:  PIXI.FederatedMouseEvent) {}

    protected onUp(e:  PIXI.FederatedMouseEvent) {}

    protected onUpOutside(e:  PIXI.FederatedMouseEvent) {}

    protected onOver(e:  PIXI.FederatedMouseEvent) {}

    protected onOut(e:  PIXI.FederatedMouseEvent) {}

}