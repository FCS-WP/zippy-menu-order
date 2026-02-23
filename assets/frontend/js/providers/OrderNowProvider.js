import React, { useContext, useState } from "react";
import { OrderFormContext, OrderNowContext, SingleBookingFormContext } from "../contexts";

export const OrderNowProvider = ({ children }) => {
  const [state, setState] = useState({});
  const { storeData = {}, operationData = {}, ...data } = state;

  const updateState = (updates) =>
    setState((prev) => ({ ...prev, ...updates }));

  const value = {
    ...data,
    storeData,
    operationData,
    updateState,
  };

  return (
    <OrderNowContext.Provider value={value}>
      {children}
    </OrderNowContext.Provider>
  );
};

export const useOrderNowProvider = () => useContext(OrderNowContext);
