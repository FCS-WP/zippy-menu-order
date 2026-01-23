import React, { useEffect, useState } from "react";
import TableView from "../table/TableView";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSettingsProvider } from "../../providers/SettingsProvider";
import Switch from "../common/Switch";
import { URL_MENU_SETTINGS, URL_SINGLE_MENU } from "../../helpers/constants";
import { useFetchMenu } from "../../hooks/useFetchMenus";
import ConfirmPopup from "../common/popup/ConfirmPopup";
import Button from "../common/button/Button";
import { MenuApi } from "../../api";
import { toast } from "react-toastify";

const dataCols = [
  {
    attrs: null,
    title: "ID",
  },
  {
    attrs: null,
    title: "Menu Name",
  },
  {
    attrs: null,
    title: "Active",
  },
  {
    attrs: null,
    title: "Action",
  },
];

const MenuList = () => {
  const [selectedIds, setSelectedIds] = useState();
  const [selectedMenu, setSelectedMenu] = useState();
  const [dataRows, setDataRows] = useState([]);
  const { tableConfigs, setTableConfigs } = useSettingsProvider();
  const [isOpenPopupConfirm, setIsOpenPopupConfirm] = useState(false);
  const [isActivePopupConfirm, setIsActivePopupConfirm] = useState(false);
  const { menus, fetchMenus } = useFetchMenu();

  const handleSelectedRows = (selectedRows) => {
    setSelectedIds(selectedRows);
  };

  const handleEdit = (id) => {
    window.location.href = URL_SINGLE_MENU + "&menu_id=" + id;
  };

  const handleDelete = async (id) => {
    const res = await MenuApi.deleteMenu({
      id: id,
    });
    if (!res || res.status !== "success") {
      toast.error("Failed to delete menu!");
      return;
    }
    reFetchMenu();
    toast.success("Menu has been deleted!");
    setIsOpenPopupConfirm(false);
    return;
  };

  const handleToggleActive = async (id) => {
    const res = await MenuApi.toggleStatus({
      id: id,
    });
    if (!res || res.status !== "success") {
      toast.error("Failed to update menu!");
      return;
    }
    reFetchMenu();
    toast.success("Menu has been updated!");
    setIsActivePopupConfirm(false);
    return;
  };

  const reFetchMenu = () => {
    const fetchParams = {
      page: tableConfigs.page,
      per_page: tableConfigs.rowsPerPage,
    };
    fetchMenus(fetchParams);
  };

  useEffect(() => {
    reFetchMenu();
  }, [tableConfigs]);

  const ActionBox = ({ handleEdit, item }) => {
    return (
      <div className="flex gap-2">
        <Button onClick={() => handleEdit(item.id)}> Edit </Button>
        <Button
          className="bg-red-600 hover:bg-red-700"
          onClick={() => {
            setSelectedMenu(item);
            setIsOpenPopupConfirm(true);
          }}
        >
          <FontAwesomeIcon icon={faTrash} className="text-white" />
        </Button>
      </div>
    );
  };

  const createData = (item) => {
    const { id, name, is_active } = item;

    return {
      id,
      name,
      active: (
        <>
          <Switch
            checked={is_active > 0}
            onChange={() => {
              setSelectedMenu(item);
              setIsActivePopupConfirm(true);
            }}
          />
        </>
      ),
      action: <ActionBox handleEdit={handleEdit} item={item}></ActionBox>,
    };
  };

  const fetchTableData = async () => {
    const dataPage = menus.map((item) => {
      return createData(item);
    });
    setDataRows(dataPage);
  };

  useEffect(() => {
    fetchTableData();
  }, [menus]);

  const updateTableConfig = (newValue) => {
    const newData = { ...tableConfigs, ...newValue };
    setTableConfigs(newData);
  };

  const redirectToAddNew = () => {
    window.location.href = URL_SINGLE_MENU + "&menu_id=0";
  };

  return (
    <div className="w-full mx-auto p-6 bg-white">
      <div className="mb-6 flex justify-end">
        <Button onClick={redirectToAddNew}> + Add new menu</Button>
      </div>
      <TableView
        tableConfig={tableConfigs}
        dataRows={dataRows}
        onUpdateTable={updateTableConfig}
        dataCols={dataCols}
        onSelectedItems={handleSelectedRows}
      />

      <ConfirmPopup
        isOpen={isOpenPopupConfirm}
        title="Delete menu?"
        message="Confirm to delete this menu?"
        onConfirm={() => handleDelete(selectedMenu?.id)}
        onClose={() => setIsOpenPopupConfirm(false)}
      />

      <ConfirmPopup
        isOpen={isActivePopupConfirm}
        title="Update status"
        message="Confirm to update this menu?"
        onConfirm={() => handleToggleActive(selectedMenu.id)}
        onClose={() => setIsActivePopupConfirm(false)}
      />
    </div>
  );
};

export default MenuList;
