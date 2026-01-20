import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons";

const BackButton = ({ href, onClick, children }) => {
  const baseClass =
    "mb-4 flex items-center gap-2 text-sm !text-secondary hover:!text-secondary-500 cursor-pointer ";

  if (href) {
    return (
      <a
        href={href}
        className={
          "!text-secondary hover:!text-secondary-500 focus:!shadow-none " +
          baseClass
        }
      >
        <FontAwesomeIcon icon={faChevronCircleLeft} /> {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseClass}>
      <FontAwesomeIcon icon={faChevronCircleLeft} /> {children}
    </button>
  );
};

export default BackButton;
