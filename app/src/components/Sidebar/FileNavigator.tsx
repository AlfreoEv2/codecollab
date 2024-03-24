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
      <ul>{renderFileOrFolderItems(files)}</ul>
    </div>
  );
};

export default FileNavigator;
