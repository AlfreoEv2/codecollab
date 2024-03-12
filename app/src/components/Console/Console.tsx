import ContentEditable from "../CodeArea/ContentEditable";
import "./Console.css";

const Console = () => {
  return (
    <div className="console-container">
      <div className="console-header">Console</div>
      <div className="console-content"></div>
      <ContentEditable className="console-input" html="" />
    </div>
  );
};

export default Console;
