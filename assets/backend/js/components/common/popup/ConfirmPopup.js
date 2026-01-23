import React from "react";
import Popup from "../popup/Popup";
import Button from "../button/Button";

const ConfirmPopup = ({
  isOpen,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "bg-red-500 hover:bg-red-600",
  onClose,
  onConfirm,
  children,
}) => {
  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      height="auto"
      className="border-red-500 border-y-4"
    >
      <Popup.Header>{title}</Popup.Header>

      <Popup.Body>
        {children ? (
          children
        ) : (
          <p dangerouslySetInnerHTML={{ __html: message }} />
        )}
      </Popup.Body>

      <Popup.Footer>
        <div className="mt-3 flex justify-end gap-3">
          <Button
            className="bg-gray-500 text-white hover:bg-gray-600"
            onClick={onClose}
          >
            {cancelText}
          </Button>

          <Button
            className={`${confirmColor} text-white py-2 px-3`}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </Popup.Footer>
    </Popup>
  );
};

export default ConfirmPopup;
