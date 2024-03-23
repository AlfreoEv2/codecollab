import React from "react";
import "./ContextMenu.css";

interface ContextMenuProps {
  x: number;
  y: number;
  closeContextMenu: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  closeContextMenu,
}) => {
  return (
    <div
      className="context-menu"
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
      }}
      onMouseLeave={closeContextMenu}
    >
      <div>Create Folder</div>
      <div>Create File</div>
      <div>Delete</div>
      <div>Rename</div>
    </div>
  );
};

export default ContextMenu;
