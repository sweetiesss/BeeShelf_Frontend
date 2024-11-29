// import React, { useState, useEffect } from "react";
// import { Modal, Form, Select, Button, message } from "antd";
// import useAxios from "../../../services/CustomizeAxios";

// const { Option } = Select;

// const AssignShipperForm = ({ open, onClose, onAssign }) => {
//   const [form] = Form.useForm();
//   const [batches, setBatches] = useState([]);
//   const [shippers, setShippers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [optionsLoading, setOptionsLoading] = useState(false); // Separate state for fetching options
//   const { fetchDataBearer } = useAxios();

//   // Fetch batch and shipper options once on mount
//   useEffect(() => {
//     const fetchOptions = async () => {
//       setOptionsLoading(true);
//       try {
//         const [batchResponse, shipperResponse] = await Promise.all([
//           fetchDataBearer({
//             url: `/batch/get-batches?pageIndex=0&pageSize=100`,
//             method: "GET",
//           }),
//           fetchDataBearer({
//             url: `/warehouse/get-warehouse-shippers?pageIndex=0&pageSize=100`,
//             method: "GET",
//           }),
//         ]);

//         // Process batch and shipper data
//         setBatches(
//           batchResponse.data.items.map((batch) => ({
//             id: batch.id,
//             name: batch.name,
//           }))
//         );
//         setShippers(
//           shipperResponse.data.items.map((shipper) => ({
//             id: shipper.employeeId,
//             email: shipper.email,
//           }))
//         );
//       } catch (error) {
//         console.error("Error fetching options:", error);
//         message.error("Failed to fetch options for assignment.");
//       } finally {
//         setOptionsLoading(false);
//       }
//     };

//     fetchOptions();
//   }, [fetchDataBearer]);

//   const handleAssign = async () => {
//     try {
//       const values = await form.validateFields();
//       setLoading(true); // Show loading state while assigning
//       await onAssign(values); // Call onAssign with selected values
//       message.success("Shipper assigned successfully!");
//       form.resetFields();
//       onClose();
//     } catch (error) {
//       console.error("Validation or assign failed:", error);
//       message.error("Failed to assign shipper!");
//     } finally {
//       setLoading(false); // Reset loading state
//     }
//   };

//   return (
//     <Modal
//       title="Assign Shipper"
//       visible={open}
//       onCancel={() => {
//         form.resetFields();
//         onClose();
//       }}
//       footer={[
//         <Button key="cancel" onClick={onClose} disabled={loading}>
//           Cancel
//         </Button>,
//         <Button
//           key="assign"
//           type="primary"
//           onClick={handleAssign}
//           loading={loading}
//         >
//           Assign
//         </Button>,
//       ]}
//     >
//       <Form
//         form={form}
//         layout="vertical"
//         initialValues={{ shipperId: "", batchId: "" }}
//       >
//         <Form.Item
//           label="Batch ID"
//           name="batchId"
//           rules={[{ required: true, message: "Please select a batch!" }]}
//         >
//           <Select
//             placeholder="Select Batch"
//             loading={optionsLoading}
//             options={batches.map((batch) => ({
//               value: batch.id,
//               label: `ID: ${batch.id} - Name: ${batch.name}`,
//             }))}
//           />
//         </Form.Item>
//         <Form.Item
//           label="Shipper ID"
//           name="shipperId"
//           rules={[{ required: true, message: "Please select a shipper!" }]}
//         >
//           <Select
//             placeholder="Select Shipper"
//             loading={optionsLoading}
//             options={shippers.map((shipper) => ({
//               value: shipper.id,
//               label: `ID: ${shipper.id} - Email: ${shipper.email}`,
//             }))}
//           />
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default AssignShipperForm;



