// SettingPage.jsx
import React from "react";
import StoreSelectorPage from "./StoreSelectorPage";
import StoreSettingPage from "./StoreSettingPage";

export default function StorePage() {
  const params = new URLSearchParams(window.location.search);

  const storeName = params.get("store_name");
  const storeId = Number(params.get("store_id"));

  const canOpenSetting = storeId && !isNaN(storeId);

  return (
    <div className="min-h-screen p-8">
      {!canOpenSetting ? (
        <StoreSelectorPage />
      ) : (
        <StoreSettingPage storeName={storeName} storeId={storeId} />
      )}
    </div>
  );
}
