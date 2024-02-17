import * as PIXI from 'pixi.js';
import { Application } from '../../../../../Application';
import { EventDispatcher } from '../../../../../EventDispatcher';
import { SystemEvents } from '../../../../../events/Events';
import { Assets } from '@pixi/assets';
import { Thumbnail } from "./Thumbnail";
import gsap from 'gsap';
import { Scrollbar, Orientation } from "../../../../../ui/Scrollbar";
import { NavIndicator } from "../NavIndicator";
import { Events } from '../../../events/Events';

export class ThumbnailView extends PIXI.Container {

    private thumbnails: Array<Thumbnail> = [];
    private thumbContainer: PIXI.Container;
    private isDragging: boolean = false;
    private startDragPos: PIXI.Point;
    private startPos: PIXI.Point;
    private startTime: number;

    private leftArrow: NavIndicator;
    private rightArrow: NavIndicator;
    private navArrows: PIXI.Container;

    private navBtnTimeoutId: NodeJS.Timeout;

    private scrollbar: Scrollbar;

    constructor() {
        super();
    }

    public activate() {
        this.parent.on("pointerdown", this.onMouseDown, this);
        this.parent.on("pointerup", this.onMouseUp, this);
        this.parent.on("pointermove", this.onMouseMove, this);
        this.parent.on("pointerout", this.onMouseUp, this);
        EventDispatcher.getInstance().getDispatcher().on(Events.SCROLL_BTN_CLICK, this.onScrollBtnClick, this);
    }

    public deactivate() {
        this.parent.off("pointerdown", this.onMouseDown, this);
        this.parent.off("pointerup", this.onMouseUp, this);
        this.parent.off("pointermove", this.onMouseMove, this);
        this.parent.off("pointerout", this.onMouseUp, this);
        EventDispatcher.getInstance().getDispatcher().off(Events.SCROLL_BTN_CLICK, this.onScrollBtnClick, this);
    }

    public destroy() {

        gsap.killTweensOf(this.thumbContainer);

        if (this.thumbnails) {
            this.thumbnails.forEach((e) => e.destroy());
        }

        if (this.thumbContainer) {
            this.thumbContainer.destroy();
            this.thumbContainer = null;
        }

        this.thumbnails = [];

        if (this.leftArrow) {
            this.leftArrow.destroy();
            this.navArrows.removeChild(this.leftArrow);
            this.leftArrow = null;
        }

        if (this.rightArrow) {
            this.rightArrow.destroy();
            this.navArrows.removeChild(this.rightArrow);
            this.rightArrow = null;
        }

        if (this.navArrows) {
            this.navArrows.destroy();
            this.navArrows = null;
        }

        this.deactivate();

        EventDispatcher.getInstance().getDispatcher().off(SystemEvents.BUNDLE_LOADED, this.onBundleLoaded, this);

        clearTimeout(this.navBtnTimeoutId);

        super.destroy();
    }

    public init() {
        EventDispatcher.getInstance().getDispatcher().on(SystemEvents.BUNDLE_LOADED, this.onBundleLoaded, this);
        Application.getApp().loadAssetBundle("thumbs");

        this.activate();

        this.startDragPos = new PIXI.Point();
        this.startPos = new PIXI.Point();

        this.createThumbContainer();
        this.createNavArrows();
    }

    private createThumbContainer() {
        this.thumbContainer = new PIXI.Container();
        this.thumbContainer.interactive = true;
        this.addChild(this.thumbContainer);
    }

    private createScrollbar() {
        const availableHeight: number = Application.windowSizes().availableHeight;
        const availableWidth: number = Application.windowSizes().availableWidth;
        const contentRect: PIXI.Rectangle = new PIXI.Rectangle(0, 0, this.thumbContainer.width, availableHeight);
        this.scrollbar = new Scrollbar(Orientation.VERTIVAL, availableWidth, availableHeight * 0.005, contentRect);

        this.scrollbar.y = availableHeight - (this.scrollbar.height * 1.3);
        this.addChild(this.scrollbar);
    }

    private createNavArrows() {
        const availableHeight: number = Application.windowSizes().availableHeight;
        const availableWidth: number = Application.windowSizes().availableWidth;
        this.navArrows = new PIXI.Container();
        this.addChild(this.navArrows);
        const arrowSize = availableHeight * 0.02;
        this.leftArrow = new NavIndicator(-1, arrowSize, false);
        this.rightArrow = new NavIndicator(1, arrowSize, true);
        this.leftArrow.hide();
        this.rightArrow.hide();

        this.leftArrow.x = availableWidth * 0.05;
        this.leftArrow.y = availableHeight * 0.05;
        this.rightArrow.x = availableWidth * 0.95;
        this.rightArrow.y = availableHeight * 0.05;

        this.rightArrow.deactivate();

        this.navArrows.addChild(this.leftArrow);
        this.navArrows.addChild(this.rightArrow);
    }

    private tweenTo(duration: number, targetX: number) {

        if (gsap.isTweening(this.thumbContainer) || isNaN(duration)) {
            return;
        }

        gsap.to(this.thumbContainer, {
            x: targetX,
            duration: duration,
            ease: "power2.out",
            onUpdate: () => {
                if (this.thumbContainer.x >= 0) {
                    gsap.killTweensOf(this.thumbContainer);
                    this.thumbContainer.x = 0;
                    this.leftArrow.deactivate();
                    this.leftArrow.hide();
                    return;
                } else if (this.thumbContainer.x < 0) {
                    this.leftArrow.activate();
                    this.leftArrow.show();
                }

                const offsetX: number = (Application.windowSizes().availableWidth * 0.05) * 2;
                if (this.thumbContainer.x + this.thumbContainer.width + offsetX <= Application.windowSizes().width) {
                    gsap.killTweensOf(this.thumbContainer);
                    this.rightArrow.hide();
                    this.rightArrow.deactivate();
                    return;
                } else if (this.thumbContainer.x + this.thumbContainer.width + offsetX > Application.windowSizes().width) {
                    this.rightArrow.activate();
                    this.rightArrow.show();
                }

                this.updateScrollbar();
            },
        });
    }

    private createThumb(assets: any) {
        const availableHeight: number = Application.windowSizes().availableHeight;
        const keys: Array<string> = Object.keys(assets);
        const targetHeight: number = availableHeight * 0.7;

        const data: Record<string, PIXI.Texture> = assets;

        for (let i = 0; i < keys.length; i++) {
            let texture: PIXI.Texture = data[keys[i]];
            let thumbnail: Thumbnail = new Thumbnail(i, texture, targetHeight);
            this.thumbnails.push(thumbnail);
            this.thumbContainer.addChild(thumbnail);
        }
    }

    private positionThumb() {
        const availableHeight: number = Application.windowSizes().availableHeight;
        const availableWidth: number = Application.windowSizes().availableWidth;
        let lastThumbWidth: number = 0;
        let lastThumbX: number = 0;
        const offsetX: number = availableWidth * 0.05;

        for (let i = 0; i < this.thumbnails.length; i++) {
            let thumb: Thumbnail = this.thumbnails[i];
            let targetX: number = (lastThumbX + lastThumbWidth) + offsetX + (thumb.width * 0.5);
            lastThumbWidth = this.thumbnails[i].width * 0.5;
            lastThumbX = targetX;

            thumb.x = targetX;
            thumb.y = availableHeight * 0.5;
        }
    }

    private showThumb() {
        for (let i = 0; i < this.thumbnails.length; i++) {
            let thumb: Thumbnail = this.thumbnails[i];
            thumb.show();
        }
    }

    private updateThumbContainer(distance: number) {

        const offsetX: number = (Application.windowSizes().availableWidth * 0.05) * 2;
        if (distance > 0 && this.thumbContainer.x < 0 ||
            distance < 0 && this.thumbContainer.x + this.thumbContainer.width + offsetX > Application.windowSizes().width) {
            this.thumbContainer.x += distance;
            this.updateScrollbar();
        }
    }

    private updateScrollbar() {
        this.scrollbar.update((Math.abs(this.thumbContainer.x) / this.thumbContainer.width) * Application.windowSizes().availableWidth);
    }

    private onMouseDown(e: any) {
        e.stopPropagation();

        this.isDragging = true;
        this.startTime = Date.now();
        gsap.killTweensOf(this.thumbContainer);
        this.startDragPos.set(e.client.x, e.client.y);
        this.startPos.set(e.client.x, e.client.y);
    }

    private onMouseUp(e: any) {
        e.stopPropagation();

        this.isDragging = false;

        const TIME_THRESHOLD: number = 500;
        const distance: number = (e.client.x - this.startPos.x) * 0.5;
        const totalTime: number = Date.now() - this.startTime;
        const velocity: number = (totalTime / Math.abs(distance)) * 2;

        if (totalTime > TIME_THRESHOLD) {
            return;
        }

        let tweenTargetX: number = this.thumbContainer.x + (distance * 5);
        const offsetX: number = (Application.windowSizes().availableWidth * 0.05) * 2;
        if (this.thumbContainer.x + this.thumbContainer.width + offsetX + distance > Application.windowSizes().width && Math.abs(distance) > 1) {
            this.tweenTo(velocity, tweenTargetX);
        }
    }

    private onMouseMove(e: any) {

        this.leftArrow.show();
        this.rightArrow.show();
        if (this.scrollbar) {
            this.scrollbar.show();
        }

        clearTimeout(this.navBtnTimeoutId);

        this.navBtnTimeoutId = setTimeout(() => {
            this.leftArrow.hide();
            this.rightArrow.hide();
            this.scrollbar.hide();
        }, 2000);

        if (!this.isDragging) return;
        e.stopPropagation();

        const distance: number = e.client.x - this.startDragPos.x;
        this.startDragPos.set(e.client.x, e.client.y);

        if (e.client.x > 0 && e.client.x < Application.windowSizes().width) {
            this.updateThumbContainer(distance);
        }

        if (this.thumbContainer.x >= 0) {
            this.leftArrow.deactivate();
            this.leftArrow.hide();
            return;
        } else if (this.thumbContainer.x < 0) {
            this.leftArrow.activate();
        }

        const offsetX: number = (Application.windowSizes().availableWidth * 0.05) * 2;
        if (this.thumbContainer.x + this.thumbContainer.width + offsetX <= Application.windowSizes().width) {
            this.rightArrow.hide();
            this.rightArrow.deactivate();
            return;
        } else if (this.thumbContainer.x + this.thumbContainer.width + offsetX > Application.windowSizes().width) {
            this.rightArrow.activate();
        }
    }

    private async onBundleLoaded(e: any) {
        if (e.id !== "thumbs") return;

        await this.createThumb(e.assets);

        this.showThumb();

        this.positionThumb();
        
        this.rightArrow.activate();
        this.createScrollbar();
    }

    private onScrollBtnClick(dir: number) {
        const targetX: number = this.thumbContainer.x + ((Application.windowSizes().availableWidth) * (-dir));
        const duration: number = 3;
        this.tweenTo(duration, targetX);
    }

}