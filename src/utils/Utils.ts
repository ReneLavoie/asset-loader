export function estimateImageMemoryUsage(imageWidth: number, imageHeight: number): number {
    const bytesPerPixel = 4; // For RGBA images
    const sizeInBytes = imageWidth * imageHeight * bytesPerPixel;
    return sizeInBytes;
}

export function estimateTextMemoryUsage(textContent: string): number {
    const bytesPerCharacter = 2; // Assuming UTF-16 encoding
    const sizeInBytes = textContent.length * bytesPerCharacter;
    return sizeInBytes;
}