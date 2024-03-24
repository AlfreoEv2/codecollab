import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FileOrFolder } from "../../interfaces/SidebarInterface";
import { useState } from "react";
import ContextMenu from "./ContextMenu";
import { createFolder } from "../../apis/folder";

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
};

const FileNavigatorItem = ({ file }: { file: FileOrFolder }) => {
  const [contextMenu, setContextMenu] = useState(initialContextMenu);

  const handleContextMenu = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    e.preventDefault();
    const { pageX, pageY } = e;
    setContextMenu({ show: true, x: pageX, y: pageY });
  };

  const contextMenuClose = () => {
    setContextMenu(initialContextMenu);
  };

  const handleCreateFolder = async () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      try {
        await createFolder(
          folderName,
          "63e4d7e4c5d8d7c8b0f9d6b3",
          "65ff6a1e4e99d89e4964b8a0"
        );
      } catch (error) {
        console.error("Error creating folder:", error);
      }
    }
    contextMenuClose();
  };

  return (
    <>
      {contextMenu.show && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          closeContextMenu={contextMenuClose}
          onCreateFolder={handleCreateFolder}
        />
      )}
      <li onContextMenu={(e) => handleContextMenu(e)}>
        <FontAwesomeIcon
          icon={["fas", file.type === "file" ? "file" : "folder"]}
          className="file-navigator-icon"
        />
        {file.name}
        {file.type === "folder" && file.children && (
          <ul>
            {file.children.map((child, index) => (
              <FileNavigatorItem key={index} file={child} />
            ))}
          </ul>
        )}
      </li>
    </>
  );
};

export default FileNavigatorItem;
