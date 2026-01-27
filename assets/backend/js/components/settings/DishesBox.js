import React, { useState, useRef, useEffect, useCallback } from "react";
import Switch from "../common/Switch";
import { DishesMenusApi, ProductApi } from "../../api";
import { debounce } from "../../helpers/debounce";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../common/button/Button";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import DishItem from "./DishItem";
import { clearConfigCache } from "prettier";

const DishesBox = ({ box, onClickRemoveBox }) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchMessage, setSearchMessage] = useState("");
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [boxData, setBoxData] = useState(box);
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = async (keyword) => {
    // query here
    const res = await ProductApi.searchProductsByName({
      q: keyword,
    });

    if (res.status == "success") {
      return res.data;
    }

    return null;
  };

  // Add Dish
  const onClickAddDishToBox = (dish) => {
    const newDish = {
      id: crypto.randomUUID(),
      product_id: dish.id,
      name: dish.name,
      extra_price: 0,
      is_new: true,
    };

    setBoxData({ ...boxData, ["dishes"]: [...boxData.dishes, newDish] });
    setSearch("");
    setOpen(false);
  };

  const getCleanDishesData = () => {
    const newDishes = boxData.dishes.map((item) => {
      if (item?.is_new) {
        return { ...item, id: "" };
      }
      return item;
    });
    return newDishes;
  };

  const onRemoveDish = async (dish) => {
    const updatedDishes = boxData.dishes.filter((item) => {
      return parseInt(item.product_id) !== parseInt(dish.product_id);
    });
    setBoxData({ ...boxData, ["dishes"]: updatedDishes });
  };

  const debounceSearchServices = useCallback(
    debounce(async (keyword) => {
      if (keyword.trim()) {
        const results = await handleSearch(keyword);
        if (results) {
          setSearchResults(results);
          if (results.length == 0) {
            setSearchMessage(`Not found product name "${keyword}"`);
          } else {
            setSearchMessage(``);
          }
        } else {
          toast.error("Search error");
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    }, 500),
    [],
  );

  const onSaveChanges = async () => {
    setIsBtnLoading(true);
    let params = {
      is_required: boxData.is_required,
      max_qty: parseInt(boxData.max_qty) ?? 0,
      min_qty: parseInt(boxData.min_qty) ?? 0,
      menu_id: parseInt(boxData.menu_id),
      type: boxData.type,
      name: boxData.name,
      dishes: getCleanDishesData(boxData.dishes) ?? [],
    };

    if (boxData?.is_new) {
      await handleCreateBox(params);
      setIsBtnLoading(false);
      return;
    }
    ((params.id = boxData.id), await handleUpdateBox(params));
    setIsBtnLoading(false);
    return;
  };

  const handleCreateBox = async (params) => {
    const res = await DishesMenusApi.createDishesMenu(params);
    if (!res || res.status !== "success") {
      toast.error("Failed to create menu!");
      return;
    }
    setBoxData({ ...boxData, id: res.data.id, is_new: false });
    toast.success("Menu has been created!");
    return;
  };

  const handleUpdateBox = async (params) => {
    const res = await DishesMenusApi.updateDishesMenu(params);
    if (!res || res.status !== "success") {
      toast.error("Failed to save changes!");
      return;
    }
    toast.success("Menu has been updated!");
    return;
  };

  useEffect(() => {
    debounceSearchServices(search);
  }, [search]);

  useEffect(() => {
    setBoxData(box);
  }, [box]);

  const updateField = (key, val) => {
    setBoxData({ ...boxData, [key]: val });
  };

  const updateDishField = (key, val, product_id) => {
    const newDishes = [];
    boxData?.dishes?.map((item) => {
      if (parseInt(item.product_id) === parseInt(product_id)) {
        const newItem = { ...item, [key]: val };
        newDishes.push(newItem);
      } else {
        newDishes.push(item);
      }
    });

    setBoxData({ ...boxData, ["dishes"]: newDishes });
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex justify-between">
        <h2 className="!text-3xl !mt-0 !mb-4 font-bold !text-primary">
          {boxData.name}
        </h2>
        <Button
          className="bg-white border-0 py-0"
          onClick={() => onClickRemoveBox(box)}
        >
          <FontAwesomeIcon icon={faTrash} color="red" />
        </Button>
      </div>

      <div className="pb-6 mb-6 border-b border-gray-200 grid md:grid-cols-2 gap-4 items-center">
        {/* Box name */}
        <div className="">
          <span className="mr-4"> Name </span>
          <input
            type="text"
            value={boxData.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-4 items-center">
          <span> Required </span>
          <Switch
            checked={boxData?.is_required > 0 ? true : false}
            onChange={(v) => updateField("is_required", v ? 1 : 0)}
          />
        </div>

        {/* Min_qty */}
        <div>
          <span> Min QTY </span>
          <input
            type="number"
            min={0}
            value={boxData.min_qty ?? 0}
            onChange={(e) => updateField("min_qty", e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        {/* max_qty */}
        <div>
          <span> Max QTY </span>
          <input
            type="number"
            min={0}
            value={boxData.max_qty ?? 0}
            onChange={(e) => updateField("max_qty", e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Search wrapper */}
      <div ref={ref} className="relative">
        <input
          type="text"
          placeholder="Search dishes..."
          value={search}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />

        {/* Dropdown */}
        {open && search && (
          <div className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border bg-white shadow-lg">
            {searchResults.length > 0 ? (
              searchResults.map((dish) => {
                const exists = boxData.dishes.some(
                  (d) => parseInt(d.product_id) === parseInt(dish.id),
                );

                return (
                  <div
                    key={dish.id}
                    className="flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    <span>{dish.name}</span>
                    <button
                      disabled={exists}
                      onClick={() => onClickAddDishToBox(dish)}
                      className={`px-2 py-1 rounded cursor-pointer text-xs
                        ${
                          exists
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                    >
                      {exists ? "Added" : "Add"}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">No results</div>
            )}
          </div>
        )}
      </div>

      {/* Added dishes */}
      {boxData.dishes.length > 0 && (
        <div className="mt-4">
          <h4 className="!text-xl font-bold text-primary mb-2">Added dishes</h4>
          <div>
            {boxData.dishes.map((dish) => (
              <DishItem
                dish={dish}
                key={dish.id}
                onRemoveDish={onRemoveDish}
                updateDishField={updateDishField}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <Button
          isLoading={isBtnLoading}
          onClick={onSaveChanges}
          disabled={isBtnLoading}
        >
          Save changes
        </Button>
      </div>
    </div>
  );
};

export default DishesBox;
