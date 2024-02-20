import { BaseSiteApp } from "../BaseSiteApp";
import { NavigationBar } from "./views/navBar/NavigationBar";
import { PageManager } from "../PageManager";
import { HomeView } from "./views/home/HomeView";
import { Events } from "./events/Events";
import { EventDispatcher } from "../../EventDispatcher";
import { Application } from "../../Application";
import { SystemEvents } from "../../events/Events";
import { GameView } from "./views/game/GameView";
import { AssetManager } from "../../AssetManager";
import { Model, GameData } from "../../Model";
import { LoadingView } from "../../loadingView/LoadingView";
import { MemoryUsageView } from "../../memoryUsageView/MemoryUsageView";


export class DesktopApp extends BaseSiteApp {

    private navBar: NavigationBar;
    private pageManager: PageManager;
    private loadingScreen: LoadingView;
    private memoryUsage: MemoryUsageView;

    constructor() {
        super();
    }

    protected async init() {

        await AssetManager.instance.init();
        await this.getGameData();

        this.createLoadingScreen();
        this.createMemoryUsageView();
        this.createNavigationBar();
        this.createLobby();
        this.createGameView();

        EventDispatcher.instance.dispatcher.on(SystemEvents.WINDOW_RESIZE, this.onResize, this);
        EventDispatcher.instance.dispatcher.on(Events.SHOW_PAGE, this.onShowPage, this);

    }

    private createNavigationBar() {
        this.navBar = new NavigationBar("nav_bar");
        this.navBar.y = 0;
        this.navBar.show();

        this.addChild(this.navBar);
    }

    private createLobby() {
        this.pageManager = new PageManager();
        this.pageManager.y = this.navBar.y + this.navBar.height;
        this.addChildAt(this.pageManager, 0);
        
        const homeView: HomeView = new HomeView("lobby");
        this.pageManager.addPage(homeView);
        this.pageManager.showPage("lobby");
    }

    private createLoadingScreen() {
        this.loadingScreen = new LoadingView("loading");
        Application.app.stage.addChild(this.loadingScreen);
    }

    private createMemoryUsageView() {
        this.memoryUsage = new MemoryUsageView("memory");

        this.memoryUsage.x = Application.windowSizes.width * 0.8;
        this.memoryUsage.y = Application.windowSizes.height * 0.1;
        Application.app.stage.addChild(this.memoryUsage);

        this.memoryUsage.show();
    }

    private async getGameData() {
        const data = await AssetManager.instance.loadAsset("../assets/game_data.json");

        if (!data) {
            console.error("No game data found");
            return;
        }

        const gameDataArray: GameData[] = data.games.map((game: any): GameData => {
            return {
                GameId: game.GameId,
                Animation: game.Animation,
                Background: game.Background
            };
        });

        if (gameDataArray) {
            Model.instance.gameIds = gameDataArray;
        }
    }

    private createGameView() {
        const gameId = Model.instance.gameIds;
        if (Model.instance.gameIds) {
            Model.instance.gameIds.forEach((gameInfo) => {
                const view = new GameView(gameInfo.GameId);
                this.pageManager.addPage(view);
            })
        }
    }

    private onShowPage(pageId: string) {
        this.pageManager.showPage(pageId);
    }

    private onResize(e: any) {
        this.pageManager.y = Application.windowSizes.height * 0.1;
    }
}