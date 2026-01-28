import { useState, useCallback } from "react";
import { FEMenuApi, FEStoreApi } from "../api";

export const useFetchStore = () => {
  const [store, setStore] = useState([]);
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStore = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const data = await FEStoreApi.getStore(params);

      if (data?.status === "success") {
        setStore(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching store:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

   const fetchOperations = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const data = await FEStoreApi.getOperations(params);

      if (data?.status === "success") {
        setOperations(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching operations:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    store,
    operations,
    loading,
    error,
    fetchOperations,
    fetchStore,
  };
};
