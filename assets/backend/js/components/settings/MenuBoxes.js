import React, { useState } from "react";
import DishesBox from "./DishesBox";

const MenuBoxes = ({ data, title, onClickRemoveBox }) => {
  const [boxes, setBoxes] = useState(data);
  // Add new box
  const addBox = () => {
    setBoxes((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", dishes: [] },
    ]);
  };

  // Update box name
  const updateBoxName = (boxId, value) => {
    setBoxes((prev) =>
      prev.map((box) => (box.id === boxId ? { ...box, name: value } : box)),
    );
  };

  // Add dish to box (prevent duplicate)
  const addDishToBox = (boxId, dish) => {
    setBoxes((prev) =>
      prev.map((box) => {
        if (box.id !== boxId) return box;
        if (box.dishes.some((d) => d.id === dish.id)) return box;

        return {
          ...box,
          dishes: [...box.dishes, dish],
        };
      }),
    );
  };

  return (
    <div>
      <div>
        <h2 className="!text-3xl font-bold mb-4">{title}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {boxes.map((box) => (
            <DishesBox
              key={box.id}
              box={box}
              onClickRemoveBox={onClickRemoveBox}
              addDishToBox={addDishToBox}
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
