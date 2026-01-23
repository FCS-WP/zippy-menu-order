import React from "react";
import Switch from "../common/Switch";
import Button from "../common/button/Button";
import { MenuApi } from "../../api";
import { toast } from "react-toastify";

export default function MenuDetailSection({ value = {}, onChange }) {
  const updateField = (key, val) => {
    onChange({ ...value, [key]: val });
  };

  const onClickSave = async () => {
    let params = {
      name: value?.name,
      description: value?.description,
      min_pax: value?.min_pax ?? 1,
      max_pax: value?.max_pax ?? null,
      is_active: value?.is_active ? 1 : 0,
      price: parseFloat(value?.price),
      dishes_qty: parseInt(value?.dishes_qty),
    };

    if (!value?.id || value?.id == 0) {
      console.log(value)
      await handleCreateMenu(params);
      return true;
    } else {
      params.id = value?.id;
      await handleUpdateMenu(params);
    }
  };

  const handleUpdateMenu = async (params) => {
    const res = await MenuApi.updateMenu(params);
    if (res.status !== 'success') {
      toast.error(res?.message ?? "Failed to update menu!")
      return;
    }
    toast.success("Menu Updated!");
    return true;
  };
  const handleCreateMenu = async (params) => {
    const res = await MenuApi.createMenu(params);
    if (res.status !== 'success') {
      toast.error(res?.message ?? "Failed to save menu!")
      return;
    }
    return true;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm mb-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Menu name */}
        <div className="">
          <label className="block text-sm font-medium mb-1">Menu name</label>
          <input
            type="text"
            value={value?.name ?? ""}
            onChange={(e) => updateField("name", e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        {/* Menu name */}
        <div className="">
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            value={value?.description ?? ""}
            onChange={(e) => updateField("description", e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        {/* Min pax */}
        <div>
          <label className="block text-sm font-medium mb-1">Min pax</label>
          <input
            type="number"
            min={1}
            value={value?.min_pax  ?? 1}
            onChange={(e) => updateField("min_pax", Number(e.target.value))}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        {/* Max pax */}
        <div>
          <label className="block text-sm font-medium mb-1">Max pax</label>
          <input
            type="number"
            min={value?.min_pax}
            value={value?.max_pax ?? -1}
            onChange={(e) => updateField("max_pax", Number(e.target.value))}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        {/* Price per pax */}
        <div>
          <label className="block text-sm font-medium mb-1">Price / pax</label>
          <input
            type="number"
            min={0}
            step="1"
            value={value?.price ?? 0}
            onChange={(e) => updateField("price", Number(e.target.value))}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        {/* Dishes quantity */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Dishes quantity
          </label>
          <input
            type="number"
            min={1}
            value={value?.dishes_qty ?? 1}
            onChange={(e) => updateField("dishes_qty", Number(e.target.value))}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div className="col-span-2 flex justify-between">
          {/* Active */}
          <div className="flex items-center gap-3">
            <Switch
              checked={value?.is_active ?? false}
              onChange={(v) => updateField("is_active", v)}
            />
            <span className="text-sm font-medium">Menu active</span>
          </div>

          <div>
            <Button onClick={onClickSave}>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
