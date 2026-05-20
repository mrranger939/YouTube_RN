export const resizeImage = async (file, targetWidth, targetHeight) => {
    return await new Promise((resolve) => {
        const img = new Image();

        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const originalWidth = img.width;
            const originalHeight = img.height;

            const scaleFactor = Math.min(
                targetWidth / originalWidth,
                targetHeight / originalHeight
            );

            const newWidth = originalWidth * scaleFactor;
            const newHeight = originalHeight * scaleFactor;

            canvas.width = targetWidth;
            canvas.height = targetHeight;

            ctx.fillStyle = "#000";

            ctx.fillRect(0, 0, targetWidth, targetHeight);

            ctx.drawImage(
                img,
                (targetWidth - newWidth) / 2,
                (targetHeight - newHeight) / 2,
                newWidth,
                newHeight
            );

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    }
                },
                "image/jpeg",
                0.9
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(null);
        };

    });
};

