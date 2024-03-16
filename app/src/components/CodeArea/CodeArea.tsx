import ContentEditable from "./ContentEditable";
import useEditorContext from "../../hooks/useEditorContext";
import "./CodeArea.css";

const CodeArea = () => {
  const { lines, handleLineChange, handleLineEnter } = useEditorContext();

  return (
    <div className="code-area">
      {lines.map((line, index) => (
        <div key={index} className="line-container">
          <div className="line-number">{index + 1}</div>
          <ContentEditable
            html={line}
            className="line-content"
            onChange={(e) => handleLineChange(e, index)}
            onKeyDown={(e) => handleLineEnter(e, index)}
          />
        </div>
      ))}
    </div>
  );
};

export default CodeArea;
