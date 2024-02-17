import { EventDispatcher } from "../../../../EventDispatcher";
import { Events } from "../../events/Events";
import { BaseView } from "../BaseView";
import { ThumbnailView } from "./thumbnail/ThumbnailView";
import { FullscreenView } from "./fullscreen/FullscreenView"
import { Application } from "../../../../Application";
import { ColorSelector } from "./colorSelector/ColorSelector"
export class GalleryView extends BaseView {

    private thumbnailView: ThumbnailView;
    private fullscreenView: FullscreenView;
    private colorSelector: ColorSelector;

    constructor() {
        super();
    }

    protected init() {
        super.init();
        EventDispatcher.getInstance().getDispatcher().on(Events.THUMBNAIL_CLICK, this.onThumbnailClicked, this);
        EventDispatcher.getInstance().getDispatcher().on(Events.FULLSCREEN_HIDE, this.onFullscreenHide, this);
        EventDispatcher.getInstance().getDispatcher().on(Events.BACKGROUND_COLOR_CHANGE, this.onBackgroundColorChange, this);
        this.interactive = true;
        this.background.tint = 0x610909;
    }

    private createThumbnailView() {

        if (this.thumbnailView) {
            this.thumbnailView.destroy();
            this.removeChild(this.thumbnailView);
            this.thumbnailView = null;
        }

        this.thumbnailView = new ThumbnailView();
        this.addChildAt(this.thumbnailView, 1);
        this.thumbnailView.init();
    }

    private createFullscreenView() {
        this.fullscreenView = new FullscreenView();

        this.fullscreenView.x = Application.windowSizes().availableWidth * 0.5;
        this.fullscreenView.y = Application.windowSizes().availableHeight * 0.5;

        this.addChildAt(this.fullscreenView, 2);
    }

    private createColorSelector() {

        if (this.colorSelector) {
            this.removeChild(this.colorSelector);
            this.colorSelector.destroy();
            this.colorSelector = null;
        }

        this.colorSelector = new ColorSelector(3);

        this.colorSelector.x = (Application.windowSizes().availableWidth - this.colorSelector.width) * 0.5;
        this.colorSelector.y = Application.windowSizes().availableHeight * 0.045;

        this.addChild(this.colorSelector);
    }

    protected onResize(e: any) {
        super.onResize(e);

        if (this.visible) {
            this.show(true);
        }

        this.createColorSelector();
        this.colorSelector.show();

        if (this.fullscreenView) {
            this.fullscreenView.resize();
            this.fullscreenView.x = Application.windowSizes().availableWidth * 0.5;
            this.fullscreenView.y = Application.windowSizes().availableHeight * 0.5;
            this.addChildAt(this.fullscreenView, 2);
        }

        this.createThumbnailView();
    }

    protected onShowEnd() {
        EventDispatcher.getInstance().getDispatcher().emit(Events.PAGE_SHOWN);

        if (this.thumbnailView) return;

        this.createThumbnailView();
        this.createFullscreenView();
        this.createColorSelector();
        this.colorSelector.show();
    }

    private onThumbnailClicked(e: any) {
        this.fullscreenView.show(e.id, e.rect);
        this.thumbnailView.deactivate();
        this.colorSelector.hide();
    }

    private onFullscreenHide() {
        this.thumbnailView.activate();
        this.colorSelector.show();
    }

    private onBackgroundColorChange(color: number) {
        this.background.tint = color;
    }
}