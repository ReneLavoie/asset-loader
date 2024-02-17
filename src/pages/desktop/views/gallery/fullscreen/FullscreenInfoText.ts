import * as PIXI from 'pixi.js';
import { BaseUIComponent } from '../../../../../ui/BaseUIComponent';
import { Application } from '../../../../../Application';
import { gsap } from 'gsap';
import { Model, Painting } from '../../../../../Model';
import { LocalizationManager } from '../../../../../LocalizationManager';
import { EventDispatcher } from '../../../../../EventDispatcher';
import { SystemEvents } from "../../../../../events/Events"


export class FullscreenInfoText extends BaseUIComponent {

    private nameText: PIXI.Text;
    private yearText: PIXI.Text;
    private availableText: PIXI.Text;
    private bgSprite: PIXI.Sprite;
    private textContainer: PIXI.Container;
    private imageID: number;
 
    constructor() {
        super();
    }

    public getTargetHeight() : number {
        return this.bgSprite.height;
    }

    public resize() {
        this.setLabel(this.imageID);
    }

    public setLabel(id: number) {

        this.imageID = id;

        const painting: Painting = Model.getInstance().getPaintingData(id);

        this.yearText.text = painting.year;
        this.nameText.text = LocalizationManager.getInstance().getText(Model.getInstance().getLanguage(), "paintings", painting.name);

        if(painting.available) {
            this.availableText.text = "Available";
            this.availableText.style.fill = 0x44a13d;
        } else {
            this.availableText.text = "Unavailable";
            this.availableText.style.fill = 0xff0000;
        }

        const fontSize: number = Application.windowSizes().availableWidth * 0.01;
        this.nameText.style.fontSize = fontSize;
        this.yearText.style.fontSize = fontSize * 0.5;
        this.availableText.style.fontSize = fontSize;

        const offset: number = fontSize * 0.1;
        const targetWidth: number = this.availableText.width + this.nameText.width + this.yearText.width + (4 * offset);

        this.nameText.x = offset;
        this.nameText.y = offset;
        this.yearText.x = this.nameText.x + this.nameText.width + offset;
        this.yearText.y = (this.yearText.height * 0.7) + offset;
        this.availableText.x = this.yearText.x + this.yearText.width + offset;
        this.availableText.y = offset;

        this.bgSprite.width = targetWidth;
        this.bgSprite.height = this.availableText.height + (offset * 2);
    }

    public show() {

        if(gsap.isTweening(this.bgSprite)) return;

        this.bgSprite.visible = true;
        this.bgSprite.alpha = 0;
        this.textContainer.visible = true;
        this.textContainer.alpha = 0;

        gsap.to(this.textContainer, {duration: 0.5, alpha: 1});
        gsap.to(this.bgSprite, {duration: 0.5, alpha: 0.6});
    }

    public hide() {
        this.bgSprite.visible = false;
        this.textContainer.visible = false;
    }

    public toggle() {
        this.bgSprite.visible ? this.hide() : this.show();
    }

    protected init() {
        super.init();
        this.visible = true;
        this.alpha = 1;
        this.textContainer = new PIXI.Container();
        this.textContainer.visible = false;
        this.addChild(this.textContainer);
        this.createText();

        EventDispatcher.getInstance().getDispatcher().on(SystemEvents.LANGUAGE_CHANGE, this.onLanguageChange, this);
    }

    protected createBackground() { 
        this.background = new PIXI.Graphics();
        this.background.beginFill(0xffffff);
        this.background.drawRect(0, 0, 500, 500);
        this.background.endFill();

        const texture: PIXI.Texture = Application.getApp().renderer.generateTexture(this.background, {resolution: 5});

        this.bgSprite = new PIXI.Sprite(texture);
        this.bgSprite.alpha = 0;
        this.bgSprite.visible = false;
        this.addChild(this.bgSprite);
    }

    private createText() {
        this.nameText = new PIXI.Text("", {
            fontFamily: "Dancing Script",
            fontSize: 10,
            fontWeight: "300",
            dropShadow: true,
            dropShadowBlur: 3,
            dropShadowDistance: 2,
            dropShadowAlpha: 0.5,
            fill: 0x2f3238
        });

        this.yearText = new PIXI.Text("", {
            fontFamily: "Dancing Script",
            fontSize: 10,
            fontWeight: "300",
            dropShadow: true,
            dropShadowBlur: 3,
            dropShadowDistance: 2,
            dropShadowAlpha: 0.5,
            fill: 0x2f3238
        });

        this.availableText = new PIXI.Text("", {
            fontFamily: "Dancing Script",
            fontSize: 10,
            fontWeight: "300",
            dropShadow: true,
            dropShadowBlur: 3,
            dropShadowDistance: 2,
            dropShadowAlpha: 0.5,
            fill: 0x2f3238
        });

        this.textContainer.addChild(this.availableText, this.nameText, this.yearText);
    }

    private onLanguageChange(langage: String) {
        this.setLabel(this.imageID);
    }

}