import { useState } from "react";

export default function VerifyPage() {
  const [imageLink, setImageLink] = useState();
  const [imagePreview, setImagePreview] = useState("");

  const [imageLink2, setImageLink2] = useState();
  const [imagePreview2, setImagePreview2] = useState("");
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageLink(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const handleImageChange2 = (e) => {
    const file = e.target.files[0];
    setImageLink2(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        console.log("FileReader Loaded for Image 2:", reader.result);
        setImagePreview2(reader.result); // Update state
      };
      reader.readAsDataURL(file); // Read the file
    }
  };

  return (
    <>
      <div>
        <div className="h-full ml-auto mr-10">
          <label
            htmlFor="file-upload"
            className="block text-lg font-medium leading-6 "
          >
            <span className="text-red-500 text-xl">*</span>
            {t("Image")}
          </label>
          <label htmlFor="file-upload" className="cursor-pointer ">
            <div
              className={`${
                imagePreview && "background-setting-input"
              } mt-2 flex justify-center items-center rounded-lg border  border-dashed border-gray-400 min-h-[30vh] border-hover py-5`}
            >
              <div className={`text-center ${imagePreview && "hidden"} `}>
                {/* <PiFileArrowDownLight
                  className="mx-auto h-12 w-12  span-hover"
                  aria-hidden="true"
                /> */}
                <div className="mt-4 flex text-sm leading-6 ">
                  <p className="relative cursor-pointer rounded-md font-semibold  focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 ">
                    <div className="flex gap-4 items-center">
                      <span className="text-3xl">
                        <DownloadSimple />
                      </span>
                      <span className="span-hover">
                        {t("UploadAFilePNGJPGGIFUpTo10MB")}
                      </span>
                    </div>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only "
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </p>
                </div>
              </div>
              {imagePreview && (
                <img
                  src={imagePreview}
                  className="rounded-xl"
                  style={{ maxWidth: "90%" }}
                />
              )}
            </div>
          </label>
        </div>
      </div>
      <div>
        <div className="h-full ml-auto mr-10">
          <label
            htmlFor="file-upload"
            className="block text-lg font-medium leading-6 "
          >
            <span className="text-red-500 text-xl">*</span>
            {t("Image2")}
          </label>
          <label htmlFor="file-upload2" className="cursor-pointer ">
            <div
              className={`${
                imagePreview2 && "background-setting-input"
              } mt-2 flex justify-center items-center rounded-lg border  border-dashed border-gray-400 min-h-[30vh] border-hover py-5`}
            >
              <div className={`text-center ${imagePreview2 && "hidden"} `}>
                {/* <PiFileArrowDownLight
                  className="mx-auto h-12 w-12  span-hover"
                  aria-hidden="true"
                /> */}
                <div className="mt-4 flex text-sm leading-6 ">
                  <p className="relative cursor-pointer rounded-md font-semibold  focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 ">
                    <div className="flex gap-4 items-center">
                      <span className="text-3xl">
                        <DownloadSimple />
                      </span>
                      <span className="span-hover">
                        {t("UploadAFilePNGJPGGIFUpTo10MB")}
                      </span>
                    </div>
                    <input
                      id="file-upload2"
                      name="file-upload2"
                      type="file"
                      className="sr-only "
                      accept="image/*"
                      onChange={handleImageChange2}
                    />
                  </p>
                </div>
              </div>
              {imagePreview2 && (
                <img
                  src={imagePreview2}
                  className="rounded-xl"
                  style={{ maxWidth: "90%" }}
                />
              )}
            </div>
          </label>
        </div>
      </div>
    </>
  );
}
