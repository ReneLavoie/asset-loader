import { BaseSiteApp } from "../BaseSiteApp";
import { NavigationBar } from "./views/navBar/NavigationBar";
import { PageManager } from "../PageManager";
import { HomeView } from "./views/home/HomeView";
import { GalleryView } from "./views/gallery/GalleryView";
import { Events } from "./events/Events";
import { EventDispatcher } from "../../EventDispatcher";
import { Application } from "../../Application";
import { SystemEvents } from "../../events/Events";
import { AboutView } from "./views/about/AboutView";

export class DesktopApp extends BaseSiteApp {

    private navBar: NavigationBar;
    private pageManager: PageManager;

    constructor() {
        super();
    }

    protected init() {
        EventDispatcher.getInstance().getDispatcher().on(Events.NAV_BUTTON_CLICK, this.onNavButtonClick, this);
        EventDispatcher.getInstance().getDispatcher().on(SystemEvents.WINDOW_RESIZE, this.onResize, this);
        this.createNavigationBar();
        this.createPages();
    }

    private createNavigationBar() {
        this.navBar = new NavigationBar();
        this.navBar.y = 0;
        this.navBar.show();

        this.addChild(this.navBar);
    }

    private createPages() {
        this.pageManager = new PageManager();
        this.pageManager.y = this.navBar.y + this.navBar.height;

        const homeView: HomeView = new HomeView();
        
        this.pageManager.addPage(homeView);
        this.pageManager.addPage(new GalleryView());
        this.pageManager.addPage(new AboutView());
        
        homeView.show();

        this.addChildAt(this.pageManager, 0);
    }

    private onNavButtonClick(e: any) {
        this.pageManager.showPage(e.id);
    }

    private onResize(e: any) {
        this.pageManager.y = Application.windowSizes().height * 0.1;
    }
}