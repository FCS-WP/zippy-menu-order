import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import OrderForm from "../../components/pages/order/OrderForm";

// Zippy BookingCalendar
document.addEventListener("DOMContentLoaded", function () {
  const frontend_order_form = document.getElementById("frontend_order_form");

  if (
    typeof frontend_order_form != "undefined" &&
    frontend_order_form != null
  ) {
    const root = ReactDOM.createRoot(frontend_order_form);
    root.render(<FrontendOrderForm />);
  }
});

const FrontendOrderForm = () => {
  return (
    <div>
      <OrderForm />
      <ToastContainer />
    </div>
  );
};

export default FrontendOrderForm;
