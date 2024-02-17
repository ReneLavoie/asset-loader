import { Application } from "../../../../Application";
import { EventDispatcher } from "../../../../EventDispatcher";
import { SystemEvents } from "../../../../events/Events";
import { Events } from "../../events/Events";
import { BaseView } from "../BaseView";
import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { Model } from "../../../../Model";

export class HomeView extends BaseView {

    private signatureTextureEN: PIXI.Texture;
    private signatureTextureFR: PIXI.Texture;
    private signatureTextureBG: PIXI.Texture;
    private signatureImg: PIXI.Sprite;
    private atelierImage: PIXI.Sprite;
    private imageContainer: PIXI.Container;
    private introPlayed: boolean = false;

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
        Application.getApp().loadAssetBundle("home");
    }

    protected onResize(e: any) {
        super.onResize(e);

        this.positionAndResizreImages();
    }

    private createAtelierImage(texture: PIXI.Texture) {

        this.imageContainer = new PIXI.Container();
        this.imageContainer.alpha = 0;

        this.addChild(this.imageContainer);

        this.atelierImage = new PIXI.Sprite(texture);
        this.atelierImage.anchor.set(0.5);

        this.signatureImg = new PIXI.Sprite();
        this.signatureImg.anchor.set(0.5);
        this.signatureImg.alpha = 0;

        this.imageContainer.addChild(this.atelierImage);
        this.imageContainer.addChild(this.signatureImg);
    }

    private positionAndResizreImages() {
        this.atelierImage.height = Application.windowSizes().availableHeight * 1.1;
        this.atelierImage.scale.x = this.atelierImage.scale.y;
        this.atelierImage.x = Application.windowSizes().availableWidth * 0.5;
        this.atelierImage.y = Application.windowSizes().availableHeight * 0.5;

        this.signatureImg.height = this.atelierImage.height * 0.45;
        this.signatureImg.scale.x = this.signatureImg.scale.y;
        this.signatureImg.x = Application.windowSizes().availableWidth * 0.515;
        this.signatureImg.y = Application.windowSizes().availableHeight * 0.45;
    }

    private showImages(lang: string) {

        switch(lang) {
            case "en":
                this.signatureImg.texture = this.signatureTextureEN;
                break;
            case "fr":
                this.signatureImg.texture = this.signatureTextureFR;
                break;
            case "bg":
                this.signatureImg.texture = this.signatureTextureBG;
                break;
        }

        if(this.imageContainer.alpha === 0) {
            gsap.to(this.imageContainer, { 
                alpha: 1, 
                duration: 0.5,
                onComplete: () => {
                    gsap.to(this.signatureImg, { alpha: 1, duration: 0.5});
                }
            });
            return;
        }

        this.signatureImg.alpha = 0;

        gsap.to(this.signatureImg, { alpha: 1, duration: 0.5});
    }

    private async onBundleLoaded(e: any) {
        if (e.id !== "home") return;

        this.signatureTextureBG = e.assets["signature_bg"];
        this.signatureTextureEN = e.assets["signature_en"];
        this.signatureTextureFR = e.assets["signature_fr"];

        this.createAtelierImage(e.assets["background"]);
    }

    protected onShowEnd() {

        if(this.introPlayed) {
            EventDispatcher.getInstance().getDispatcher().emit(Events.PAGE_SHOWN);
            return;
        }

        this.introPlayed = true;

        const lang: string = Model.getInstance().getLanguage();
        this.showImages(lang);
        this.positionAndResizreImages();

        EventDispatcher.getInstance().getDispatcher().emit(Events.PAGE_SHOWN);
    }

    protected onLanguageChange(lang: string) {
        this.showImages(lang);
    }
}