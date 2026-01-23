import React, { useEffect, useState } from "react";
import DishesBox from "./DishesBox";
import Button from "../common/button/Button";
import { URL_MENU_SETTINGS } from "../../helpers/constants";
import MenuDetailSection from "./MenuDetailSection";
import MenuBoxes from "./MenuBoxes";
import { useFetchMenu } from "../../hooks/useFetchMenus";
import { toast } from "react-toastify";
import { MenuApi } from "../../api";
import ConfirmPopup from "../common/popup/ConfirmPopup";

export default function MenuSetting() {
  const urlParams = new URLSearchParams(window.location.search);
  const [isOpenPopupConfirm, setIsOpenPopupConfirm] = useState(false);
  const menuId = urlParams.get("menu_id") ?? null;
  const pageType = menuId == 0 ? "new" : "existed";
  const { currentMenu, fetchMenuDetail, isFetched } = useFetchMenu();
  const [menuDetail, setMenuDetail] = useState();
  const [selectedBox, setSelectedBox] = useState();
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

  const checkingMenu = () => {
    if (!currentMenu) {
      window.location.href = URL_MENU_SETTINGS;
      window.alert("Invalid Menu");
      return;
    }
  };

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

  useEffect(() => {
    if (pageType === "new") return;
    const getDetail = async () => {
      await fetchMenuDetail(menuId);
    };

    if (menuId) {
      getDetail();
    }
  }, [menuId]);

  useEffect(() => {
    if (isFetched) {
      checkingMenu();
    }
  }, [isFetched]);

  useEffect(() => {
    setMenuDetail(currentMenu);
  }, [currentMenu]);

  const handleDeleteBox = async (id) => {
    // const res = await MenuApi.deleteMenu({
    //   id: id,
    // });
    // if (!res || res.status !== "success") {
    //   toast.error("Failed to delete menu!");
    //   return;
    // }
    // toast.success("Box has been deleted!");
    // setIsOpenPopupConfirm(false);
    // return;
    console.log("Delete Box", id);
    setIsOpenPopupConfirm(false);
  };

  const onClickRemoveBox = (item) => {
    setSelectedBox(item);
    setIsOpenPopupConfirm(true);
  }

  return (
    <div className="w-[96%] m-auto">
      <div>
        <div className="mb-8">
          <h2 className="!text-3xl font-bold mb-4">
            {pageType == "new" ? "New Menu" : `Detail - ${menuDetail?.name}`}
          </h2>
          <MenuDetailSection value={menuDetail} onChange={setMenuDetail} />
        </div>
        <MenuBoxes data={mainMenu} title={"Main Menu"} onClickRemoveBox={onClickRemoveBox} />
      </div>
      {/* Addons */}
      <div>
        <MenuBoxes data={mainMenu} title={"Addons Menu"} onClickRemoveBox={onClickRemoveBox} />
      </div>
      <Button
        onClick={handleSaveChanges}
        className="cursor-pointer rounded-md mt-6 bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-green-300"
      >
        Save Changes
      </Button>

      <ConfirmPopup
        isOpen={isOpenPopupConfirm}
        title="Delete menu?"
        message="Confirm to delete this menu?"
        onConfirm={() => handleDeleteBox(selectedBox.id)}
        onClose={() => setIsOpenPopupConfirm(false)}
      />
    </div>
  );
}
