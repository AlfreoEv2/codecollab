import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FileOrFolder } from "../../interfaces/SidebarInterface";
import { useState } from "react";
import ContextMenu from "../ContextMenu/ContextMenu";
import { createFolder, deleteFolder, renameFolder } from "../../apis/folder";
import CreateFilePopup from "../ContextMenu/CreateFilePopup";
import useEditorContext from "../../hooks/useEditorContext";
import { createFile, deleteFile, renameFile } from "../../apis/file";
import CreateFolderPopup from "../ContextMenu/CreateFolderPopup";
import RenamePopup from "../ContextMenu/RenamePopup";
import useWebSocket from "../../hooks/useWebSocket";

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
};

const FileNavigatorItem = ({ item }: { item: FileOrFolder }) => {
  const [contextMenu, setContextMenu] = useState(initialContextMenu);
  const [showCreateFilePopup, setShowCreateFilePopup] = useState(false);
  const [showCreateFolderPopup, setShowCreateFolderPopup] = useState(false);
  const [showRenamePopup, setShowRenamePopup] = useState(false);
  const { activeProject, files, setFiles } = useEditorContext();
  const [selectedItem, setSelectedItem] = useState<FileOrFolder | null>(null);
  const { send } = useWebSocket("ws://localhost:8080", (data) => {
    if (data.type === "files" && data.files) {
      setFiles(data.files);
    }
  });

  const handleContextMenu = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    item: FileOrFolder
  ) => {
    e.preventDefault();
    const { pageX, pageY } = e;
    setSelectedItem(item);
    setContextMenu({ show: true, x: pageX, y: pageY });
  };

  const contextMenuClose = () => {
    setContextMenu(initialContextMenu);
  };

  const handleCreateFile = async (filename: string) => {
    if ("folderName" in item) {
      try {
        console.log("id: " + item._id + " id and" + activeProject);
        const createFiled = await createFile(filename, item._id);
        setShowCreateFilePopup(false);
        setFiles((prevFiles) => {
          const newFiles = JSON.parse(JSON.stringify(prevFiles));

          function findFolderById(array: any, itemId: any): any {
            for (let i = 0; i < array.length; i++) {
              const item = array[i];
              if (item._id === itemId) {
                console.log("Found it!");
                console.log(item);
                item.files.push({
                  _id: createFiled._id,
                  filename: filename,
                });
                return item;
              }
              if (item.children && item.children.length > 0) {
                const foundItem: any = findFolderById(item.children, itemId);
                if (foundItem) {
                  return foundItem;
                }
              }
            }
            return null;
          }

          findFolderById(newFiles, item._id);

          send({ type: "files", files: newFiles });
          return newFiles;
        });
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

  const handleDeleteFile = async () => {
    console.log("We got in handleDeleteFile");
    console.log("Selected item: " + JSON.stringify(selectedItem));

    if (selectedItem) {
      try {
        if ("filename" in selectedItem) {
          console.log("Trying to delete file: " + selectedItem.filename);
          await deleteFile(selectedItem._id);
        } else if ("folderName" in selectedItem) {
          console.log("Trying to delete folder: " + selectedItem.folderName);
          await deleteFolder(selectedItem._id);
        }
      } catch (error) {
        console.error("Error deleting file/folder:", error);
      }
    }

    contextMenuClose();
  };

  const handleRenameFileFolder = async (newName: string) => {
    if (selectedItem) {
      try {
        if ("filename" in selectedItem) {
          await renameFile(selectedItem._id, newName);
        } else if ("folderName" in selectedItem) {
          await renameFolder(selectedItem._id, newName);
        }
        setShowRenamePopup(false);
      } catch (error) {
        console.error("Error renaming file/folder:", error);
      }
    }
    contextMenuClose();
  };

  const renderFileOrFolder = (item: FileOrFolder) => {
    if ("filename" in item) {
      // Item is a File
      return (
        <li onContextMenu={(e) => handleContextMenu(e, item)}>
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
        <li onContextMenu={(e) => handleContextMenu(e, item)}>
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
      {showRenamePopup && (
        <RenamePopup
          onSubmit={handleRenameFileFolder}
          onCancel={() => setShowRenamePopup(false)}
          initialName={
            selectedItem && "filename" in selectedItem
              ? selectedItem.filename
              : selectedItem && "folderName" in selectedItem
              ? selectedItem.folderName
              : ""
          }
        />
      )}
      {contextMenu.show && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          closeContextMenu={contextMenuClose}
          onCreateFolder={() => setShowCreateFolderPopup(true)}
          onCreateFile={() => setShowCreateFilePopup(true)}
          onDeleteFile={handleDeleteFile}
          onRenameFileFolder={() => setShowRenamePopup(true)}
        />
      )}
      {renderFileOrFolder(item)}
    </>
  );
};

export default FileNavigatorItem;
