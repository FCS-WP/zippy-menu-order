import React from "react";
import Popup from "../popup/Popup";
import InputField from "../common/InputField";
import Button from "../common/button/Button";

const AddStorePopup = ({ isOpen, mode, form, setForm, onClose, onSubmit }) => {
  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      height="lg"
      className={`${mode === "add" ? "border-primary-400" : "!border-blue-500"} border-y-4`}
      scroll="custom-scroll"
    >
      <Popup.Header>
        {mode === "add" ? "Add New Store" : `Edit Store: ${form.name}`}
      </Popup.Header>

      <Popup.Body>
        <div className="flex flex-col gap-6">
          {/* ===================== STATUS (TOGGLE) ===================== */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
              label="Store Name"
              required
              value={form.name}
              placeholder="Enter store name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <InputField
              label="Phone"
              value={form.phone}
              placeholder="Enter phone number"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <InputField
              label="Address"
              required
              value={form.address}
              placeholder="Enter address"
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          {/* ===================== 2 COLUMNS ===================== */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
              label="Postal Code"
              required
              value={form.postal_code}
              placeholder="Enter postal code"
              onChange={(e) =>
                setForm({ ...form, postal_code: e.target.value })
              }
            />

            <InputField
              label="Coordinate"
              required
              value={form.coordinate}
              placeholder="Enter coordinate"
              onChange={(e) => setForm({ ...form, coordinate: e.target.value })}
            />
          </div>
          {/* ===================== 3 COLUMNS ===================== */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
              label="Duration (minutes)"
              type="number"
              required
              value={form.duration}
              placeholder="Enter duration"
              onChange={(e) =>
                setForm({ ...form, duration: Number(e.target.value) })
              }
            />

            <InputField
              label="Default Capacity"
              type="number"
              required
              value={form.default_capacity}
              placeholder="Enter capacity"
              onChange={(e) =>
                setForm({ ...form, default_capacity: Number(e.target.value) })
              }
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
              label="Max Booking Days"
              type="number"
              required
              value={form.max_booking_days}
              placeholder="Enter max booking days"
              onChange={(e) =>
                setForm({ ...form, max_booking_days: Number(e.target.value) })
              }
              min={0}
            />
          </div>
        </div>
      </Popup.Body>

      <Popup.Footer
        onClose={onClose}
        onConfirm={onSubmit}
        cancelText="Cancel"
        confirmText={mode === "add" ? "Add Store" : "Save"}
      >
        <div className="mt-4 flex justify-end gap-3">
          <Button
            className="mr-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className={` ${mode === "add" ? "bg-primary border-primary hover:text-primary" : "border-blue-500 bg-blue-500 hover:text-blue-500"} rounded border px-4 py-2 text-white hover:bg-transparent`}
            onClick={onSubmit}
          >
            {mode === "add" ? "Add Store" : "Save"}
          </Button>
        </div>
      </Popup.Footer>
    </Popup>
  );
};

export default AddStorePopup;
