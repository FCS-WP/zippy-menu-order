import React from "react";
import ReactDOM from "react-dom/client";
import StorePage from "../../components/store/StorePage";
import CustomToastContainer from "../../components/common/toast/Toast";

document.addEventListener("DOMContentLoaded", function () {
  const zippy_order = document.getElementById("zippy_stores_settings");
  if (typeof zippy_order != "undefined" && zippy_order != null) {
    const root = ReactDOM.createRoot(zippy_order);
    root.render(
      <>
        <CustomToastContainer />
        <StorePage />
      </>,
    );
  }
});
