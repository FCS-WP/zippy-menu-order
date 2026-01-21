import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SettingsContext } from "../contexts";

export const SettingsProvider = ({ children }) => {
  const [state, setState] = useState({});

  const {} = state;
   const [tableConfigs, setTableConfigs] = useState({
      page: 1,
      rowsPerPage: 10,
      totalRows: 10,
    });

  const updateState = (updates) =>
    setState((prev) => ({ ...prev, ...updates }));

  useEffect(() => {
    const initData = async () => {};
    initData();

    return () => {};
  }, []);

    //   const fetchMenus = async () => {
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


  const value = {
    tableConfigs,
    updateState,
    setTableConfigs
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsProvider = () => useContext(SettingsContext);
