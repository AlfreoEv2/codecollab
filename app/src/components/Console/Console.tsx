import ContentEditable from "../CodeArea/ContentEditable";
import useEditorContext from "../../hooks/useEditorContext";
import "./Console.css";

const Console = () => {
  const { command, setCommand, activeProject } = useEditorContext();
  const message = `Save this ID in a safe place: ${activeProject}. Use this to access you project. You won't see it again. Don't lose it.`;

  return (
    <div className="console-container">
      <div className="console-header">Console</div>
      <div className="console-content"></div>
      <ContentEditable
        html={command}
        onChange={(e) => setCommand(e.currentTarget.innerHTML)}
        className="console-input"
        disabled={true}
      />
      {message}
    </div>
  );
};

export default Console;
