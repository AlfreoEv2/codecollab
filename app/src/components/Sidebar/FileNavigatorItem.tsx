import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { File, Folder, FileOrFolder } from "../../interfaces/SidebarInterface";
import { useState } from "react";
import ContextMenu from "../ContextMenu/ContextMenu";
import { createFolder } from "../../apis/folder";
import CreateFilePopup from "../ContextMenu/CreateFilePopup";
import useEditorContext from "../../hooks/useEditorContext";
import { createFile } from "../../apis/file";
import CreateFolderPopup from "../ContextMenu/CreateFolderPopup";

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
};

const FileNavigatorItem = ({ item }: { item: FileOrFolder }) => {
  const [contextMenu, setContextMenu] = useState(initialContextMenu);
  const [showCreateFilePopup, setShowCreateFilePopup] = useState(false);
  const [showCreateFolderPopup, setShowCreateFolderPopup] = useState(false);
  const { activeProject } = useEditorContext();

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

  const handleCreateFile = async (filename: string) => {
    if ("folderName" in item) {
      try {
        console.log("id: " + item._id + " id and" + activeProject);
        await createFile(filename, item._id);
        setShowCreateFilePopup(false);
      } catch (error) {
        console.error("Error creating file:", error);
      }
    }
    contextMenuClose();
  };

  const handleCreateFolder = async (folderName: string) => {
    if ("folderName" in item && activeProject !== null) {
      try {
        await createFolder(folderName, activeProject, item._id);
        setShowCreateFolderPopup(false);
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
      {showCreateFilePopup && (
        <CreateFilePopup
          onSubmit={handleCreateFile}
          onCancel={() => setShowCreateFilePopup(false)}
        />
      )}
      {showCreateFolderPopup && (
        <CreateFolderPopup
          onSubmit={handleCreateFolder}
          onCancel={() => setShowCreateFolderPopup(false)}
        />
      )}
      {contextMenu.show && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          closeContextMenu={contextMenuClose}
          onCreateFolder={() => setShowCreateFolderPopup(true)}
          onCreateFile={() => setShowCreateFilePopup(true)}
        />
      )}
      {renderFileOrFolder(item)}
    </>
  );
};

export default FileNavigatorItem;
