

export function fetchImage(url: string) {
    return new Promise<ImageData>(resolve => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0);
            const data = ctx.getImageData(0, 0, img.width, img.height);

            resolve(data);
        };
    });
}