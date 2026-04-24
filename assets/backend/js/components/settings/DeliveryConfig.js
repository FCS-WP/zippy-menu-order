import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import InputField from "../common/InputField";
import Button from "../common/button/Button";
import { SettingsApi } from "../../api";

const DeliveryConfig = () => {
  const [minDeliveryTotal, setMinDeliveryTotal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadSettings = async () => {
    setIsLoading(true);
    const res = await SettingsApi.getSettings();
    if (!res || res.status !== "success") {
      toast.error("Failed to load settings!");
      setIsLoading(false);
      return;
    }
    setMinDeliveryTotal(String(res.data?.min_delivery_total ?? ""));
    setIsLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    const value = parseFloat(minDeliveryTotal);
    if (isNaN(value) || value < 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    setIsSaving(true);
    const res = await SettingsApi.updateSettings({
      min_delivery_total: value,
    });
    setIsSaving(false);
    if (!res || res.status !== "success") {
      toast.error("Failed to save settings!");
      return;
    }
    toast.success("Settings saved!");
  };

  return (
    <div className="mb-6 w-full bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">Delivery Configuration</h2>
      <div className="flex max-w-md flex-col gap-3">
        <InputField
          label="Minimum Home Delivery Total ($)"
          type="number"
          min={0}
          value={minDeliveryTotal}
          onChange={(e) => setMinDeliveryTotal(e.target.value)}
          disabled={isLoading}
          placeholder="40"
        />
        <p className="text-xs text-gray-500">
          Orders below this subtotal cannot choose Home Delivery at checkout.
        </p>
        <div>
          <Button onClick={handleSave} isLoading={isSaving} disabled={isLoading}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryConfig;
