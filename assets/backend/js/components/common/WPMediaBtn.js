import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";

export default function WPMediaBtn({ onSelect }) {
  const frameRef = useRef(null);

  const openMediaLibrary = () => {
    if (frameRef.current) {
      frameRef.current.open();
      return;
    }

    frameRef.current = window.wp.media({
      title: "Select Image",
      button: {
        text: "Use this image",
      },
      multiple: false,
    });

    frameRef.current.on("select", () => {
      const attachment = frameRef.current
        .state()
        .get("selection")
        .first()
        .toJSON();

      onSelect?.(attachment);
    });

    frameRef.current.open();
  };

  return (
    <button
      onClick={openMediaLibrary}
      className="rounded-md bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700 cursor-pointer"
    >
      <FontAwesomeIcon icon={faUpload} className="mr-2" />
      Select Media
    </button>
  );
}
