interface LocalizationEntries {
    [key: string]: string;
}
  
interface LocalizationData {
    [language: string]: LocalizationEntries;
}

export class LocalizationManager {

    private static _instance: LocalizationManager;
    private localizationData: LocalizationData;

    private constructor() {
        this.init();
    }

    public static get instance(): LocalizationManager {
        if(!this._instance) {
            this._instance = new LocalizationManager();
        }

        return this._instance;
    }

    public getText(lang: string, section: string, key: string): string {
        return this.localizationData[lang][section][key as any];
    }

    public setData(data: Record<string, Record<string, string>>) {
        
        for (const language in data) {
            if (data.hasOwnProperty(language)) {
                const entries = data[language];
                this.localizationData[language] = {};
                for (const key in entries) {
                    if (entries.hasOwnProperty(key)) {
                        this.localizationData[language][key] = entries[key];
                    }
                }
            }
        }
    }

    private init() {
        this.localizationData = {};
    }
}