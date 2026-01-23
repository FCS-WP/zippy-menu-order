import React from "react";
import Stores from "./Stores";

export default function StoreSelectorPage() {
  const handleSelectStore = (store) => {
    const base = window.location.href.split("&store=")[0];
    window.location.href = `${base}&store_id=${store.id}&store_name=${store.name}`;
  };

  return <Stores onSelect={handleSelectStore} />;
}
