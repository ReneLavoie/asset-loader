import { BaseButton } from "../../../../../ui/BaseButton";
import { EventDispatcher } from "../../../../../EventDispatcher";
import { Events } from "../../../events/Events";
import * as PIXI from 'pixi.js';
import { PageId } from "../../../../PageManager";


export class NavButton extends BaseButton {

    private id: PageId;
    private labelText: PIXI.Text;
    private parentWidth: number;
    private parentHeight: number;
    private originalTextPos: PIXI.Point;

    constructor(id: PageId, parentWidth: number, parentHeight: number) {
        super();
        this.id = id;
        this.parentWidth = parentWidth;
        this.parentHeight = parentHeight;
    }

    public destroy() {
        super.destroy();

        if(this.labelText) {
            this.labelText.destroy();
            this.labelText = null;
        }
    }

    public setLabel(label: string) {
        if(!this.labelText) {
            this.labelText = new PIXI.Text("", {
                fontFamily: "Marck Script",
                fontSize: this.parentHeight * 0.4,
                dropShadowColor: 0xf5f3ed,
                dropShadow: true,
                dropShadowBlur: 3,
                dropShadowDistance: 2,
                dropShadowAlpha: 0.5,
                fill: 0xf5f3ed
            });
    
            this.labelText.resolution = 3;
            this.addChild(this.labelText);
        }

        this.labelText.text = label;
        
        this.originalTextPos = new PIXI.Point(this.labelText.x, this.labelText.y);
    }

    protected onDown(e:  PIXI.FederatedMouseEvent) {

        this.labelText.x += 3;
        this.labelText.y += 3;
    }

    protected onUp(e:  PIXI.FederatedMouseEvent) {

        this.resetOriginalPos();
        EventDispatcher.instance.dispatcher.emit(Events.NAV_BUTTON_CLICK, { id: this.id });
    }

    protected onUpOutside(e:  PIXI.FederatedMouseEvent) { 
        this.resetOriginalPos();
    }

    protected createBackground() {

        const targetWidth: number = this.parentWidth * 0.1;
        const targetHeight: number = this.parentHeight * 0.05;

        this.background = new PIXI.Graphics();
        this.background.beginFill(0x000000);
        this.background.drawRect(0, 0, targetWidth, targetHeight);

        this.addChild(this.background);
    }

    private resetOriginalPos() {
        this.labelText.x = this.originalTextPos.x;
        this.labelText.y = this.originalTextPos.y;
    }
}