import { useState, useCallback } from "react";
import { FEMenuApi, FEProductsApi, FEStoreApi } from "../api";

export const useFetchProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (params) => {

    try {
      setLoading(true);
      setError(null);
    //   const data = await FEStoreApi.getStore(params);

    //   if (data?.status === "success") {
    //     setProducts(data.data || []);
    //   }
    } catch (err) {
      console.error("Error fetching store:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

   const fetchCategories = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const data = await FEProductsApi.getProductsAndCategories(params);

      if (data?.status === "success") {
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    categories,
    loading,
    error,
    fetchCategories,
    fetchProducts,
  };
};
