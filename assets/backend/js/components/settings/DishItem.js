import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Button from "../common/button/Button";

const DishItem = ({ dish, onRemoveDish, updateDishField }) => {

  return (
    <div className="flex items-center gap-2 mb-4 bg-green-100 px-4 py-2">
      <div className="dish-name w-2/4">
        <span className="font-bold">{dish?.name ?? ""}</span>
      </div>
      <div className="dish-extra-prices grow-1">
         <input
            type="number"
            min={0}
            value={dish?.extra_price ?? 0}
            onChange={(e) => updateDishField("extra_price", e.target.value, dish.product_id)}
            className="w-full rounded-md border px-3 py-2 text-sm bg-white"
          />
      </div>
      <div className="justify-self-end w-24">
        <Button
          className="bg-white border-0 py-0 hover:underline hover:text-red-400"
          onClick={() => onRemoveDish(dish)}
        >
          remove
        </Button>
      </div>
    </div>
  );
};

export default DishItem;
