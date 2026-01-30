import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { DashboardProvider } from "../../providers/DashboardProvider";

// Zippy Dashboard
document.addEventListener("DOMContentLoaded", function () {
  const zippy_order = document.getElementById("ZIPPY_MENU_ORDER");
  if (typeof zippy_order != "undefined" && zippy_order != null) {
    const root = ReactDOM.createRoot(zippy_order);
    root.render(<DashboardPage />);
  }
});

const DashboardPage = () => {
  return (
    <>
      <DashboardProvider>
        {/* <ListBooking /> */}
        <h2>Welcome to Menu Order</h2>
        <ToastContainer />
      </DashboardProvider>
    </>
  );
};
