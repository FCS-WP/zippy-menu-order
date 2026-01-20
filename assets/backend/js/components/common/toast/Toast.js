import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
  faCircleInfo,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

const CustomToastIcon = ({ type }) => {
  const icons = {
    success: <FontAwesomeIcon icon={faCircleCheck} size="lg" color="#22c55e" />,
    error: <FontAwesomeIcon icon={faCircleXmark} size="lg" color="#ef4444" />,
    info: <FontAwesomeIcon icon={faCircleInfo} size="lg" color="#3b82f6" />,
    warning: (
      <FontAwesomeIcon icon={faTriangleExclamation} size="lg" color="#eab308" />
    ),
  };
  return icons[type] || null;
};

const CustomToastContainer = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      pauseOnFocusLoss
      draggable
      newestOnTop
      theme="light"
      icon={(props) => <CustomToastIcon type={props?.type} />}
      className="custom-toast-container"
      toastClassName="custom-toast"
    />
  );
};

export default CustomToastContainer;
