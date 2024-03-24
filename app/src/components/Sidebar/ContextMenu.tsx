import React from "react";
import "./ContextMenu.css";

interface ContextMenuProps {
  x: number;
  y: number;
  closeContextMenu: () => void;
  onCreateFolder: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  closeContextMenu,
  onCreateFolder,
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
      <div onClick={onCreateFolder}>Create Folder</div>
      <div>Create File</div>
      <div>Delete</div>
      <div>Rename</div>
    </div>
  );
};

export default ContextMenu;
