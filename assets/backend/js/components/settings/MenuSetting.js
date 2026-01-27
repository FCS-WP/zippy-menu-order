import React, { useEffect, useState } from "react";
import DishesBox from "./DishesBox";
import Button from "../common/button/Button";
import { URL_MENU_SETTINGS } from "../../helpers/constants";
import MenuDetailSection from "./MenuDetailSection";
import MenuBoxes from "./MenuBoxes";
import { useFetchMenu } from "../../hooks/useFetchMenus";
import { toast } from "react-toastify";
import { DishesMenusApi, MenuApi } from "../../api";
import ConfirmPopup from "../common/popup/ConfirmPopup";

export default function MenuSetting() {
  const urlParams = new URLSearchParams(window.location.search);
  const [isOpenPopupConfirm, setIsOpenPopupConfirm] = useState(false);
  const menuId = urlParams.get("menu_id") ?? null;
  const pageType = menuId == 0 ? "new" : "existed";
  const { currentMenu, fetchMenuDetail, isFetched } = useFetchMenu();
  const [menuDetail, setMenuDetail] = useState();
  const [selectedBox, setSelectedBox] = useState();
  const [mainDishesMenu, setMainDishesMenu] = useState([]);
  const [addonsDishesMenu, setAddonsDishesMenu] = useState([]);

  const checkingMenu = () => {
    if (!currentMenu) {
      window.location.href = URL_MENU_SETTINGS;
      window.alert("Invalid Menu");
      return;
    }
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

  const seprateMenusByType = (dishesMenus) => {
    let addons = [];
    let main = [];
    dishesMenus.map((item) => {
      if (item.type == "main") {
        main.push(item);
      } else {
        addons.push(item);
      }
    });

    setAddonsDishesMenu(addons);
    setMainDishesMenu(main);
  };

  useEffect(() => {
    setMenuDetail(currentMenu);
    if (currentMenu?.dishes_menus?.length > 0) {
      seprateMenusByType(currentMenu?.dishes_menus);
    }
  }, [currentMenu]);

  const handleDeleteBox = async (id) => {
    const res = await DishesMenusApi.deleteDishesMenu({
      id: id,
    });
    if (!res || res.status !== "success") {
      toast.error("Failed to delete menu!");
      return;
    }
    toast.success("Box has been deleted!");
    setIsOpenPopupConfirm(false);
    fetchMenuDetail(menuId);
    return;
  };

  const onClickRemoveBox = (item) => {
    setSelectedBox(item);
    setIsOpenPopupConfirm(true);
  };

  return (
    <div className="w-[96%] m-auto">
      <div>
        <div className="mb-8">
          <h2 className="!text-3xl font-bold mb-4">
            {pageType == "new" ? "New Menu" : `Detail - ${menuDetail?.name}`}
          </h2>
          <MenuDetailSection value={menuDetail} onChange={setMenuDetail} />
        </div>
        <MenuBoxes
          boxType={"main"}
          data={mainDishesMenu}
          title={"Main Menu"}
          onClickRemoveBox={onClickRemoveBox}
        />
      </div>
      {/* Addons */}
      <div>
        <MenuBoxes
          boxType={"addons"}
          data={addonsDishesMenu}
          title={"Addons Menu"}
          onClickRemoveBox={onClickRemoveBox}
        />
      </div>

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
