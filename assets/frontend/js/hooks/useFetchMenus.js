import { useState, useCallback } from "react";
import { FEMenuApi } from "../api";

export const useFetchMenu = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentMenu, setCurrentMenu] = useState();
  const [error, setError] = useState(null);
  const [isFetched, setIsFetched] = useState(false);


  const fetchMenuDetail = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await FEMenuApi.getDetail(id);

      if (data?.status === "success") {
        setCurrentMenu(data.data || {});
      }

      if (data?.status === "error") {
        setError(data?.message ?? "fetch error");
      }
      setIsFetched(true);
    } catch (err) {
      console.error("Error fetching menu:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMenus = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const data = await FEMenuApi.getMenus(params);

      if (data?.status === "success") {
        setMenus(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching menus:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    currentMenu,
    menus,
    isFetched,
    loading,
    error,
    fetchMenuDetail,
    fetchMenus,
  };
};
