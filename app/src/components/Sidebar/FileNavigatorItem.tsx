import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FileOrFolder } from "../../interfaces/SidebarInterface";
import { useState } from "react";
import ContextMenu from "../../contexts/ContextMenu";

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

  return (
    <>
      {contextMenu.show && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          closeContextMenu={contextMenuClose}
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
