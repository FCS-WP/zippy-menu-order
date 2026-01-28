import React, { useContext, useState } from "react";
import { OrderFormContext, SingleBookingFormContext } from "../contexts";

export const OrderFormProvider = ({ children }) => {
  const [state, setState] = useState({});
  const { menuData = {}, storeData = {}, operationData = {}, ...data } = state;

  const updateState = (updates) =>
    setState((prev) => ({ ...prev, ...updates }));

  const value = {
    ...data,
    menuData,
    storeData,
    operationData,
    updateState,
  };

  return (
    <OrderFormContext.Provider value={value}>
      {children}
    </OrderFormContext.Provider>
  );
};

export const useOrderFormProvider = () => useContext(OrderFormContext);
