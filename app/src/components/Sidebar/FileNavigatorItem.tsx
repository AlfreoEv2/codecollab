import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FileOrFolder, Folder } from "../../interfaces/SidebarInterface";
import { useState } from "react";
import ContextMenu from "../ContextMenu/ContextMenu";
import { createFolder, deleteFolder, renameFolder } from "../../apis/folder";
import CreateFilePopup from "../ContextMenu/CreateFilePopup";
import useEditorContext from "../../hooks/useEditorContext";
import { createFile, deleteFile, renameFile } from "../../apis/file";
import CreateFolderPopup from "../ContextMenu/CreateFolderPopup";
import RenamePopup from "../ContextMenu/RenamePopup";
import useWebSocket from "../../hooks/useWebSocket";
import { findFileById } from "../../utils/fileUtils";

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
  const { activeProject, setFiles, setLines, activeFile } = useEditorContext();
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

          function findFolderById(
            array: Folder[],
            itemId: string
          ): Folder | null {
            for (let i = 0; i < array.length; i++) {
              const item = array[i];
              if (item._id === itemId) {
                console.log("Found it!");
                console.log(item);
                item.files.push({
                  _id: createFiled._id,
                  filename: filename,
                  content: [""],
                });
                return item;
              }
              if (item.children && item.children.length > 0) {
                const foundItem: Folder | null = findFolderById(
                  item.children,
                  itemId
                );
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
        const createFiled = await createFolder(
          folderName,
          activeProject,
          item._id
        );
        setShowCreateFolderPopup(false);
        setFiles((prevFiles) => {
          const newFiles = JSON.parse(JSON.stringify(prevFiles));

          function findFolderById(
            array: Folder[],
            itemId: string
          ): Folder | null {
            for (let i = 0; i < array.length; i++) {
              const item = array[i];
              if (item._id === itemId) {
                console.log("Found it!");
                console.log(item);
                item.children.push({
                  _id: createFiled._id,
                  folderName: folderName,
                  files: createFiled.files,
                  children: createFiled.children,
                });
                return item;
              }
              if (item.children && item.children.length > 0) {
                const foundItem: Folder | null = findFolderById(
                  item.children,
                  itemId
                );
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

          setFiles((prevFiles) => {
            const newFiles = JSON.parse(JSON.stringify(prevFiles));

            function removeFileById(array: Folder[], itemId: string): boolean {
              for (let i = 0; i < array.length; i++) {
                const item = array[i];

                if ("files" in item) {
                  const fileIndex = item.files.findIndex(
                    (file) => file._id === itemId
                  );
                  if (fileIndex !== -1) {
                    item.files.splice(fileIndex, 1);
                    return true;
                  }
                }

                if (item.children && item.children.length > 0) {
                  const removed = removeFileById(item.children, itemId);
                  if (removed) {
                    return true;
                  }
                }
              }
              return false;
            }

            removeFileById(newFiles, selectedItem._id);
            send({ type: "files", files: newFiles });
            return newFiles;
          });
        } else if ("folderName" in selectedItem) {
          console.log("Trying to delete folder: " + selectedItem.folderName);
          await deleteFolder(selectedItem._id);

          setFiles((prevFiles) => {
            const newFiles = JSON.parse(JSON.stringify(prevFiles));

            function removeFolderById(
              array: Folder[],
              itemId: string
            ): boolean {
              for (let i = 0; i < array.length; i++) {
                const item = array[i];

                if (item._id === itemId) {
                  item.files = [];
                  item.children = [];
                  array.splice(i, 1);
                  return true;
                }

                if (item.children && item.children.length > 0) {
                  const removed = removeFolderById(item.children, itemId);
                  if (removed) {
                    return true;
                  }
                }
              }
              return false;
            }

            removeFolderById(newFiles, selectedItem._id);
            send({ type: "files", files: newFiles });
            return newFiles;
          });
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
          setFiles((prevFiles) => {
            const newFiles = JSON.parse(JSON.stringify(prevFiles));
            const foundFile = findFileById(newFiles, selectedItem._id);
            if (foundFile) {
              foundFile.filename = newName;
              send({ type: "files", files: newFiles });
            }
            return newFiles;
          });
        } else if ("folderName" in selectedItem) {
          await renameFolder(selectedItem._id, newName);
          setFiles((prevFiles) => {
            const newFiles = JSON.parse(JSON.stringify(prevFiles));

            function findFolderById(
              array: Folder[],
              itemId: string
            ): Folder | null {
              for (let i = 0; i < array.length; i++) {
                const item = array[i];
                if (item._id === itemId) {
                  item.folderName = newName;
                  return item;
                }
                if (item.children && item.children.length > 0) {
                  const foundFolder = findFolderById(item.children, itemId);
                  if (foundFolder) {
                    return foundFolder;
                  }
                }
              }
              return null;
            }

            findFolderById(newFiles, selectedItem._id);
            send({ type: "files", files: newFiles });
            return newFiles;
          });
        }
        setShowRenamePopup(false);
      } catch (error) {
        console.error("Error renaming file/folder:", error);
      }
    }
    contextMenuClose();
  };

  const handleFileClick = (item: FileOrFolder) => {
    if ("filename" in item) {
      setLines(item.content);
      activeFile.current = item;
    }
  };

  const renderFileOrFolder = (item: FileOrFolder) => {
    if ("filename" in item) {
      // Item is a File
      return (
        <li
          onContextMenu={(e) => handleContextMenu(e, item)}
          onClick={() => handleFileClick(item)}
        >
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
