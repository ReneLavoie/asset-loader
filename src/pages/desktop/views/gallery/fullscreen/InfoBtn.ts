import * as PIXI from 'pixi.js';
import { BaseButton} from "../../../../../ui/BaseButton";
import { Application } from "../../../../../Application";
import { Events } from '../../../events/Events';
import { EventDispatcher } from '../../../../../EventDispatcher';

export class InfoBtn extends BaseButton {

    private text: PIXI.Text;
    private blocked: boolean = false;

    constructor() {
        super();
    }

    protected init() {
        super.init();
        this.createText();
    }

    protected onDown(e:  PIXI.FederatedMouseEvent) {
        e.stopPropagation();
    }

    protected onUp(e:  PIXI.FederatedMouseEvent) {
        e.stopPropagation();

        if(this.blocked) return;

        this.blocked = true;

        setTimeout(() => {this.blocked = false}, 500);

        EventDispatcher.getInstance().getDispatcher().emit(Events.INFO_BUTTON_CLICK);
    }

    protected onUpOutside(e:  PIXI.FederatedMouseEvent) {
        e.stopPropagation();
    }

    protected onOver(e:  PIXI.FederatedMouseEvent) {
        this.background.alpha = 0.9;
    }

    protected onOut() {
        this.background.alpha = 0.6;
    }

    protected createBackground() { 

        if(this.background) {
            this.background.destroy();
            this.background = null;
        }

        const targetSize: number = Application.windowSizes().availableHeight * 0.015;
        this.background = new PIXI.Graphics();
        this.background.beginFill(0xffffff);
        this.background.drawCircle(0, 0, targetSize);
        this.background.endFill();
        this.background.alpha = 0.6;
        this.addChild(this.background);
    }

    private createText() {

        if(this.text) {
            this.text.destroy();
            this.text = null;
        }

        const targetSize: number = Application.windowSizes().availableHeight * 0.025;
        this.text = new PIXI.Text("i", {fill: 0x000000, fontSize: targetSize, dropShadow: true, dropShadowDistance: 2, dropShadowBlur: 2, fontWeight: 'bold'});
        this.text.anchor.set(0.5);
        this.text.alpha = 0.5;
        this.addChild(this.text);
    }

    protected onResize(e: any) { 
        this.createBackground();
        this.createText();
    } 
}