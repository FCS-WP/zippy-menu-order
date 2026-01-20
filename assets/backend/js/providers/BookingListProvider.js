// import React, { useContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { BookingListContext } from "../contexts";
// import { BookingApi } from "../api";

// export const BookingListProvider = ({ children }) => {
//   const [state, setState] = useState({});
//   const [bookings, setBookings] = useState([]);
//   const [loadingOrders, setLoadingOrders] = useState(true);
//   const [filteredBookings, setFilteredBookings] = useState(null);
//   const [tableConfigs, setTableConfigs] = useState({
//     page: 1,
//     rowsPerPage: 10,
//     totalRows: 10,
//   });

//   const fetchBookings = async () => {
//     try {
//       setLoadingOrders(true);
//       const params = {
//         ...filteredBookings,
//         page: tableConfigs.page,
//         per_page: tableConfigs.rowsPerPage,
//       };

//       const data = await BookingApi.getBooking(params);

//       if (data.status === "success") {
//         setBookings(data.data.bookings);
//         setTableConfigs((prev) => ({
//           ...prev,
//           totalRows: data.data.total_orders,
//         }));
//       }
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//       setLoadingOrders(false);
//     } finally {
//       setLoadingOrders(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, [tableConfigs.page, tableConfigs.rowsPerPage, filteredBookings]);

//   const {} = state;

//   const updateState = (updates) =>
//     setState((prev) => ({ ...prev, ...updates }));

//   useEffect(() => {
//     const initData = async () => {};
//     initData();

//     return () => {};
//   }, []);

//   const handleFilterOrder = (filters) => {
//     resetTableConfigs();
//     setFilteredBookings(filters);
//   };

//   const resetTableConfigs = () => {
//     setTableConfigs((prev) => ({
//       ...prev,
//       page: 1,
//       rowsPerPage: 10,
//     }));
//   };

//   const value = {
//     bookings,
//     tableConfigs,
//     loadingOrders,
//     updateState,
//     handleFilterOrder,
//     setTableConfigs,
//     fetchBookings,
//   };

//   return (
//     <BookingListContext.Provider value={value}>
//       {children}
//     </BookingListContext.Provider>
//   );
// };

// export const useBookingListProvider = () => useContext(BookingListContext);
