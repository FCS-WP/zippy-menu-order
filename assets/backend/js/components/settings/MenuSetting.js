import React, { useState } from "react";
import DishesBox from "./DishesBox";
import Button from "../common/button/Button";
import { URL_MENU_SETTINGS } from "../../helpers/constants";
import MenuDetailSection from "./MenuDetailSection";
import MenuBoxes from "./MenuBoxes";

export default function MenuSetting() {
  const urlParams = new URLSearchParams(window.location.search);
  const menu_id = urlParams.get("menu_id") ?? null;
  const [menuDetail, setMenuDetail] = useState({
    id: 1001,
    name: "Menu - 1123321",
    is_active: true,
    min_pax: 1,
    max_pax: 10,
    price_per_pax: 25,
    dishes_quantity: 5,
  });

  if (!menu_id) {
    window.alert("Invalid Menu");
    window.location.href = URL_MENU_SETTINGS;
    return;
  }

  const [mainMenu, setMainMenu] = useState([
    {
      id: "2845e08d-045b-4722-a797-df23dbb9f0f9",
      name: "Main Dishes",
      dishes: [
        {
          id: "d5",
          name: "Seafood Soup",
        },
        {
          id: "d3",
          name: "Beef Noodles",
        },
      ],
    },
    {
      id: "7814b9e0-b078-4315-8309-55d512cd9d6f",
      name: "Year End Party",
      dishes: [
        {
          id: "d4",
          name: "Spring Rolls",
        },
        {
          id: "d2",
          name: "Grilled Chicken",
        },
        {
          id: "d1",
          name: "Fried Rice",
        },
      ],
    },
    {
      id: "941be8c0-ccc4-4792-9de4-fc4a0ebdd1aa",
      name: "Winter",
      dishes: [
        {
          id: "d5",
          name: "Seafood Soup",
        },
        {
          id: "d3",
          name: "Beef Noodles",
        },
      ],
    },
  ]);

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

  const handleSaveChanges = () => {
    console.log(mainMenu);
  };

  return (
    <div className="w-[96%] m-auto">
      <div>
        <div className="mb-8">
          <h2 className="!text-3xl font-bold mb-4">Detail Menu - 1123321</h2>
          <MenuDetailSection value={menuDetail} onChange={setMenuDetail} />
        </div>
        <MenuBoxes data={mainMenu} title={"Main Menu"} />
      </div>
      {/* Addons */}
      <div>
        <MenuBoxes data={mainMenu} title={"Addons Menu"} />
      </div>
      <Button
        onClick={handleSaveChanges}
        className="cursor-pointer rounded-md mt-6 bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-green-300"
      >
        Save Changes
      </Button>
    </div>
  );
}
