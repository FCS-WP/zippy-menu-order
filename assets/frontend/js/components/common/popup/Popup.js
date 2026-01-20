import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import Button from "../button/Button";

const Popup = ({
  isOpen,
  onClose,
  size = "md",
  customSize = "",
  height = "auto",
  customHeight = "",
  scroll = "no-scroll",
  customScroll = "",
  children,
  className = "",
}) => {
  if (!isOpen) return null;

  const sizeClasses = { sm: "w-72", md: "w-96 ", lg: "w-[400px] lg:w-[700px]" };
  const heightClasses = {
    sm: "h-48",
    md: "h-72",
    lg: "lg:h-[400px] h-[300px]",
  };
  const scrollClasses = {
    "no-scroll": "overflow-y-hidden",
    "custom-scroll": "overflow-y-auto custom-scroll",
  };
  const popupSize = customSize || sizeClasses[size] || size;
  const popupcroll = customScroll || scrollClasses[scroll] || scroll;
  const popupHeight = customHeight || heightClasses[height] || height;

  const childArray = React.Children.toArray(children);

  const header = childArray.find((child) => child.type === Popup.Header);
  const body = childArray.find((child) => child.type === Popup.Body);
  const footer = childArray.find((child) => child.type === Popup.Footer);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`animate-slideUp relative max-w-full rounded-2xl bg-white p-6 shadow-lg transition duration-300 ease-in-out ${popupSize} ${className} `}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>{header}</div>

          <Button onClick={onClose} className="text-black hover:text-gray-600">
            <FontAwesomeIcon size="lg" icon={faClose} />
          </Button>
        </div>

        {/* Body */}
        <div className={`max-${popupHeight} ${popupHeight} ${popupcroll}`}>
          {body}
        </div>

        {/* Footer */}
        {footer}
      </div>
    </div>
  );
};

/* Header Slot */
Popup.Header = ({ children }) => (
  <h3 className="text-primary !my-0 font-sans text-2xl">{children}</h3>
);

/* Body Slot */
Popup.Body = ({ children }) => <div className="text-gray-700">{children}</div>;

/* Footer Slot */
Popup.Footer = ({ children }) => (
  <div className="flex justify-end gap-3">{children}</div>
);

export default Popup;
