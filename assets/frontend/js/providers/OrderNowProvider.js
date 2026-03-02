import React, { useContext, useEffect, useState } from "react";
import { OrderFormContext, OrderNowContext, SingleBookingFormContext } from "../contexts";
import { useFetchProducts } from "../hooks/useFetchProducts";
import { useFetchCart } from "../hooks/useFetchCart";

export const OrderNowProvider = ({ children }) => {
  const [state, setState] = useState({});
  const { storeData = {}, operationData = {}, ...data } = state;
  const { categories, fetchCategories } = useFetchProducts();
  const { cart, fetchCart } = useFetchCart();

  const updateState = (updates) =>
    setState((prev) => ({ ...prev, ...updates }));

  useEffect(()=>{
    fetchCategories();
    fetchCart();
  }, [])

  useEffect(()=>{
    updateState({ cart: cart });
  }, [cart])

  const value = {
    ...data,
    categories,
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
