import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import MenuSetting from "../../../components/settings/MenuSetting";

// Zippy Dashboard
document.addEventListener("DOMContentLoaded", function () {
  const zippy_single_settings = document.getElementById("single_menu_settings");
  if (
    typeof zippy_single_settings != "undefined" &&
    zippy_single_settings != null
  ) {
    const root = ReactDOM.createRoot(zippy_single_settings);
    root.render(<SingleSettingsPage />);
  }
});

const SingleSettingsPage = () => {
  return (
    <>
      <MenuSetting />
      <ToastContainer />
    </>
  );
};
