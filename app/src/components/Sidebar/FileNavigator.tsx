import FileNavigatorItem from "./FileNavigatorItem";
import { FileNavigatorProps } from "../../interfaces/SidebarInterface";
import "./FileNavigator.css";

const FileNavigator = ({ files }: FileNavigatorProps) => {
  return (
    <div className="file-navigator">
      <ul>
        {files.map((file, index) => (
          <FileNavigatorItem key={index} file={file} />
        ))}
      </ul>
    </div>
  );
};

export default FileNavigator;
