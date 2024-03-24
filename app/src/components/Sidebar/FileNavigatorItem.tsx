import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { File, Folder, FileOrFolder } from "../../interfaces/SidebarInterface";
import { useState } from "react";
import ContextMenu from "./ContextMenu";
import { createFolder } from "../../apis/folder";

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
};

const FileNavigatorItem = ({ item }: { item: FileOrFolder }) => {
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

  const renderFileOrFolder = (item: FileOrFolder) => {
    if ("filename" in item) {
      // Item is a File
      return (
        <li>
          <FontAwesomeIcon
            icon={["fas", "file"]}
            className="file-navigator-icon"
          />
          {item.filename}
        </li>
      );
    } else {
      // Item is a Folder
      return (
        <li onContextMenu={(e) => handleContextMenu(e)}>
          <FontAwesomeIcon
            icon={["fas", "folder"]}
            className="file-navigator-icon"
          />
          {item.folderName}
          {item.children && (
            <ul>
              {item.children.map((child, index) => (
                <FileNavigatorItem key={index} item={child} />
              ))}
              {item.files.map((file, index) => (
                <FileNavigatorItem key={index} item={file} />
              ))}
            </ul>
          )}
        </li>
      );
    }
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
      {renderFileOrFolder(item)}
    </>
  );
};

export default FileNavigatorItem;
