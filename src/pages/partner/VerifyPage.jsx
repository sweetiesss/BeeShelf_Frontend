import { DownloadSimple } from "@phosphor-icons/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AxiosImg from "../../services/Img";
import { useAuth } from "../../context/AuthContext";
import { Bounce, toast } from "react-toastify";
import { ConfigProvider, Spin } from "antd";

export default function VerifyPage() {
  const [imageLink, setImageLink] = useState();
  const [imagePreview, setImagePreview] = useState("");

  const [imageLink2, setImageLink2] = useState();
  const [imagePreview2, setImagePreview2] = useState("");

  const [error, setError] = useState();

  const [loading, setLoading] = useState(false);

  const { verrifyAccount } = AxiosImg();
  const { userInfor } = useAuth();
  const { t } = useTranslation();

  const contentStyle = {
    padding: 70,
    color: "var(--Xanh-Base)",
    primaryColor: "var(--Xanh-Base)",
    borderRadius: 4,
  };

  const handleImageChange = (e) => {
    setError();
    const file = e.target.files[0];
    setImageLink(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const handleImageChange2 = (e) => {
    setError();
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
  const handleUploadLincese = async () => {
    try {
      setError();
      setLoading(true);
      if (imageLink && imageLink2) {
        const result = await verrifyAccount(
          userInfor?.id,
          imageLink,
          imageLink2
        );
        if (result?.status === 200) {
          setImageLink();
          setImageLink2();
          setImagePreview();
          setImagePreview2();

          toast.success("Your verification sent.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }
        console.log(result);
      }
    } catch (e) {
      console.log(e);
      setError(e?.response?.data?.message);
      toast.warning(e?.response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between gap-10">
        <div className="p-10 items-center border-[1px] bg-white rounded-lg shadow-lg gap-4 flex w-fit">
          <div>
            <div className="h-full ml-auto mr-10">
              <label
                htmlFor="file-upload"
                className="block text-lg font-medium leading-6 "
              >
                <span className="text-red-500 text-xl">*</span>
                {t("Image Of Business License")}
              </label>
              <label htmlFor="file-upload" className="cursor-pointer ">
                <div
                  className={`${
                    imagePreview && "background-setting-input"
                  } mt-2 flex justify-center items-center rounded-lg border  border-dashed border-gray-400 max-h-[70vh] min-h-[70vh] max-w-[28vw] min-w-[28vw] border-hover py-5`}
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
                      style={{
                        height: "70vh",
                        width: "auto",
                        objectFit: "contain",
                        padding: "10px",
                      }}
                    />
                  )}
                </div>
              </label>
            </div>
          </div>
          <div>
            <div className="h-full ml-auto ">
              <label
                htmlFor="file-upload"
                className="block text-lg font-medium leading-6 "
              >
                <span className="text-red-500 text-xl">*</span>
                {t("Image Of Occop License")}
              </label>
              <label htmlFor="file-upload2" className="cursor-pointer ">
                <div
                  className={`${
                    imagePreview2 && "background-setting-input"
                  } mt-2 flex justify-center items-center rounded-lg border  border-dashed border-gray-400 max-h-[70vh] min-h-[70vh] max-w-[28vw] min-w-[28vw] border-hover py-5`}
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
                      style={{
                        height: "70vh",
                        width: "auto",
                        objectFit: "contain",
                        padding: "10px",
                      }}
                    />
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>
        <div className="p-10  border-[1px] bg-white rounded-lg shadow-lg w-full">
          <h2 class="text-2xl font-bold text-green-600 mb-4">
            Welcome to BeeShelf!
          </h2>

          <div className="text-lg">
            <p class="text-gray-700 mb-4">
              Your account has been successfully created. To activate your
              partnership and begin using our services, please complete the
              verification process by uploading the following documents:
            </p>
            <ul class="list-disc list-inside text-gray-700 mb-4">
              <li>
                <strong>Business License</strong>
              </li>
              <li>
                <strong>OCOP License</strong>
              </li>
            </ul>
            <p class="text-gray-700 mb-4">
              Our team will promptly review your documents. You will receive an
              email as soon as your account is verified.
            </p>
            <p class="text-gray-700">
              Thank you for choosing <strong>BeeShelf</strong> to manage your
              operations. We’re excited to have you on board!
            </p>
          </div>

          {loading ? (
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "green", // Set the primary color to green
                },
              }}
            >
              <Spin size="large">
                <div style={contentStyle} />
              </Spin>
            </ConfigProvider>
          ) : (
            <button
              className={`${
                loading || !imageLink || !imageLink2
                  ? "bg-[#dedede] text-[#7d7d7d]"
                  : "bg-[var(--Xanh-Base)] hover:bg-[var(--Xanh-700)]"
              } w-full  text-white font-semibold text-xl rounded-2xl p-4 transition duration-200 relative mt-10`}
              onClick={handleUploadLincese}
              disabled={!imageLink || !imageLink2 || loading}
            >
              Send verification
            </button>
          )}
          {error && <div className="text-red-500 text-xl mt-5">{error}</div>}
        </div>
      </div>
    </>
  );
}
