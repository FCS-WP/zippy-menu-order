import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons";
import "./BackButton.scss";

const BackButton = ({ href, onClick, children }) => {
  const className = "back-button";

  if (href) {
    return (
      <a href={href} className={className}>
        <FontAwesomeIcon icon={faChevronCircleLeft} />
        <span className="back-button__text">{children}</span>
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      <FontAwesomeIcon icon={faChevronCircleLeft} />
      <span className="back-button__text">{children}</span>
    </button>
  );
};

export default BackButton;
