import { useCallback, useContext, useEffect, useState } from "react";
// import "../../style/Employee.scss";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import EmployeeList from "../../component/manager/employee/EmployeeList";


import { AuthContext } from "../../context/AuthContext";
import { EmployeeListSkeleton } from "../shared/SkeletonLoader";

// export default function EmployeePage() {
//   const [fetching, setFetching] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [employees, setEmployees] = useState();
//   const [index, setIndex] = useState(10);
//   const [page, setPage] = useState(0);
//   const [isShowDetailEmployee, setShowDetailEmployee] = useState(null);
//   const [selectedEmployees, setSelectedEmployees] = useState([]);
//   const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null);
//   const [overall, setOverall] = useState({
//     checked: false,
//     indeterminate: false,
//   });
//   const [search, setSearch] = useState("");
//   const [sortBy, setSortBy] = useState("JoinDate");
//   const [descending, setDescending] = useState(true);

//   const { userInfor } = useContext(AuthContext);
//   const { getEmployeeByUserId, deleteEmployeeById } = AxiosEmployee();

//   const { t } = useTranslation();
//   const debounce = (func, delay) => {
//     let timeout;
//     return (...args) => {
//       if (timeout) clearTimeout(timeout);
//       timeout = setTimeout(() => {
//         func.apply(null, args);
//       }, delay);
//     };
//   };
//   const debouncedFetchEmployees = useCallback(
//     debounce(async (page, index, sortBy, search, descending) => {
//       const response = await getEmployeeByUserId(
//         userInfor?.id,
//         page,
//         index,
//         search,
//         sortBy,
//         descending
//       );
//       setEmployees(response?.data);
//     }, 500),
//     [userInfor?.id]
//   );
//   useEffect(() => {
//     if (userInfor) {
//       setLoading(true);
//       debouncedFetchEmployees(page, index, sortBy, search, descending);
//       setLoading(false);
//     }
//   }, [page, index, sortBy, search, userInfor, fetching, descending]);

//   useEffect(() => {
//     const checkCount = selectedEmployees.length;
//     if (checkCount === employees?.items?.length) {
//       setOverall({ checked: true, indeterminate: false });
//     } else if (checkCount === 0) {
//       setOverall({ checked: false, indeterminate: false });
//     } else {
//       setOverall({ checked: false, indeterminate: true });
//     }
//   }, [selectedEmployees]);

//   const handleShowDetailEmployee = (e, employee) => {
//     e.stopPropagation();
//     setShowDetailEmployee(isShowDetailEmployee === employee ? null : employee);
//   };

//   const toggleEmployeeSelection = (employee) => {
//     setSelectedEmployees((prevSelected) =>
//       prevSelected.includes(employee)
//         ? prevSelected.filter((e) => e !== employee)
//         : [...prevSelected, employee]
//     );
//   };

//   const handleClickOverall = () => {
//     if (overall.checked) {
//       setSelectedEmployees([]);
//     } else {
//       setSelectedEmployees(employees?.items || []);
//     }
//   };

//   const handleDownload = () => {
//     const formattedData =
//       selectedEmployees.length > 0
//         ? selectedEmployees.map((item) => ({ ...item }))
//         : employees?.items?.map((item) => ({ ...item }));

//     const formatDate = () => {
//       const date = new Date();
//       const day = String(date.getDate()).padStart(2, "0");
//       const month = String(date.getMonth() + 1).padStart(2, "0");
//       const year = date.getFullYear();
//       const hours = String(date.getHours()).padStart(2, "0");
//       const minutes = String(date.getMinutes()).padStart(2, "0");
//       const seconds = String(date.getSeconds()).padStart(2, "0");

//       return `${day}-${month}-${year}-${hours}h-${minutes}m-${seconds}s`;
//     };

//     const worksheet = XLSX.utils.json_to_sheet(formattedData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });

//     const blob = new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });

//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = `${t("Employees")}-${formatDate()}.xlsx`;

//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleDeleteClick = (e, employee) => {
//     e.stopPropagation();
//     setShowDeleteConfirmation(employee);
//   };

//   const confirmDelete = async () => {
//     try {
//       await deleteEmployeeById(showDeleteConfirmation?.id);
//     } catch (e) {
//       console.error("Error deleting employee:", e);
//     } finally {
//       setShowDeleteConfirmation(null);
//       setFetching((prev) => !prev);
//     }
//   };

//   const cancelDelete = () => {
//     setShowDeleteConfirmation(null);
//   };

//   const handleSortChange = (value) => {
//     if (sortBy === value) {
//       setDescending((prev) => !prev);
//     } else {
//       setSortBy(value);
//     }
//   };

//   return (
//     <div className="w-full h-full gap-10 ">
//       <div className="w-full">
//         <EmployeeHeader
//           handleDownload={handleDownload}
//           employees={employees}
//           selectedEmployees={selectedEmployees}
//           handleClickOverall={handleClickOverall}
//           search={search}
//           setSearch={setSearch}
//         />
//         {!loading ? (
//           employees?.items?.length > 0 ? (
//             <EmployeeList
//               employees={employees?.items}
//               selectedEmployees={selectedEmployees}
//               toggleEmployeeSelection={toggleEmployeeSelection}
//               handleShowDetailEmployee={handleShowDetailEmployee}
//               handleSortChange={handleSortChange}
//               sortBy={sortBy}
//               descending={descending}
//             />
//           ) : (
//             <div>No employees found!</div>
//           )
//         ) : (
//           <EmployeeListSkeleton size={index} />
//         )}
//       </div>
//       {showDeleteConfirmation && (
//         <>
//           <div className="fixed inset-0 bg-black bg-opacity-50"></div>
//           <div
//             className="absolute bg-white border border-gray-300 shadow-md rounded-lg p-4 w-fit h-fit"
//             style={{
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//             }}
//           >
//             <p>{`Are you sure you want to delete ${showDeleteConfirmation.name}?`}</p>
//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={confirmDelete}
//                 className="bg-red-500 text-white px-4 py-2 rounded-md"
//               >
//                 Delete
//               </button>
//               <button
//                 onClick={cancelDelete}
//                 className="bg-gray-300 text-black px-4 py-2 rounded-md"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

export default function EmployeePage() {
  return <EmployeeList />;
}
