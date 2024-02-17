interface LocalizationEntries {
    [key: string]: string;
}
  
interface LocalizationData {
    [language: string]: LocalizationEntries;
}

export class LocalizationManager {

    private static instance: LocalizationManager;
    private localizationData: LocalizationData;

    constructor() {
        this.init();
    }

    public static getInstance(): LocalizationManager {
        if(!LocalizationManager.instance) {
            LocalizationManager.instance = new LocalizationManager();
        }

        return LocalizationManager.instance;
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