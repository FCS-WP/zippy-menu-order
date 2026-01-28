import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import OrderForm from "../../components/pages/order/OrderForm";
import ListMenu from "../../components/menus/ListMenu";

// Zippy BookingCalendar
document.addEventListener("DOMContentLoaded", function () {
  const menu_order_list = document.getElementById("menu_order_list");
  if (
    typeof menu_order_list != "undefined" &&
    menu_order_list != null
  ) {
    const root = ReactDOM.createRoot(menu_order_list);
    root.render(<FEOrderList />);
  }
});

const FEOrderList = () => {
  return (
    <div>
      <ListMenu />
      <ToastContainer />
    </div>
  );
};

export default FEOrderList;
