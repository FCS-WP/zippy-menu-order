import { useState, useCallback } from "react";
import { BookingApi, MenuApi } from "../api";

export const useFetchMenu = () => {
  const [menus, setMenus] = useState([]);
  const [currentMenu, setCurrentMenu] = useState();
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
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
        setError(data?.message ?? 'fetch error');
      }


    } catch (err) {
      console.error("Error fetching menu:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMenus = useCallback(
    async ({ filters = {}, page = null, perPage = null } = {}) => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          ...filters,
          page,
          per_page: perPage,
        };

        const data = await MenuApi.getMenus(params);

        if (data?.status === "success") {
          setMenus(data.data.menus || []);
          setTotalRows(data.data.total || 0);
        }
      } catch (err) {
        console.error("Error fetching menus:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    currentMenu,
    menus,
    totalRows,
    loading,
    error,
    fetchMenuDetail,
  };
};
