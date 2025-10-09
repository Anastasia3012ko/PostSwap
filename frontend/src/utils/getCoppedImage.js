// utils/getCroppedImg.js
export default function getCroppedImage(imageSrc, croppedAreaPixels) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous"; 
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to create file from canvas"));
          return;
        }
        const file = new File([blob], "cropped.png", { type: "image/png" });
        resolve(file);
      }, "image/png");
    };

    image.onerror = (error) => {
      reject(new Error("Error loading image: " + error.message));
    };
  });
}




