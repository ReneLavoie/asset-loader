import { BaseButton } from '../../../../../ui/BaseButton';
import * as PIXI from 'pixi.js';
import { Application } from '../../../../../Application';
import gsap from 'gsap';
import { EventDispatcher } from '../../../../../EventDispatcher';
import { Events } from '../../../events/Events';

export class ColorButton extends BaseButton {
    private color: number;
    private selectHighlight: PIXI.Graphics;
    private selected: boolean = false;

    constructor(color: number) {
        super();

        this.color = color;
        this.createCustomBackground();
        this.createHightlight();
    }

    public dstroy() {
        super.destroy();

        if (this.selectHighlight) {
            this.selectHighlight.destroy();
        };
    }

    public getColor(): number {
        return this.color;
    }

    public select(value: boolean) {
        this.selectHighlight.visible = value;
        this.selectHighlight.alpha = value ? 1 : 0;
        this.selected = value;
    }

    protected init() {
        super.init();

        EventDispatcher.getInstance().getDispatcher().on(Events.BACKGROUND_COLOR_CHANGE, this.onBackgroundColorChange, this);
    }

    protected onDown(e:  PIXI.FederatedMouseEvent) {
        e.stopPropagation();
    }

    protected onUp(e:  PIXI.FederatedMouseEvent) {
        e.stopPropagation();

        if (this.selected) return;

        EventDispatcher.getInstance().getDispatcher().emit(Events.BACKGROUND_COLOR_CHANGE, this.color)
    }

    protected onOver(e:  PIXI.FederatedMouseEvent) {

        if (this.selected) return;

        gsap.killTweensOf(this.selectHighlight);

        this.selectHighlight.visible = true;
        gsap.to(this.selectHighlight, { alpha: 1, duration: 0.3 });
    }

    protected onOut() {

        if (this.selected) return;

        gsap.killTweensOf(this.selectHighlight);
        gsap.to(this.selectHighlight, { alpha: 0, duration: 0.3, onComplete: () => this.selectHighlight.visible = false });
    }

    private createHightlight() {
        this.selectHighlight = new PIXI.Graphics();
        this.selectHighlight.beginFill(this.color);
        this.selectHighlight.lineStyle(2, 0xffffff);
        this.selectHighlight.drawRect(0, 0, this.background.width, this.background.height);
        this.selectHighlight.endFill();

        if (!this.selected) {
            this.selectHighlight.visible = false;
            this.selectHighlight.alpha = 0;
        }

        this.addChild(this.selectHighlight);
    }

    private createCustomBackground() {
        const targetSize = Application.windowSizes().availableWidth * 0.01;

        this.background = new PIXI.Graphics();
        this.background.beginFill(this.color);
        this.background.lineStyle(2, 0x706e6f);
        this.background.drawRect(0, 0, targetSize, targetSize);
        this.background.endFill();

        this.addChild(this.background);
    }

    private onBackgroundColorChange(color: number) {
        if(color === 0xfaf9f5) {
            
        }
    }
}