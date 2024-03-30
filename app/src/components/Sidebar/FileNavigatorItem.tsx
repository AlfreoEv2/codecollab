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
  const { activeProject, setFiles, setLines } = useEditorContext();
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

  const findFileFolderRemove = (array: Folder[], itemId: string): boolean => {
    for (let i = 0; i < array.length; i++) {
      const item = array[i];

      if ("filename" in selectedItem) {
        if ("files" in item) {
          const fileIndex = item.files.findIndex((file) => file._id === itemId);
          if (fileIndex !== -1) {
            item.files.splice(fileIndex, 1);
            return true;
          }
        }
      } else if ("folderName" in selectedItem) {
        if (item._id === itemId) {
          item.files = [];
          item.children = [];
          array.splice(i, 1);
          return true;
        }
      }

      if (item.children && item.children.length > 0) {
        const removed = findFileFolderRemove(item.children, itemId);
        if (removed) {
          return true;
        }
      }
    }
    return false;
  };

  const findFileFolderRename = (
    array: Folder[],
    itemId: string,
    itemRename: any
  ): FileOrFolder | null => {
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      if ("filename" in itemRename) {
        if ("files" in item) {
          const foundFile = item.files.find((file) => file._id === itemId);
          if (foundFile) {
            foundFile.filename = itemRename.filename;
            return foundFile;
          }
        }
      } else if ("folderName" in itemRename) {
        if (item._id === itemId) {
          item.folderName = itemRename.folderName;
          return item;
        }
      }
      if (item.children && item.children.length > 0) {
        const foundFile = findFileFolderRename(
          item.children,
          itemId,
          itemRename
        );
        if (foundFile) {
          return foundFile;
        }
      }
    }
    return null;
  };

  const findFileFolderCreate = (
    array: Folder[],
    itemId: string,
    newItem: any
  ): Folder | null => {
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      if (item._id === itemId) {
        if ("filename" in newItem) {
          console.log("We in filename");
          item.files.push({
            _id: newItem._id,
            filename: newItem.filename,
            content: [""],
          });
        } else if ("folderName" in newItem) {
          console.log("We got in foldername: " + newItem.folderName);
          item.children.push({
            _id: newItem._id,
            folderName: newItem.folderName,
            files: newItem.files,
            children: newItem.children,
          });
        }
        return item;
      }
      if (item.children && item.children.length > 0) {
        const foundItem: Folder | null = findFileFolderCreate(
          item.children,
          itemId,
          newItem
        );
        if (foundItem) {
          return foundItem;
        }
      }
    }
    return null;
  };

  const handleCreateFile = async (filename: string) => {
    if ("folderName" in item) {
      try {
        console.log("id: " + item._id + " id and" + activeProject);
        const createdFile = await createFile(filename, item._id);
        setShowCreateFilePopup(false);
        setFiles((prevFiles) => {
          const newFiles = JSON.parse(JSON.stringify(prevFiles));
          findFileFolderCreate(newFiles, item._id, createdFile);
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
        const createdFolder = await createFolder(
          folderName,
          activeProject,
          item._id
        );
        setShowCreateFolderPopup(false);
        setFiles((prevFiles) => {
          const newFiles = JSON.parse(JSON.stringify(prevFiles));
          findFileFolderCreate(newFiles, item._id, createdFolder);
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

            findFileFolderRemove(newFiles, selectedItem._id);
            send({ type: "files", files: newFiles });
            return newFiles;
          });
        } else if ("folderName" in selectedItem) {
          console.log("Trying to delete folder: " + selectedItem.folderName);
          await deleteFolder(selectedItem._id);

          setFiles((prevFiles) => {
            const newFiles = JSON.parse(JSON.stringify(prevFiles));
            findFileFolderRemove(newFiles, selectedItem._id);
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
          const renamedFile = await renameFile(selectedItem._id, newName);
          setFiles((prevFiles) => {
            const newFiles = JSON.parse(JSON.stringify(prevFiles));
            findFileFolderRename(newFiles, selectedItem._id, renamedFile);
            send({ type: "files", files: newFiles });
            return newFiles;
          });
        } else if ("folderName" in selectedItem) {
          const renamedFolder = await renameFolder(selectedItem._id, newName);
          setFiles((prevFiles) => {
            const newFiles = JSON.parse(JSON.stringify(prevFiles));
            findFileFolderRename(newFiles, selectedItem._id, renamedFolder);
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
