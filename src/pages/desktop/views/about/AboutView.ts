import { Application } from "../../../../Application";
import { EventDispatcher } from "../../../../EventDispatcher";
import { SystemEvents } from "../../../../events/Events";
import { Events } from "../../events/Events";
import { BaseView } from "../BaseView";
import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { Model } from "../../../../Model";
import { LocalizationManager } from "../../../../LocalizationManager";

export class AboutView extends BaseView {

    private mountainImg: PIXI.Sprite;
    private text: PIXI.Text;
    private textContent: string;
    private textPos: number = 0;
    private introAnimPlayed: boolean = false;
    private intervalId: NodeJS.Timer;

    constructor() {
        super();
    }

    public show(force: boolean = false) {
        super.show();
    }

    protected init() {
        super.init();
        this.background.tint = 0xccc7bc;
        EventDispatcher.getInstance().getDispatcher().on(SystemEvents.BUNDLE_LOADED, this.onBundleLoaded, this);
        EventDispatcher.getInstance().getDispatcher().on(SystemEvents.LANGUAGE_CHANGE, this.onLanguageChange, this);
        Application.getApp().loadAssetBundle("about");
        this.updateText = this.updateText.bind(this);
    }

    protected onResize(e: any) {
        super.onResize(e);
        this.resizeBackgroundImg();
    }

    private playIntroAnimation() {

        this.intervalId = setInterval(this.updateText, 50);
    }

    private updateText() {
        this.text.text += this.textContent.charAt(this.textPos);
        if (this.textPos < this.textContent.length) {
            this.textPos++;
        } else {
            clearInterval(this.intervalId);
        }
    }

    private createText() {

        this.textContent = LocalizationManager.getInstance().getText(Model.getInstance().getLanguage(), "about", "main_text");

        this.text = new PIXI.Text("", {
            fontFamily: "Marck Script",
            fontSize: Application.windowSizes().availableHeight * 0.035,
            wordWrap: true,
            wordWrapWidth: Application.windowSizes().availableWidth * 0.5,
            fontWeight: "300",
            dropShadow: true,
            dropShadowBlur: 3,
            dropShadowDistance: 2,
            dropShadowAlpha: 0.5,
            fill: 0x4a4a4a
        });

        this.text.resolution = 3;

        this.text.y = Application.windowSizes().availableHeight * 0.05;
        this.text.x = (Application.windowSizes().availableWidth - Application.windowSizes().availableWidth * 0.5) * 0.5;

        this.addChild(this.text);
    }

    private createBackgroundImage(texture: PIXI.Texture) {
        this.mountainImg = new PIXI.Sprite(texture);
        this.mountainImg.alpha = 0.5;
        this.addChild(this.mountainImg);
    }

    private resizeBackgroundImg() {
        this.mountainImg.width = Application.windowSizes().availableWidth;
        this.mountainImg.height = Application.windowSizes().availableHeight;
    }

    private async onBundleLoaded(e: any) {
        if (e.id !== "about") return;

        this.createBackgroundImage(e.assets["background"]);
        this.resizeBackgroundImg();
        this.createText();
    }

    protected onShowEnd() {

        if(!this.introAnimPlayed) {
            this.playIntroAnimation();
        }

        EventDispatcher.getInstance().getDispatcher().emit(Events.PAGE_SHOWN);
    }

    protected onLanguageChange(lang: string) {
       
    }
}