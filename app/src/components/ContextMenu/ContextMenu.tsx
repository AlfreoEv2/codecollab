import React from "react";
import "./ContextMenu.css";

interface ContextMenuProps {
  x: number;
  y: number;
  closeContextMenu: () => void;
  onCreateFolder: () => void;
  onCreateFile: () => void;
  onDeleteFile: () => void;
  onRenameFileFolder: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  closeContextMenu,
  onCreateFolder,
  onCreateFile,
  onDeleteFile,
  onRenameFileFolder,
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
      <div onClick={onCreateFile}>Create File</div>
      <div onClick={onDeleteFile}>Delete</div>
      <div onClick={onRenameFileFolder}>Rename</div>
    </div>
  );
};

export default ContextMenu;
