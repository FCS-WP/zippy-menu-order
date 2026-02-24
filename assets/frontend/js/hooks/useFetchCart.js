import { useState, useCallback } from "react";
import { FECartApi } from "../api";

export const useFetchCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const data = await FECartApi.getCart(params);

      if (data?.status === "success") {
        setCart(data.data.cart_data || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProductToCart = async (params) => {
    try {
      setLoading(true);
      setError(null);
      const data = await FECartApi.normalAddToCart(params);
      if (data?.status === "success") {
        return data.data;
      }
    } catch (err) {
      console.error("Error added to cart:", err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeItemFromCart = async (params) => {
    try {
      setLoading(true);
      setError(null);
      const data = await FECartApi.removeCartItem(params);
      if (data?.status === "success") {
        return data.data;
      }
    } catch (err) {
      console.error("Error remove item from cart:", err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    cart,
    loading,
    error,
    fetchCart,
    addProductToCart,
    removeItemFromCart,
  };
};
