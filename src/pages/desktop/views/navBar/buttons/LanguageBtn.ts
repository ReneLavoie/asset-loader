
import { BaseButton } from "../../../../../ui/BaseButton";
import * as PIXI from 'pixi.js';
import { Application } from "../../../../../Application";
import { EventDispatcher } from "../../../../../EventDispatcher";
import { SystemEvents } from "../../../../../events/Events";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";

export class LanguageBtn extends BaseButton {

    private language: string;
    private selectionBox: PIXI.Graphics;

    private icon: PIXI.Sprite;
    private texture: PIXI.Texture;
    private selected: boolean = false;

    constructor(language: string, texture: PIXI.Texture) {
        super();
        this.language = language;
        this.texture = texture;

        this.createIcon();
        this.createSelectionBox();
    }

    public destroy(): void {
        if(this.selectionBox) {
            this.selectionBox.destroy();
        }
    }

    public select(value: boolean) {
        this.selected = value;
        this.selectionBox.visible = this.selected;
    }

    protected init() {
        super.init();
        EventDispatcher.getInstance().getDispatcher().on(SystemEvents.LANGUAGE_CHANGE, this.onLanguageChange, this);
    }

    protected createIcon() {
        this.icon = new PIXI.Sprite(this.texture);
        this.icon.height = Application.windowSizes().height * 0.03;
        this.icon.scale.x = this.icon.scale.y;
        this.addChild(this.icon);
    }

    private createSelectionBox() {
        this.selectionBox = new PIXI.Graphics();
        this.selectionBox.beginFill(0xf2f1ed);
        this.selectionBox.drawRect(0, 0, this.icon.width * 1.2, this.icon.height * 1.2);
        this.selectionBox.endFill();
        this.selectionBox.x = -(this.icon.width * 0.1);
        this.selectionBox.y = -(this.icon.height * 0.1);
        this.selectionBox.visible = false;
        this.selectionBox.alpha = 0.5;
        this.addChildAt(this.selectionBox, 0);
    }

    protected onUp(e:  PIXI.FederatedMouseEvent) {
        if(this.selected) return;

        this.select(true);
        EventDispatcher.getInstance().getDispatcher().emit(SystemEvents.LANGUAGE_CHANGE, this.language);
    }

    protected onOver(e:  PIXI.FederatedMouseEvent) {
        if(this.selected) return;

        this.selectionBox.visible = true;
    }

    protected onOut(e:  PIXI.FederatedMouseEvent) {
        if(this.selected) return;

        this.selectionBox.visible = false;
    }

    private onLanguageChange(language: string) {
        this.select(language === this.language);
    }
}