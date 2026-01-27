import React, { useEffect, useState } from "react";
import DishesBox from "./DishesBox";

const MenuBoxes = ({ data, title, onClickRemoveBox, boxType }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const menuId = urlParams.get("menu_id") ?? null;
  const [boxes, setBoxes] = useState(data);
  // Add new box
  const addBox = () => {
    setBoxes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        dishes: [],
        type: boxType,
        max_qty: 0,
        min_qty: 0,
        is_required: 1,
        menu_id: menuId,
        is_new: true,
      },
    ]);
  };

  const removeBox = (id) => {
    setBoxes((prev) => prev.filter((box) => box.id !== id));
  };

  const handleRemoveBox = (item) => {
    if (item.is_new) {
      removeBox(item.id);
      return;
    }
    onClickRemoveBox(item);
  };

  // Add dish to box (prevent duplicate)

  useEffect(() => {
    setBoxes(data);
  }, [data]);

  return (
    <div>
      <div>
        <h2 className="!text-3xl font-bold mb-4">{title}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {boxes.map((box) => (
            <DishesBox
              key={box.id}
              box={box}
              onClickRemoveBox={handleRemoveBox}
            />
          ))}
        </div>
      </div>

      <button
        onClick={addBox}
        className="cursor-pointer rounded-md mt-6 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        + Add new box
      </button>
    </div>
  );
};

export default MenuBoxes;
