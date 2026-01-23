import React from "react";
import Popup from "../popup/Popup";
import Button from "../common/button/Button";

const DeleteStorePopup = ({ isOpen, storeName, onClose, onConfirm }) => {
  return (
    <Popup isOpen={isOpen} onClose={onClose} size="md" height="auto" className="border-red-500 border-y-4">
      <Popup.Header>Delete Store</Popup.Header>

      <Popup.Body>
        <p>
          Are you sure you want to delete <strong>{storeName}</strong>?
        </p>
      </Popup.Body>

      <Popup.Footer>
        <div className="mt-3 flex justify-end gap-3">
          <Button
            className="bg-gray-500 text-white hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-500 text-white hover:bg-red-600 py-2 px-3"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </Popup.Footer>
    </Popup>
  );
};

export default DeleteStorePopup;
