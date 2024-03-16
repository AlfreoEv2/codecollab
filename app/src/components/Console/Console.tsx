import ContentEditable from "../CodeArea/ContentEditable";
import useEditorContext from "../../hooks/useEditorContext";
import "./Console.css";

const Console = () => {
  const { command, setCommand } = useEditorContext();

  return (
    <div className="console-container">
      <div className="console-header">Console</div>
      <div className="console-content"></div>
      <ContentEditable
        html={command}
        onChange={(e) => setCommand(e.currentTarget.innerHTML)}
        className="console-input"
      />
    </div>
  );
};

export default Console;
