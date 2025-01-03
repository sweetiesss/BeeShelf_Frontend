import React, { useState, useEffect, useContext } from "react";
import AxiosPartner from "../../services/Partner";
import { AuthContext } from "../../context/AuthContext";
import SpinnerLoading from "../../component/shared/Loading";
import { useTranslation } from "react-i18next";
import { add, format } from "date-fns";
import defaultImg from "../../assets/img/defaultImg.jpg";
import { Modal } from "antd";

export default function VerificationListPage() {
  const { userInfor } = useContext(AuthContext);
  const { t } = useTranslation();
  const { getVerificationPaper } = AxiosPartner();

  const [verificationPapper, setVerificationPapper] = useState();
  const [loading, setLoading] = useState(false);

  // State for Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [transformOrigin, setTransformOrigin] = useState("center center");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchBeginData();
  }, []);

  const fetchBeginData = async () => {
    try {
      setLoading(true);
      const result = await getVerificationPaper(userInfor?.id);
      if (result?.status === 200) {
        setVerificationPapper(result);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setScale(1); // Reset scale when opening the modal
    setTransformOrigin("center center"); // Reset transform origin
    setPosition({ x: 0, y: 0 }); // Reset position
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedImage(null);
    setScale(1); // Reset scale when closing the modal
    setTransformOrigin("center center");
    setPosition({ x: 0, y: 0 }); // Reset position
  };

  const handleMouseWheel = (e) => {
    e.preventDefault();
    const { offsetX, offsetY, target } = e.nativeEvent;
    const { width, height } = target.getBoundingClientRect();

    const xPercentage = (offsetX / width) * 100;
    const yPercentage = (offsetY / height) * 100;

    setTransformOrigin(`${xPercentage}% ${yPercentage}%`);

    if (e.deltaY < 0) {
      setScale((prev) => prev + 0.1); // Zoom in
    } else {
      setScale((prev) => Math.max(1, prev - 0.1)); // Zoom out
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStartPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - startPosition.x,
      y: e.clientY - startPosition.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="p-4">
      <div className="flex gap-4">
        <h1 className="text-3xl font-bold mb-6">
          {t("Verification Paper List")}
        </h1>
      </div>
      <div className="flex justify-left gap-4 mt-6 ">
        <div className="w-full">
          {loading ? (
            <SpinnerLoading loading={loading} />
          ) : (
            <div className="shadow-lg bg-white rounded-lg p-4 mb-3 overflow-y-scroll max-h-[70vh] w-full relative">
              <table className="w-full">
                <thead>
                  <tr>
                    <td className="text-center pb-2">#</td>
                    <td className="text-left pb-2 px-3">
                      {t("Business License")}
                    </td>
                    <td className="text-left pb-2">{t("OCOP License")}</td>
                    <td className="text-left pb-2">{t("Create Date")}</td>
                    <td className="text-left pb-2">
                      {t("Verify/Reject Date")}
                    </td>
                    <td className="text-left pb-2">{t("Reject Reason")}</td>
                    <td className="text-left pb-2">{t("Status")}</td>
                  </tr>
                </thead>
                <tbody>
                  {verificationPapper &&
                    verificationPapper?.data?.data?.map((order, index) => (
                      <tr key={order?.id} className={`border-t-2`}>
                        <td className="px-1 py-2 text-center">{index + 1}</td>
                        <td className="px-3 py-2">
                          <img
                            src={order?.frontPictureLink || defaultImg}
                            alt="Business License"
                            className="h-[20rem] w-auto rounded-xl object-contain object-center cursor-pointer"
                            onClick={() =>
                              handleImageClick(
                                order?.frontPictureLink || defaultImg
                              )
                            }
                          />
                        </td>
                        <td className="px-3 py-2">
                          <img
                            src={order?.backPictureLink || defaultImg}
                            alt="OCOP License"
                            className="h-[20rem] w-auto rounded-xl object-contain object-center cursor-pointer"
                            onClick={() =>
                              handleImageClick(
                                order?.backPictureLink || defaultImg
                              )
                            }
                          />
                        </td>
                        <td className="px-1 py-2">
                          {format(
                            add(new Date(order?.createDate), {
                              hours: 7,
                            }),
                            "HH:mm - dd/MM/yyyy"
                          )}
                        </td>
                        <td
                          className={`px-1 py-2 ${
                            order?.rejectDate ? "text-black" : "text-gray-400"
                          }`}
                        >
                          {order?.rejectDate
                            ? format(
                                add(new Date(order?.rejectDate), { hours: 7 }),
                                "HH:mm - dd/MM/yyyy"
                              )
                            : "Waiting"}
                        </td>
                        <td
                          className={`px-1 py-2 ${
                            order?.rejectReason ? "text-black" : "text-gray-400"
                          }`}
                        >
                          {order?.rejectReason || "Waiting"}
                        </td>
                        <td
                          className={`px-1 py-2 ${
                            order?.isRejected === 1
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}
                        >
                          {order?.isRejected === 1 ? "Rejected" : "Waiting"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={handleModalClose}
        centered
        bodyStyle={{ textAlign: "center", overflow: "hidden" }}
      >
        {selectedImage && (
          <div
            className="relative"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            <img
              src={selectedImage}
              alt="Full Image"
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: transformOrigin,
                transition: isDragging ? "none" : "transform 0.5s",
              }}
              className="w-auto h-auto mx-auto cursor-pointer"
              onWheel={handleMouseWheel}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
