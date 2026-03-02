import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import DeliveryInfo from "../../components/checkout/DeliveryInfo";

// Zippy BookingCalendar
document.addEventListener("DOMContentLoaded", function () {
  const checkoutInfos = document.getElementById("custom_checkout_infos");

  if (
    typeof checkoutInfos != "undefined" &&
    checkoutInfos != null
  ) {
    const root = ReactDOM.createRoot(checkoutInfos);
    root.render(<OrderNowForm />);
  }
});

const OrderNowForm = () => {
  return (
    <div>
        <DeliveryInfo />
        <ToastContainer />
    </div>
  );
};

export default OrderNowForm;
