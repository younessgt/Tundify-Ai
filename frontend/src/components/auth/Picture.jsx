const { useRef, useState } = require("react");
import { FaTimesCircle } from "react-icons/fa";
import imageCompression from "browser-image-compression";

export default function Picture({
  setPicture,
  setPictureBase64,
  pictureBase64,
  onError,
}) {
  const pictureRef = useRef();
  const [error, setError] = useState("");

  const updateError = (error) => {
    setError(error);
    // Pass the error to the parent component if an error occurs during picture upload or compression
    onError(error);
  };

  // function to handle the picture change
  const pictureChange = async (e) => {
    const image = e.target.files[0];
    if (
      image.type !== "image/png" &&
      image.type !== "image/jpeg" &&
      image.type !== "image/webp"
    ) {
      updateError("Invalid file type. Only PNG, JPEG, and WEBP are allowed");
      return;
    } else if (image.size > 1024 * 1024 * 2) {
      updateError("Image size must be less than 2MB");
      return;
    }
    updateError("");
    try {
      // Set compression options
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      // Compress the image file
      const compressedImage = await imageCompression(image, options);
      // console.log("compressedImage");

      // Convert compressed image to Base64
      const reader = new FileReader();
      reader.readAsDataURL(compressedImage);

      reader.onloadend = () => {
        setPictureBase64(reader.result);
        setPicture(compressedImage);
      };
    } catch (error) {
      // console.error("Error compressing the image:", error);
      updateError("Error compressing the image. Please try again.");
    }
  };

  // function to remove the picture
  const removePicture = () => {
    setPicture(null);
    setPictureBase64("");
    setError("");
    // Reset file input value to allow re-uploading the same picture
    if (pictureRef.current) {
      pictureRef.current.value = null; // Reset file input
    }
  };

  return (
    <div className="content-center dark:text-dark_text_1 space-y-1">
      <label htmlFor="picture" className="text-sm font-bold tracking-wide pl-1">
        Picture (Optional)
      </label>
      {pictureBase64 ? (
        <div className="relative w-20 h-20 mx-auto">
          <img
            src={pictureBase64}
            alt="picture"
            className="w-full h-full rounded-full object-cover"
          />
          {/*change picture */}
          <button
            type="button"
            className="absolute top-2 right-0 transform -translate-y-1/2 translate-x-1/2  text-white rounded-full p-1"
            onClick={removePicture}
            aria-label="Remove picture"
          >
            <FaTimesCircle className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div
          className="w-full dark:bg-dark_bg_3 text-base py-2  px-2 rounded-lg outline-none h-16 flex items-center justify-center cursor-pointer"
          onClick={() => pictureRef.current.click()}
          style={{ marginBottom: "10px" }}
        >
          Upload Picture
        </div>
      )}
      <input
        type="file"
        name="picture"
        id="picture"
        hidden
        ref={pictureRef}
        accept="image/png, image/jpeg, image/webp"
        onChange={pictureChange}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
