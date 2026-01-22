import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import MenuList from "../../components/settings/MenuList";
import { SettingsProvider } from "../../providers/SettingsProvider";

// Zippy Dashboard
document.addEventListener("DOMContentLoaded", function () {
  const zippy_settings = document.getElementById("menu_orders_settings");
  if (typeof zippy_settings != "undefined" && zippy_settings != null) {
    const root = ReactDOM.createRoot(zippy_settings);
    root.render(<SettingsPage />);
  }
});

const SettingsPage = () => {
  return (
    <>
      <SettingsProvider>
        <MenuList />
        <ToastContainer />
      </SettingsProvider>
    </>
  );
};
