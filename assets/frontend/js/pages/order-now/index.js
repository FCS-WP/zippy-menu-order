import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { OrderNowProvider } from "../../providers/OrderNowProvider";
import OrderNow from "../../components/pages/order/OrderNow";

// Zippy BookingCalendar
document.addEventListener("DOMContentLoaded", function () {
  const frontend_order_form = document.getElementById("order_now_form");

  if (
    typeof frontend_order_form != "undefined" &&
    frontend_order_form != null
  ) {
    const root = ReactDOM.createRoot(frontend_order_form);
    root.render(<OrderNowForm />);
  }
});

const OrderNowForm = () => {
  return (
    <OrderNowProvider>
        <OrderNow />
        <ToastContainer />
    </OrderNowProvider>
  );
};

export default OrderNowForm;
