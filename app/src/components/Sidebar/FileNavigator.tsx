import FileNavigatorItem from "./FileNavigatorItem";
import useEditorContext from "../../hooks/useEditorContext";
import "./FileNavigator.css";

const FileNavigator = () => {
  const { files } = useEditorContext();

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
