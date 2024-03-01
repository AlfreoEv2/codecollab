import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FileOrFolder } from "../../interfaces/SidebarInterface";

const FileNavigatorItem = ({ file }: { file: FileOrFolder }) => {
  return (
    <li>
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
  );
};

export default FileNavigatorItem;
