import { Application } from "../../../../Application";
import * as PIXI from 'pixi.js';
import { NavButton } from "./buttons/NavButton";
import { EventDispatcher } from "../../../../EventDispatcher";
import { Events } from "../../events/Events";
import { PageId } from "../../../PageManager";
import gsap from "gsap";
import { BaseView } from "../BaseView";
import { SystemEvents } from "../../../../events/Events";
import { LanguageSelector } from "./LanguageSelector";
import { Model } from ".././../../../Model";
import { LocalizationManager } from "../../../../LocalizationManager";

export class NavigationBar extends BaseView {

    private backgroundSprite: PIXI.Sprite;
    private languageSelector: LanguageSelector;
    private buttons: Map<PageId, NavButton>;
    private selectionBar: PIXI.Graphics;
    private currentSelection: PageId;
    private disabled: boolean = false;

    constructor() {
        super();
    }

    public disable() {
        if (this.disabled || !this.buttons) { return };

        this.disabled = true;
        this.buttons.forEach((btn) => {
            btn.disable();
        });
    }

    public enable() {
        if (!this.disabled) { return };

        this.disabled = false;
        this.buttons.forEach((btn) => {
            btn.enable();
        });
    }

    public show() {
        if (this.visible) return;

        this.visible = true;
        gsap.to(this, { duration: 0.3, alpha: 1 });
    }

    public hide() {
        if (!this.visible) return;

        gsap.to(this, { duration: 0.3, alpha: 0, onComplete: () => { this.visible = false } });
    }

    protected init() {
        super.init();
        EventDispatcher.getInstance().getDispatcher().on(Events.NAV_BUTTON_CLICK, this.onNavButtonClick, this);
        EventDispatcher.getInstance().getDispatcher().on(SystemEvents.BUNDLE_LOADING, this.onBundleLoading, this);
        EventDispatcher.getInstance().getDispatcher().on(SystemEvents.BUNDLE_LOADED, this.onBundleLoaded, this);
        EventDispatcher.getInstance().getDispatcher().on(SystemEvents.LANGUAGE_CHANGE, this.onLanguageChange, this);
        EventDispatcher.getInstance().getDispatcher().on(Events.PAGE_SHOWN, this.onPageShown, this);
        EventDispatcher.getInstance().getDispatcher().on(Events.SHOW_PAGE, this.onShowPage, this);

        Application.getApp().loadAssetBundle("language");
        this.currentSelection = PageId.Home;
        this.create();
    }

    protected createBackground() {

        if (this.background) {
            this.background.destroy();
            this.background = null;
        }

        const targetWidth: number = Application.windowSizes().width;
        const targetHeight: number = Application.windowSizes().height * 0.1;

        this.background = new PIXI.Graphics();
        this.background.beginFill(0xFFFFFF);
        this.background.lineStyle({ width: 1, color: 0x2f3238 });
        this.background.drawRect(0, 0, targetWidth, targetHeight);
        this.background.endFill();

        this.background.tint = 0x333843;

        this.addChildAt(this.background, 0);
    }

    private create() {
        this.createBackground();
        this.createButtons();
        this.positionButtons(Model.getInstance().getLanguage());
        this.createSelectionBar();
    }

    private createSelectionBar() {

        if (this.selectionBar) {
            this.selectionBar.destroy();
            this.selectionBar = null;
        }

        const btnHeight: number = this.buttons.get(PageId.Home).height;
        const targetWidth: number = this.background.width * 0.05;
        this.selectionBar = new PIXI.Graphics();
        this.selectionBar.beginFill(0xf5f3ed);
        this.selectionBar.lineStyle({ width: btnHeight * 0.05, color: 0xf5f3ed });
        this.selectionBar.lineTo(targetWidth, 0);
        this.selectionBar.cacheAsBitmap = true;
        this.addChild(this.selectionBar);

        this.selectionBar.y = this.buttons.get(PageId.Home).y + btnHeight + (btnHeight * 0.05);
        this.positionSelectionBar(this.currentSelection, true);
    }

    private createButtons() {

        if (this.buttons) {
            this.buttons.forEach((btn) => {
                this.removeChild(btn);
                btn.destroy();
            });
        }

        this.buttons = null;

        this.buttons = new Map<PageId, NavButton>();

        this.buttons.set(PageId.Home, new NavButton(PageId.Home, this.background.width, this.background.height));
        this.buttons.set(PageId.About, new NavButton(PageId.About, this.background.width, this.background.height));
        this.buttons.set(PageId.Contact, new NavButton(PageId.Contact, this.background.width, this.background.height));
        this.buttons.set(PageId.Gallery, new NavButton(PageId.Gallery, this.background.width, this.background.height));

        this.setLabels(Model.getInstance().getLanguage());

        this.buttons.forEach((btn) => {
            this.addChild(btn);
            btn.show();
        });
    }

    private setLabels(lang: string) {
        this.buttons.get(PageId.Home).setLabel(LocalizationManager.getInstance().getText(lang,"nav_bar", "home"));
        this.buttons.get(PageId.About).setLabel(LocalizationManager.getInstance().getText(lang,"nav_bar", "about"));
        this.buttons.get(PageId.Contact).setLabel(LocalizationManager.getInstance().getText(lang,"nav_bar", "contact"));
        this.buttons.get(PageId.Gallery).setLabel(LocalizationManager.getInstance().getText(lang,"nav_bar", "gallery"));
    }

    private positionButtons(lang: string) {

        const space: number = this.background.width * 0.03;
        const totalWidth: number = this.buttons.get(PageId.Home).width * this.buttons.size + 3 * space;
        const offsetFactor: number = lang === "bg" ? 0.2 : 0.05;
        
        this.buttons.get(PageId.Home).x = (this.background.width - totalWidth) * offsetFactor;
        this.buttons.get(PageId.Home).y = (this.background.height - this.buttons.get(PageId.Home).height) * 0.8;
        this.buttons.get(PageId.Gallery).x = this.buttons.get(PageId.Home).x + this.buttons.get(PageId.Home).width + space;
        this.buttons.get(PageId.Gallery).y = this.buttons.get(PageId.Home).y;
        this.buttons.get(PageId.About).x = this.buttons.get(PageId.Gallery).x + this.buttons.get(PageId.Gallery).width + space;
        this.buttons.get(PageId.About).y = this.buttons.get(PageId.Home).y;
        this.buttons.get(PageId.Contact).x = this.buttons.get(PageId.About).x + this.buttons.get(PageId.About).width + space;
        this.buttons.get(PageId.Contact).y = this.buttons.get(PageId.Home).y;
    }

    private createLanguageSelector(assets: any) {
        this.languageSelector = new LanguageSelector(assets);
        this.addChild(this.languageSelector);
    }

    private positionLanguageSelector() {
        this.languageSelector.x = this.background.width * 0.85;
        this.languageSelector.y = (this.background.height - this.languageSelector.height) * 0.7;
    }

    private disableButtons() {
        this.buttons.forEach((btn) => {
            btn.disable();
        });
    }

    private enableButtons() {
        this.buttons.forEach((btn) => {
            btn.enable();
        });
    }

    private positionSelectionBar(buttonId: PageId, force: boolean = false) {
        const targetWidth: number = this.buttons.get(buttonId).width * 0.9;
        const targetX: number = this.buttons.get(buttonId).x + ((this.buttons.get(buttonId).width - targetWidth) * 0.5);

        if (force) {
            this.selectionBar.x = targetX;
            this.selectionBar.width = targetWidth;
            return;
        }

        gsap.to(this.selectionBar, { duration: 0.5, ease: "power4.out", x: targetX });
        gsap.to(this.selectionBar, { duration: 0.5, width: targetWidth });
    }

    private updateBarColor() {
        switch(this.currentSelection) {
            case PageId.Home:
                this.background.tint = 0x333843;
                break;
            case PageId.Gallery:
                this.background.tint = 0x36454F;
                break;
        }
    }

    private onNavButtonClick(e: any) {

        if (this.currentSelection === e.id) { return; }

        this.currentSelection = e.id;

        this.updateBarColor();
        this.disableButtons();
        this.positionSelectionBar(this.currentSelection);
    }

    private onBundleLoading(e: any) {
        this.disable();
    }

    private onBundleLoaded(e: any) {
        this.enable();

        if (e.id !== "language") return;

        this.createLanguageSelector(e.assets);
        this.positionLanguageSelector();
    }

    private onPageShown() {
        this.enableButtons();
    }

    private onShowPage() {
        this.disableButtons();
    }

    protected onResize(e: any) {
        super.onResize(e);
        this.create();
        this.languageSelector.resize();
        this.positionLanguageSelector();
    }

    private onLanguageChange(lang: string) {
        this.setLabels(lang);
        this.positionButtons(lang);
        
        this.positionSelectionBar(this.currentSelection);
    }
}