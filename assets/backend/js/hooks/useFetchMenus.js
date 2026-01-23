import { useState, useCallback } from "react";
import { BookingApi, MenuApi } from "../api";

export const useFetchMenu = () => {
  const [menus, setMenus] = useState([]);
  const [currentMenu, setCurrentMenu] = useState();
  const [dataPagination, setDataPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [isFetched, setIsFetched] = useState(false);
  const [error, setError] = useState(null);

  const fetchMenuDetail = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await MenuApi.getDetail(id);

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

  const fetchMenus = useCallback(async (tableConfig) => {
    try {
      setLoading(true);
      setError(null);
      const data = await MenuApi.getMenus(tableConfig);

      if (data?.status === "success") {
        console.log(data.data.data);
        setMenus(data.data.data || []);
        setDataPagination(data.data.pagination || 0);
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
    dataPagination,
    totalRows,
    isFetched,
    loading,
    error,
    fetchMenuDetail,
    fetchMenus,
  };
};
