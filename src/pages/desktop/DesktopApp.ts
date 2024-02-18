import { BaseSiteApp } from "../BaseSiteApp";
import { NavigationBar } from "./views/navBar/NavigationBar";
import { PageManager } from "../PageManager";
import { HomeView } from "./views/home/HomeView";
import { Events } from "./events/Events";
import { EventDispatcher } from "../../EventDispatcher";
import { Application } from "../../Application";
import { SystemEvents } from "../../events/Events";
import { Game_1_View } from "./views/game_1/Game_1_View";
import { Game_2_View } from "./views/game_2/Game_2_View";
import { Game_3_View } from "./views/game_3/Game_3_View";
import { Game_4_View } from "./views/game_4/Game_4_View";
import { Game_5_View } from "./views/game_5/Game_5_View";

export class DesktopApp extends BaseSiteApp {

    private navBar: NavigationBar;
    private pageManager: PageManager;

    constructor() {
        super();
    }

    protected init() {
        EventDispatcher.instance.dispatcher.on(Events.NAV_BUTTON_CLICK, this.onNavButtonClick, this);
        EventDispatcher.instance.dispatcher.on(SystemEvents.WINDOW_RESIZE, this.onResize, this);
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
        this.pageManager.addPage(new Game_1_View());
        this.pageManager.addPage(new Game_2_View());
        this.pageManager.addPage(new Game_3_View());
        this.pageManager.addPage(new Game_4_View());
        this.pageManager.addPage(new Game_5_View());
        
        homeView.show();

        this.addChildAt(this.pageManager, 0);
    }

    private onNavButtonClick(e: any) {
        this.pageManager.showPage(e.id);
    }

    private onResize(e: any) {
        this.pageManager.y = Application.windowSizes.height * 0.1;
    }
}