import FileNavigatorItem from "./FileNavigatorItem";
import useEditorContext from "../../hooks/useEditorContext";
import { FileOrFolder } from "../../interfaces/SidebarInterface";
import "./FileNavigator.css";

const FileNavigator = () => {
  const { files } = useEditorContext();

  const renderFileOrFolderItems = (items: FileOrFolder[]) => {
    return items.map((item, index) => (
      <FileNavigatorItem key={index} item={item} />
    ));
  };

  return (
    <div className="file-navigator">
      {files.length > 0 ? (
        <ul>{renderFileOrFolderItems(files)}</ul>
      ) : (
        <p>No files or folders available.</p>
      )}
    </div>
  );
};

export default FileNavigator;
