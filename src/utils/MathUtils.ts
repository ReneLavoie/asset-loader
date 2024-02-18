

export class MathUtils {

    public static randomInRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static bytesToGB(bytes: number): number {
        return bytes / 1073741824;
    }
    
}