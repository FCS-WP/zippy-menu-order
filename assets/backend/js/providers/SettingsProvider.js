import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SettingsContext } from "../contexts";

export const SettingsProvider = ({ children }) => {
  const [state, setState] = useState({});

  const {} = state;
   const [tableConfigs, setTableConfigs] = useState({
      page: 1,
      rowsPerPage: 10,
      totalRows: 10,
    });

  const updateState = (updates) =>
    setState((prev) => ({ ...prev, ...updates }));

  useEffect(() => {
    const initData = async () => {};
    initData();

    return () => {};
  }, []);

  const value = {
    tableConfigs,
    updateState,
    setTableConfigs
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsProvider = () => useContext(SettingsContext);
