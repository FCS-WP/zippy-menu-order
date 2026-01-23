import React, { useState, useEffect } from "react";
import BackButton from "../common/button/BackButton";
import Button from "../common/button/Button";
import { URL_WP_ADMIN_BOOKING } from "../../helpers/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faEdit,
  faLocationDot,
  faPhone,
  faEllipsis,
  faArrowUpRightFromSquare,
  faBoxes,
} from "@fortawesome/free-solid-svg-icons";
import AddStorePopup from "./AddStorePopup";
import ConfirmPopup from "../popup/ConfirmPopup";
import { StoreApi } from "../../api";
import { toast } from "react-toastify";

const Stores = ({ onSelect }) => {
  const [stores, setStores] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupMode, setPopupMode] = useState("add");
  const [currentStoreId, setCurrentStoreId] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [storeForm, setStoreForm] = useState({});

  // CLOSE MENU WHEN CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".store-menu")) setActiveMenuId(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStores = async () => {
    try {
      const res = await StoreApi.getStores();
      if (res.status === "success") setStores(res.data.stores);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getStores();
  }, []);

  // POPUP HANDLERS
  const openAddPopup = () => {
    setPopupMode("add");
    setStoreForm({
      name: "",
      address: "",
      phone: "",
      default_capacity: "",
      duration: "",
      postal_code: "",
      coordinate: "",
    });
    setOpenPopup(true);
  };

  const openEditPopup = (store) => {
    setPopupMode("edit");
    setCurrentStoreId(store.id);
    setStoreForm({ ...store });
    setOpenPopup(true);
  };

  const openDeletePopup = (store) => {
    setPopupMode("delete");
    setCurrentStoreId(store.id);
    setStoreForm({ name: store.name });
    setOpenPopup(true);
  };

  // CRUD HANDLERS
  const handleAddStore = async () => {
    if (
      !storeForm.name ||
      !storeForm.address ||
      !storeForm.phone ||
      !storeForm.default_capacity
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    const newStore = {
      ...storeForm,
      active: "1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const res = await StoreApi.createStore(newStore);
    if (res.status === "success") {
      setStores((prev) => [...prev, newStore]);
      setOpenPopup(false);
      toast.success("Store created successfully!");
    } else toast.error("Failed to create store");
  };

  const handleEditStore = async () => {
    const res = await StoreApi.updateStore({
      ...storeForm,
      id: currentStoreId,
    });
    if (res.status === "success") {
      setStores((prev) =>
        prev.map((s) => (s.id === currentStoreId ? { ...s, ...storeForm } : s)),
      );
      toast.success("Store updated successfully!");
    } else toast.error("Failed to update store");
    setOpenPopup(false);
  };

  const handleDeleteStore = async () => {
    try {
      const res = await StoreApi.deleteStore({ ids: [currentStoreId] });

      if (res?.status === "success") {
        setStores((prev) => prev.filter((s) => s.id !== currentStoreId));
        toast.success("Store deleted successfully!");
      } else {
        toast.error(res?.message || "Failed to delete store");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Error deleting store");
    } finally {
      setOpenPopup(false);
    }
  };

  // TOGGLE STATUS INDEPENDENTLY
  const toggleStatus = async (store) => {
    const newStatus = store.active === "1" ? "0" : "1";
    try {
      const res = await StoreApi.updateStore({
        ...store,
        active: newStatus,
      });
      if (res.status === "success") {
        setStores((prev) =>
          prev.map((s) =>
            s.id === store.id ? { ...s, active: newStatus } : s,
          ),
        );
        toast.success(
          `Store ${newStatus === "1" ? "activated" : "deactivated"} successfully!`,
        );
      } else toast.error("Failed to update store status.");
    } catch (error) {
      console.error(error);
      toast.error("Error updating store status.");
    }
  };

  return (
    <>
      <BackButton href={URL_WP_ADMIN_BOOKING}>Back to Dashboard</BackButton>

      <div className="rounded-2xl bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Select Your Store</h2>
          <Button
            onClick={openAddPopup}
            className="bg-primary border-primary hover:text-primary rounded border px-4 py-2 text-white transition hover:bg-transparent"
          >
            <FontAwesomeIcon icon={faPlus} /> Add Store
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {stores.map((store) => (
            <div
              key={store.id}
              className={`relative flex flex-col justify-between rounded-xl border border-gray-50 bg-gray-50 p-4 shadow-md hover:bg-gray-100 ${
                store.active === "0" ? "" : "cursor-pointer"
              }`}
              onClick={() => {
                if (store.active === "1") {
                  onSelect(store);
                }
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <div
                  className={`pb-2 text-lg font-semibold ${
                    store.active === "0" ? "opacity-50" : ""
                  } `}
                >
                  {store.name}
                </div>
                {/* ACTION MENU */}
                <div className="relative">
                  <div
                    className={`store-menu relative inline-block text-left ${
                      store.active === "0"
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                  >
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(
                          activeMenuId === store.id ? null : store.id,
                        );
                      }}
                      disabled={store.active === "0"}
                      className={`bg-transparent !p-0`}
                    >
                      <FontAwesomeIcon
                        className="rotate-90 text-lg"
                        icon={faEllipsis}
                      />
                    </Button>

                    {activeMenuId === store.id && (
                      <div className="absolute right-0 z-10 w-28 rounded-md bg-white shadow-lg">
                        <div className="py-1">
                          <Button
                            onClick={() => onSelect(store)}
                            className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-100"
                          >
                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />{" "}
                            Detail
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditPopup(store);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-blue-700 hover:bg-blue-100"
                          >
                            <FontAwesomeIcon icon={faEdit} /> Edit
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeletePopup(store);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-100"
                          >
                            <FontAwesomeIcon icon={faTrash} /> Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`text-sm text-gray-600 ${
                  store.active === "0" ? "opacity-50" : ""
                } `}
              >
                <div className="mb-1 mb-2 flex items-start gap-2">
                  <FontAwesomeIcon icon={faLocationDot} />
                  <span>{store.address}</span>
                </div>
                <div className="mb-1 mb-2 flex items-start gap-2">
                  <FontAwesomeIcon icon={faPhone} />
                  <span>{store.phone}</span>
                </div>
                <div className="mb-1 mb-2 flex items-start gap-2">
                  <FontAwesomeIcon icon={faBoxes} />
                  <span>Capacity: {store.default_capacity}</span>
                </div>
              </div>
              {/* Toggle status */}
              <div className="z-40 my-2 border-t border-gray-200">
                <div className="flex items-center justify-between gap-2 pt-5">
                  <span
                    className={`text-sm font-medium text-gray-700 ${
                      store.active === "0" ? "opacity-50" : ""
                    }`}
                  >
                    Disable this store?
                  </span>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStatus(store);
                    }}
                    className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full transition ${
                      store.active === "1" ? "bg-primary-500" : "bg-gray-500"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        store.active === "1" ? "translate-x-5" : "translate-x-1"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POPUP */}
      <AddStorePopup
        isOpen={openPopup && (popupMode === "add" || popupMode === "edit")}
        mode={popupMode}
        form={storeForm}
        setForm={setStoreForm}
        onClose={() => setOpenPopup(false)}
        onSubmit={popupMode === "add" ? handleAddStore : handleEditStore}
      />
      <ConfirmPopup
        isOpen={openPopup && popupMode === "delete"}
        title="Delete Store"
        message={`Are you sure you want to delete <strong>${storeForm.name}</strong>?`}
        confirmText="Delete"
        confirmColor="bg-red-500 hover:bg-red-600"
        onClose={() => setOpenPopup(false)}
        onConfirm={handleDeleteStore}
      />
    </>
  );
};

export default Stores;
